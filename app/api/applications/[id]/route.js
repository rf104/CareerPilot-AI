import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { APP_COLUMNS, toClientApp, parseApplication } from "../../../lib/applications";

export const runtime = "nodejs";

async function authed() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { supabase, user } = await authed();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { value, error: invalid } = parseApplication(await request.json().catch(() => null), { partial: true });
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const { data, error } = await supabase
    .from("applications")
    .update(value)
    .eq("id", id)
    .select(APP_COLUMNS)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ application: toClientApp(data) });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const { supabase, user } = await authed();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.from("applications").delete().eq("id", id).select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
