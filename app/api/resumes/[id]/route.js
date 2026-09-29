import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export const runtime = "nodejs";

// Fetch one resume including its extracted text.
export async function GET(_request, { params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: r, error } = await supabase
    .from("resumes")
    .select("id, filename, file_size_bytes, summary, skills, sections, created_at, raw_text")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    resume: {
      id: r.id,
      filename: r.filename,
      fileSize: `${Math.max(1, Math.round(r.file_size_bytes / 1024))} KB`,
      uploadedAt: r.created_at,
      skills: r.skills,
      sections: { ...r.sections, summary: r.sections?.summary || r.summary || "" },
      extractedText: r.raw_text,
    },
  });
}

// Deletes the resume; its vector chunks are removed by ON DELETE CASCADE.
export async function DELETE(_request, { params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.from("resumes").delete().eq("id", id).select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
