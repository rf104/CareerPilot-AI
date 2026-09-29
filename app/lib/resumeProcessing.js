// Server-only helpers: PDF → text → skills/sections → chunks → embeddings.
import { createHash } from "node:crypto";
import { extractText, getDocumentProxy } from "unpdf";

export const LIMITS = {
  maxFileBytes: 5 * 1024 * 1024,
  maxTextChars: 60_000,
  maxResumesPerUser: 5,
  chunkChars: 800,
};

export const EMBEDDING_MODEL = "Supabase/gte-small"; // 384 dimensions

// ------------------------------------------------------------------ PDF text
export async function pdfToText(buffer) {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return normalizeText(text);
}

function normalizeText(text) {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, LIMITS.maxTextChars);
}

export const hashText = (text) => createHash("sha256").update(text).digest("hex");

// -------------------------------------------------------------------- skills
const SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", "SQL", "Bash",
  "React", "Next.js", "Vue", "Angular", "Svelte", "Redux", "Node.js", "Express", "NestJS", "Django", "Flask", "FastAPI", "Spring Boot", ".NET", "Laravel", "Rails",
  "HTML", "CSS", "Tailwind CSS", "Sass", "Bootstrap", "GraphQL", "REST APIs", "WebSockets", "gRPC",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "Elasticsearch", "Supabase", "Firebase", "Prisma",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "GitHub Actions", "Jenkins", "Linux", "Nginx",
  "Git", "Jest", "Cypress", "Playwright", "Vitest", "JUnit", "Pytest",
  "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "LLMs", "RAG",
  "Agile", "Scrum", "Jira", "Figma", "Microservices", "System Design", "Data Structures", "Algorithms", "TDD",
  "React Native", "Flutter", "Android", "iOS", "Tableau", "Power BI", "Excel", "Spark", "Kafka", "Airflow",
];

const ALIASES = {
  "HTML": ["HTML5"],
  "CSS": ["CSS3"],
  "REST APIs": ["REST", "RESTful"],
  "Node.js": ["NodeJS", "Node"],
  "Next.js": ["NextJS"],
  "PostgreSQL": ["Postgres"],
  "MongoDB": ["Mongo"],
  "Kubernetes": ["K8s"],
  "GCP": ["Google Cloud"],
  "JavaScript": ["JS", "ES6"],
  "TypeScript": ["TS"],
  "Machine Learning": ["ML"],
  "Vue": ["Vue.js", "VueJS"],
  "Go": ["Golang"],
  "LLMs": ["LLM"],
  "Tailwind CSS": ["Tailwind"],
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const SKILL_PATTERNS = SKILLS.map((name) => {
  const alts = [name, ...(ALIASES[name] || [])].map(esc).join("|");
  return [name, new RegExp(`(?<![A-Za-z0-9.])(?:${alts})(?![A-Za-z0-9])`, name === "R" || name === "Go" ? "" : "i")];
});

export function extractSkills(text) {
  return SKILL_PATTERNS.filter(([, re]) => re.test(text)).map(([name]) => name);
}

// ------------------------------------------------------------------ sections
const HEADINGS = {
  summary: /^(professional\s+)?(summary|profile|objective|about( me)?)$/i,
  experience: /^(work\s+|professional\s+)?(experience|employment( history)?)$/i,
  education: /^education( and training)?$/i,
  other: /^(skills|technical skills|projects|certifications?|achievements|awards|languages|interests|publications)$/i,
};

export function parseSections(text) {
  const buckets = { summary: [], experience: [], education: [] };
  let current = null;
  for (const line of text.split("\n")) {
    const t = line.trim().replace(/[:\s]+$/, "");
    if (t.length > 0 && t.length < 40) {
      if (HEADINGS.summary.test(t)) { current = "summary"; continue; }
      if (HEADINGS.experience.test(t)) { current = "experience"; continue; }
      if (HEADINGS.education.test(t)) { current = "education"; continue; }
      if (HEADINGS.other.test(t)) { current = null; continue; }
    }
    if (current) buckets[current].push(line);
  }

  const blocks = (lines) =>
    lines.join("\n").split(/\n\s*\n/).map((b) => b.split("\n").map((l) => l.trim()).filter(Boolean)).filter((b) => b.length);

  const experience = blocks(buckets.experience)
    .filter((b) => /[—–-]/.test(b[0]))
    .map((b) => {
      const [title, ...companyParts] = b[0].split(/\s+[—–-]\s+/);
      const [period = "", location = ""] = (b[1] || "").split("|").map((s) => s.trim());
      return { title, company: companyParts.join(" — "), period, location };
    })
    .slice(0, 10);

  const education = blocks(buckets.education)
    .map((b) => {
      const [degree, ...schoolParts] = b[0].split(/\s+[—–-]\s+/);
      const year = (b.join(" ").match(/\b(19|20)\d{2}\b/g) || []).pop() || "";
      return { degree, school: schoolParts.join(" — "), year };
    })
    .slice(0, 5);

  return {
    summary: buckets.summary.join(" ").replace(/\s+/g, " ").trim().slice(0, 1200),
    experience,
    education,
  };
}

// ------------------------------------------------------------------ chunking
// Returns [{ index, start, end }] offsets into `text` (no text duplication in the DB).
export function chunkOffsets(text, size = LIMITS.chunkChars) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + size, text.length);
    if (end < text.length) {
      const window = text.slice(start, end);
      const nl = window.lastIndexOf("\n");
      const sp = window.lastIndexOf(" ");
      const cut = nl > size * 0.5 ? nl : sp > size * 0.5 ? sp : -1;
      if (cut > 0) end = start + cut;
    }
    if (text.slice(start, end).trim()) chunks.push({ index: chunks.length, start, end });
    start = end;
  }
  return chunks;
}

// ---------------------------------------------------------------- embeddings
async function getExtractor() {
  if (!globalThis.__cpExtractor) {
    globalThis.__cpExtractor = import("@huggingface/transformers").then(({ pipeline }) =>
      pipeline("feature-extraction", EMBEDDING_MODEL, { dtype: "q8" })
    );
  }
  return globalThis.__cpExtractor;
}

// Returns pgvector-literal strings ("[0.1234,...]"), 4-decimals to keep payloads small.
export async function embedTexts(texts) {
  const extractor = await getExtractor();
  const out = [];
  for (let i = 0; i < texts.length; i += 8) {
    const batch = texts.slice(i, i + 8);
    const tensor = await extractor(batch, { pooling: "mean", normalize: true });
    for (const row of tensor.tolist()) {
      out.push(`[${row.map((v) => v.toFixed(4)).join(",")}]`);
    }
  }
  return out;
}
