// Client helpers for the /api/applications endpoints.
async function handle(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed.");
  return body;
}

const json = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export async function fetchApplications() {
  return (await handle(await fetch("/api/applications"))).applications;
}

export async function createApplication(data) {
  return (await handle(await fetch("/api/applications", json("POST", data)))).application;
}

export async function updateApplication(id, data) {
  return (await handle(await fetch(`/api/applications/${id}`, json("PATCH", data)))).application;
}

export async function deleteApplication(id) {
  await handle(await fetch(`/api/applications/${id}`, { method: "DELETE" }));
}
