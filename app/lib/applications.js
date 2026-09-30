// Server-side helpers shared by the /api/applications routes.
export const STATUSES = ["Wishlist", "Applied", "Assessment", "Interview", "Offer", "Rejected"];

export const APP_COLUMNS = "id, company, position, description, location, url, date_applied, status, created_at";

export const toClientApp = (r) => ({
  id: r.id,
  company: r.company,
  position: r.position,
  description: r.description,
  location: r.location,
  url: r.url,
  dateApplied: r.date_applied,
  status: r.status,
});

// Validates/normalizes a request body. Returns { value } or { error }.
export function parseApplication(body, { partial = false } = {}) {
  if (!body || typeof body !== "object") return { error: "Invalid request body." };
  const out = {};
  const str = (key, max, required) => {
    if (body[key] === undefined) {
      if (required && !partial) return `${key} is required.`;
      return null;
    }
    if (typeof body[key] !== "string") return `${key} must be text.`;
    const v = body[key].trim();
    if (required && !v) return `${key} is required.`;
    if (v.length > max) return `${key} is too long.`;
    out[key] = v;
    return null;
  };

  const errors = [
    str("company", 200, true),
    str("position", 200, true),
    str("description", 20000, false),
    str("location", 200, false),
    str("url", 1000, false),
  ].filter(Boolean);
  if (errors.length) return { error: errors[0] };

  if (out.url && !/^https?:\/\//i.test(out.url)) return { error: "URL must start with http:// or https://." };

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return { error: "Invalid status." };
    out.status = body.status;
  }
  if (body.dateApplied !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.dateApplied)) return { error: "Invalid date." };
    out.date_applied = body.dateApplied;
  }
  return { value: out };
}
