// Server-only client for Google's Gemini API (free tier, https://aistudio.google.com/apikey).
// Used for both embeddings and the LLM match analysis. Plain fetch, no SDK.
const BASE = "https://generativelanguage.googleapis.com/v1beta";

export const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
export const EMBEDDING_DIMS = 384; // must match halfvec(384) in the migration
export const LLM_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

export class GeminiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

export const geminiConfigured = () => !!process.env.GEMINI_API_KEY;

async function call(path, body, { retries = 2 } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError("GEMINI_API_KEY is not set.", 503);

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    });
    if (res.ok) return res.json();

    // Free tier: back off briefly on rate limits / transient errors.
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      continue;
    }
    const text = (await res.text()).slice(0, 300);
    throw new GeminiError(`Gemini ${res.status}: ${text}`, res.status);
  }
}

// ---------------------------------------------------------------- embeddings
function normalize(v) {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

// Returns pgvector-literal strings ("[0.1234,...]"). Reduced-dimension Gemini
// embeddings must be re-normalized for cosine similarity to behave.
export async function embedTexts(texts, taskType = "RETRIEVAL_DOCUMENT") {
  const out = [];
  for (let i = 0; i < texts.length; i += 50) {
    const batch = texts.slice(i, i + 50);
    const data = await call(`models/${EMBEDDING_MODEL}:batchEmbedContents`, {
      requests: batch.map((text) => ({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: EMBEDDING_DIMS,
      })),
    });
    for (const e of data.embeddings) {
      out.push(`[${normalize(e.values).map((v) => v.toFixed(4)).join(",")}]`);
    }
  }
  return out;
}

// -------------------------------------------------------------- LLM (JSON out)
export async function generateJson({ system, user, schema }) {
  const build = (withSchema) => ({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: {
      responseMimeType: "application/json",
      ...(withSchema ? { responseJsonSchema: schema } : {}),
      temperature: 0.2,
      maxOutputTokens: 8192,
    },
  });

  let data;
  try {
    data = await call(`models/${LLM_MODEL}:generateContent`, build(true));
  } catch (err) {
    // Schema keyword not accepted by this model version: retry relying on the prompt's JSON shape.
    if (err instanceof GeminiError && err.status === 400) {
      data = await call(`models/${LLM_MODEL}:generateContent`, build(false));
    } else {
      throw err;
    }
  }

  if (data.promptFeedback?.blockReason) throw new GeminiError("Prompt blocked by the AI provider.", 422);
  const cand = data.candidates?.[0];
  if (!cand || cand.finishReason === "SAFETY") throw new GeminiError("No usable response.", 422);
  if (cand.finishReason === "MAX_TOKENS") throw new GeminiError("Response was cut off.", 502);

  const text = (cand.content?.parts || []).map((p) => p.text || "").join("");
  try {
    return JSON.parse(text);
  } catch {
    throw new GeminiError("Model returned invalid JSON.", 502);
  }
}
