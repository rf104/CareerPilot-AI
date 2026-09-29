import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";
import {
  LIMITS,
  pdfToText,
  hashText,
  extractSkills,
  parseSections,
  chunkOffsets,
  embedTexts,
} from "../../lib/resumeProcessing";

export const runtime = "nodejs";
export const maxDuration = 60;

const COLUMNS = "id, filename, file_size_bytes, summary, skills, sections, created_at";

const toClient = (r, withText) => ({
  id: r.id,
  filename: r.filename,
  fileSize: `${Math.max(1, Math.round(r.file_size_bytes / 1024))} KB`,
  uploadedAt: r.created_at,
  skills: r.skills,
  sections: { ...r.sections, summary: r.sections?.summary || r.summary || "" },
  ...(withText ? { extractedText: r.raw_text } : {}),
});

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// List the caller's resumes (RLS guarantees only their own rows).
export async function GET() {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("resumes")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ resumes: data.map((r) => toClient(r, false)) });
}

// Upload a PDF: parse → chunk → embed → store text + vectors (PDF is discarded).
export async function POST(request) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > LIMITS.maxFileBytes) {
    return NextResponse.json({ error: "File is too large (max 5 MB)." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return NextResponse.json({ error: "That file is not a valid PDF." }, { status: 400 });
  }

  const { count } = await supabase.from("resumes").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= LIMITS.maxResumesPerUser) {
    return NextResponse.json(
      { error: `You can store up to ${LIMITS.maxResumesPerUser} resumes. Delete one first.` },
      { status: 409 }
    );
  }

  let text;
  try {
    text = await pdfToText(buffer);
  } catch {
    return NextResponse.json({ error: "Could not read this PDF." }, { status: 422 });
  }
  if (text.length < 50) {
    return NextResponse.json(
      { error: "No readable text found. Scanned/image-only PDFs aren't supported yet." },
      { status: 422 }
    );
  }

  const sections = parseSections(text);
  const skills = extractSkills(text);
  const chunks = chunkOffsets(text);

  let vectors;
  try {
    vectors = await embedTexts(chunks.map((c) => text.slice(c.start, c.end)));
  } catch (err) {
    console.error("Embedding failed:", err);
    return NextResponse.json({ error: "Could not analyze the resume. Please try again." }, { status: 500 });
  }

  const { summary, ...restSections } = sections;
  const { data: resume, error: insertError } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      filename: file.name.slice(0, 200),
      file_size_bytes: file.size,
      content_hash: hashText(text),
      summary,
      skills,
      sections: restSections,
      raw_text: text,
    })
    .select(`${COLUMNS}, raw_text`)
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ error: "You've already uploaded this resume." }, { status: 409 });
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { error: chunkError } = await supabase.from("resume_chunks").insert(
    chunks.map((c, i) => ({
      resume_id: resume.id,
      user_id: user.id,
      chunk_index: c.index,
      char_start: c.start,
      char_end: c.end,
      embedding: vectors[i],
    }))
  );
  if (chunkError) {
    await supabase.from("resumes").delete().eq("id", resume.id); // roll back
    return NextResponse.json({ error: chunkError.message }, { status: 500 });
  }

  return NextResponse.json({ resume: toClient({ ...resume, summary }, true) }, { status: 201 });
}
