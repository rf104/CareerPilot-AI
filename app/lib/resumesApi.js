// Client helpers for the /api/resumes endpoints.
async function handle(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed.");
  return body;
}

export async function fetchResumes() {
  const body = await handle(await fetch("/api/resumes"));
  return body.resumes;
}

export async function fetchResume(id) {
  const body = await handle(await fetch(`/api/resumes/${id}`));
  return body.resume;
}

export async function uploadResume(file) {
  const form = new FormData();
  form.append("file", file);
  const body = await handle(await fetch("/api/resumes", { method: "POST", body: form }));
  return body.resume;
}

export async function removeResume(id) {
  await handle(await fetch(`/api/resumes/${id}`, { method: "DELETE" }));
}
