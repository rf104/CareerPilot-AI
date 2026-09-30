// Client helpers for /api/match.
async function handle(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed.");
  return body;
}

export async function analyzeMatch(payload) {
  const res = await fetch("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await handle(res)).result;
}

export async function fetchMatchHistory() {
  return (await handle(await fetch("/api/match"))).results;
}
