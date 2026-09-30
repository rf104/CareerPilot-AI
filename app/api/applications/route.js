import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";
import { APP_COLUMNS, toClientApp, parseApplication } from "../../lib/applications";

export const runtime = "nodejs";

const MAX_APPLICATIONS = 500;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("applications")
    .select(APP_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: data.map(toClientApp) });
}

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { value, error: invalid } = parseApplication(await request.json().catch(() => null));
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const { count } = await supabase.from("applications").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= MAX_APPLICATIONS) {
    return NextResponse.json({ error: "Application limit reached." }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({ ...value, user_id: user.id })
    .select(APP_COLUMNS)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ application: toClientApp(data) }, { status: 201 });
}
