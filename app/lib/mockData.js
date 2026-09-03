// ============================================================
// CareerPilot AI — Mock Data & localStorage Helpers
// Replace these with real API calls when backend is ready.
// ============================================================

// ---- Keys ----
const STORAGE_KEYS = {
  USER: "cp_user",
  APPLICATIONS: "cp_applications",
  RESUMES: "cp_resumes",
  AI_RESULTS: "cp_ai_results",
};

// ---- Default User ----
export const DEFAULT_USER = {
  id: "usr_001",
  name: "Alex Johnson",
  email: "alex@careerpilot.ai",
  avatar: null,
  joinedAt: "2026-08-15T10:00:00Z",
};

// ---- Seed Applications ----
export const SEED_APPLICATIONS = [
  {
    id: "app_001",
    company: "Google",
    position: "Senior Frontend Engineer",
    description: "Build and maintain large-scale web applications using React, TypeScript, and modern frontend tooling. Collaborate with UX designers and backend engineers.",
    location: "Mountain View, CA",
    url: "https://careers.google.com/jobs/123",
    dateApplied: "2026-08-20",
    status: "Interview",
  },
  {
    id: "app_002",
    company: "Stripe",
    position: "Full-Stack Developer",
    description: "Design and implement payment processing features. Work with React, Node.js, Ruby, PostgreSQL, and AWS. Strong focus on reliability and security.",
    location: "San Francisco, CA",
    url: "https://stripe.com/jobs/456",
    dateApplied: "2026-08-22",
    status: "Applied",
  },
  {
    id: "app_003",
    company: "Vercel",
    position: "Software Engineer — Next.js",
    description: "Contribute to the Next.js framework and Vercel platform. Deep knowledge of React, TypeScript, Node.js, and edge computing required.",
    location: "Remote",
    url: "https://vercel.com/careers/789",
    dateApplied: "2026-08-25",
    status: "Assessment",
  },
  {
    id: "app_004",
    company: "Notion",
    position: "Frontend Engineer",
    description: "Build collaborative productivity tools using React, TypeScript, and WebSocket real-time architecture. Experience with rich text editors is a plus.",
    location: "New York, NY",
    url: "https://notion.so/careers/101",
    dateApplied: "2026-08-18",
    status: "Offer",
  },
  {
    id: "app_005",
    company: "Shopify",
    position: "React Developer",
    description: "Develop merchant-facing dashboards and e-commerce tools. Work with React, GraphQL, Ruby on Rails, and Polaris design system.",
    location: "Toronto, Canada",
    url: "https://shopify.com/careers/202",
    dateApplied: "2026-08-15",
    status: "Rejected",
  },
  {
    id: "app_006",
    company: "Linear",
    position: "Product Engineer",
    description: "Build fast, delightful project management software. TypeScript, React, Node.js, PostgreSQL. Passion for developer tools and great UX.",
    location: "Remote",
    url: "https://linear.app/careers/303",
    dateApplied: "2026-08-28",
    status: "Wishlist",
  },
  {
    id: "app_007",
    company: "Figma",
    position: "Software Engineer — Web Platform",
    description: "Work on the Figma web application using TypeScript, C++/WebAssembly, and React. Performance optimization and canvas rendering experience valued.",
    location: "San Francisco, CA",
    url: "https://figma.com/careers/404",
    dateApplied: "2026-08-30",
    status: "Applied",
  },
  {
    id: "app_008",
    company: "Supabase",
    position: "Full-Stack Engineer",
    description: "Build open-source backend-as-a-service platform. Work with PostgreSQL, TypeScript, React, Deno, and Docker. Strong database skills needed.",
    location: "Remote",
    url: "https://supabase.com/careers/505",
    dateApplied: "2026-09-01",
    status: "Wishlist",
  },
];

// ---- Seed Resume ----
export const SEED_RESUME = {
  id: "res_001",
  filename: "Alex_Johnson_Resume_2026.pdf",
  uploadedAt: "2026-08-20T14:30:00Z",
  fileSize: "245 KB",
  skills: [
    "React", "TypeScript", "JavaScript", "Next.js", "Node.js",
    "PostgreSQL", "MongoDB", "GraphQL", "REST APIs", "Git",
    "HTML/CSS", "Tailwind CSS", "Python", "Redux", "Jest",
  ],
  extractedText: `ALEX JOHNSON
Senior Full-Stack Developer | San Francisco, CA
alex@careerpilot.ai | github.com/alexjohnson | linkedin.com/in/alexjohnson

SUMMARY
Passionate full-stack developer with 5+ years of experience building scalable web applications. Proficient in React, TypeScript, Node.js, and PostgreSQL. Strong advocate for clean code, testing, and user-centric design. Proven track record of delivering high-impact features in fast-paced startup environments.

EXPERIENCE

Senior Frontend Engineer — TechCorp Inc.
Jan 2024 – Present | San Francisco, CA
• Led the migration of a legacy jQuery application to React 18 + TypeScript, reducing load time by 40%
• Built a real-time collaboration feature using WebSockets serving 10K+ concurrent users
• Implemented comprehensive testing with Jest and Cypress, achieving 92% code coverage
• Mentored 3 junior developers through code reviews and pair programming sessions

Full-Stack Developer — StartupXYZ
Jun 2021 – Dec 2023 | Remote
• Designed and built a customer-facing dashboard using Next.js, reducing customer support tickets by 35%
• Created RESTful APIs with Node.js and Express, handling 50K+ daily requests
• Managed PostgreSQL database with complex queries and migrations using Prisma ORM
• Integrated Stripe payment processing, handling $2M+ in monthly transactions

EDUCATION

B.S. Computer Science — University of California, Berkeley
Graduated May 2021 | GPA: 3.7/4.0

PROJECTS

Open Source Contributor — React Query, Next.js
• Contributed 15+ PRs to React Query documentation and bug fixes
• Built Next.js starter template with 2K+ GitHub stars`,
  sections: {
    summary: "Passionate full-stack developer with 5+ years of experience building scalable web applications.",
    experience: [
      {
        title: "Senior Frontend Engineer",
        company: "TechCorp Inc.",
        period: "Jan 2024 – Present",
        location: "San Francisco, CA",
      },
      {
        title: "Full-Stack Developer",
        company: "StartupXYZ",
        period: "Jun 2021 – Dec 2023",
        location: "Remote",
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "University of California, Berkeley",
        year: "2021",
      },
    ],
  },
};

// ---- Mock AI Match Result ----
export const MOCK_AI_MATCH = {
  overallScore: 78,
  breakdown: {
    skills: 82,
    experience: 75,
    education: 80,
    keywords: 72,
  },
  matchedSkills: [
    "React", "TypeScript", "Node.js", "PostgreSQL", "Next.js",
    "REST APIs", "Git", "JavaScript", "GraphQL",
  ],
  missingSkills: [
    "Docker", "AWS", "Kubernetes", "CI/CD Pipelines", "Redis",
    "Terraform",
  ],
  recommendations: [
    {
      title: "Learn Docker & Containerization",
      description: "This role heavily emphasizes containerized deployments. Start with Docker basics, then learn Docker Compose for multi-service setups. Complete a hands-on project deploying a Node.js app.",
      priority: "High",
      timeEstimate: "2-3 weeks",
    },
    {
      title: "Get AWS Certified (Cloud Practitioner)",
      description: "The job requires AWS experience. Start with the Cloud Practitioner certification to build foundational knowledge, then explore EC2, S3, Lambda, and RDS services relevant to this role.",
      priority: "High",
      timeEstimate: "4-6 weeks",
    },
    {
      title: "Set Up CI/CD Pipelines",
      description: "Add GitHub Actions or GitLab CI to your existing projects. Automate testing, linting, and deployment. This is a quick win that demonstrates DevOps awareness.",
      priority: "Medium",
      timeEstimate: "1 week",
    },
    {
      title: "Explore Redis for Caching",
      description: "Implement Redis caching in a side project to demonstrate understanding of performance optimization and in-memory data stores.",
      priority: "Low",
      timeEstimate: "1 week",
    },
  ],
};

// ============================================================
// localStorage Helpers
// ============================================================

function safeGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — silently fail */
  }
}

// ---- User ----
export function getUser() {
  return safeGet(STORAGE_KEYS.USER, null);
}

export function setUser(user) {
  safeSet(STORAGE_KEYS.USER, user);
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ---- Applications ----
export function getApplications() {
  return safeGet(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
}

export function saveApplications(apps) {
  safeSet(STORAGE_KEYS.APPLICATIONS, apps);
}

export function addApplication(app) {
  const apps = getApplications();
  const newApp = {
    ...app,
    id: `app_${Date.now()}`,
  };
  const updated = [newApp, ...apps];
  saveApplications(updated);
  return updated;
}

export function updateApplication(id, updates) {
  const apps = getApplications();
  const updated = apps.map((a) => (a.id === id ? { ...a, ...updates } : a));
  saveApplications(updated);
  return updated;
}

export function deleteApplication(id) {
  const apps = getApplications();
  const updated = apps.filter((a) => a.id !== id);
  saveApplications(updated);
  return updated;
}

// ---- Resumes ----
export function getResumes() {
  return safeGet(STORAGE_KEYS.RESUMES, [SEED_RESUME]);
}

export function saveResumes(resumes) {
  safeSet(STORAGE_KEYS.RESUMES, resumes);
}

export function addResume(resume) {
  const resumes = getResumes();
  const newResume = {
    ...resume,
    id: `res_${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  };
  const updated = [newResume, ...resumes];
  saveResumes(updated);
  return { updated, newResume };
}

export function deleteResume(id) {
  const resumes = getResumes();
  const updated = resumes.filter((r) => r.id !== id);
  saveResumes(updated);
  return updated;
}

// ---- AI Match Results ----
export function getAIResults() {
  return safeGet(STORAGE_KEYS.AI_RESULTS, []);
}

export function saveAIResult(result) {
  const results = getAIResults();
  const newResult = {
    ...result,
    id: `ai_${Date.now()}`,
    analyzedAt: new Date().toISOString(),
  };
  const updated = [newResult, ...results];
  safeSet(STORAGE_KEYS.AI_RESULTS, updated);
  return newResult;
}

// ---- Status helpers ----
export const APPLICATION_STATUSES = [
  "Wishlist",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
];

export const STATUS_COLORS = {
  Wishlist: { bg: "rgba(100, 116, 139, 0.15)", text: "#94a3b8", border: "rgba(100, 116, 139, 0.3)" },
  Applied: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
  Assessment: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
  Interview: { bg: "rgba(139, 92, 246, 0.15)", text: "#a78bfa", border: "rgba(139, 92, 246, 0.3)" },
  Offer: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.3)" },
  Rejected: { bg: "rgba(239, 68, 68, 0.15)", text: "#f87171", border: "rgba(239, 68, 68, 0.3)" },
};

// ---- Generate ID ----
export function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
