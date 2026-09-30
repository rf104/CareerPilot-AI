// Free, offline fallback for the match analysis (no LLM). Used when the AI service is
// unavailable, rate-limited or unconfigured. Produces the same result shape as the LLM path.
import { extractSkills } from "./resumeProcessing";

const STOPWORDS = new Set(
  ("with that this from have will your their about into over such more than also been were they them must should " +
    "able work working team teams role roles join looking experience years year strong good great including " +
    "across within using used use build building help ability skills skill knowledge required preferred plus " +
    "company position candidate candidates responsibilities requirements qualifications opportunity benefits " +
    "e.g. etc and the for are you our who what when where which while these those other").split(/\s+/)
);

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

function topKeywords(jd, n = 30) {
  const counts = new Map();
  for (const w of jd.toLowerCase().match(/[a-z][a-z+#.\-]{3,}/g) || []) {
    const word = w.replace(/[.\-]+$/, "");
    if (word.length < 4 || STOPWORDS.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([w]) => w);
}

function requiredYears(jd) {
  const m = [...jd.matchAll(/(\d{1,2})\s*\+?\s*(?:-\s*\d{1,2}\s*)?years?/gi)].map((x) => Number(x[1]));
  return m.length ? Math.max(...m) : null;
}

function resumeYears(text) {
  const explicit = [...text.matchAll(/(\d{1,2})\s*\+?\s*years?/gi)].map((x) => Number(x[1])).filter((n) => n < 40);
  const years = [...text.matchAll(/\b(19[89]\d|20[0-4]\d)\b/g)].map((x) => Number(x[1]));
  const span = years.length ? new Date().getFullYear() - Math.min(...years) : 0;
  return Math.max(explicit.length ? Math.max(...explicit) : 0, Math.min(span, 30)) || null;
}

const DEGREE_RANK = [
  [3, /\b(ph\.?d|doctorate)\b/i],
  [2, /\b(master'?s?|m\.?s\.?c?|mba|m\.?tech)\b/i],
  [1, /\b(bachelor'?s?|b\.?s\.?c?|b\.?e\.?|b\.?tech|undergraduate)\b/i],
];
const degreeLevel = (t) => (DEGREE_RANK.find(([, re]) => re.test(t)) || [0])[0];

/**
 * @param {{ resumeText: string, resumeSkills: string[], jd: string, similarities?: number[] }} input
 */
export function ruleBasedMatch({ resumeText, resumeSkills, jd, similarities = [] }) {
  const have = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const jdSkills = extractSkills(jd);
  const matched = jdSkills.filter((s) => have.has(s.toLowerCase()));
  const missing = jdSkills.filter((s) => !have.has(s.toLowerCase()));

  // Semantic similarity from the vector search (0..1), if available.
  const sim = similarities.length ? similarities.reduce((a, b) => a + b, 0) / similarities.length : null;
  const simScore = sim === null ? null : clamp(((sim - 0.35) / 0.4) * 100);

  const skills = jdSkills.length ? clamp((matched.length / jdSkills.length) * 100) : simScore ?? 50;

  const lowerResume = resumeText.toLowerCase();
  const kws = topKeywords(jd);
  const keywords = kws.length ? clamp((kws.filter((k) => lowerResume.includes(k)).length / kws.length) * 100) : 50;

  const needYears = requiredYears(jd);
  const haveYears = resumeYears(resumeText);
  let experience;
  if (needYears && haveYears) experience = clamp((haveYears / needYears) * 100);
  else experience = simScore ?? 60;

  const needDegree = degreeLevel(jd);
  const haveDegree = degreeLevel(resumeText);
  const education = needDegree ? (haveDegree >= needDegree ? 100 : haveDegree ? 70 : 40) : haveDegree ? 85 : 65;

  const overall = clamp(skills * 0.4 + experience * 0.25 + keywords * 0.25 + education * 0.1);

  const recommendations = missing.slice(0, 5).map((skill, i) => ({
    title: `Build evidence of ${skill}`,
    description: `The job asks for ${skill}, which isn't visible in your resume. Learn it through a small project or course, then add it with a concrete result to your skills and experience sections.`,
    priority: i < 2 ? "High" : i < 4 ? "Medium" : "Low",
    timeEstimate: i < 2 ? "2-4 weeks" : "1-2 weeks",
  }));
  const absentKeywords = kws.filter((k) => !lowerResume.includes(k)).slice(0, 6);
  if (absentKeywords.length) {
    recommendations.push({
      title: "Mirror the job's wording",
      description: `Where it's truthful, use terms from the posting that your resume lacks: ${absentKeywords.join(", ")}. This helps applicant tracking systems match you.`,
      priority: "Medium",
      timeEstimate: "1 hour",
    });
  }
  if (!recommendations.length) {
    recommendations.push({
      title: "Tailor your summary",
      description: "Your resume already covers the detected requirements. Tighten the summary so it echoes this role's top priorities.",
      priority: "Low",
      timeEstimate: "1 hour",
    });
  }

  return {
    overallScore: overall,
    breakdown: { skills, experience, education, keywords },
    matchedSkills: matched.slice(0, 12),
    missingSkills: missing.slice(0, 12),
    recommendations: recommendations.slice(0, 6),
    summary: `Basic analysis: ${matched.length} of ${jdSkills.length || "the"} detected required skills match${
      needYears ? `, and the role asks for about ${needYears} years of experience` : ""
    }.`,
  };
}
