"use client";

import { useState, useEffect, type ReactElement } from "react";
import { Badge, Button, Card } from "@/components/ui";

type IconName =
  | "target" | "sparkles" | "upload" | "file" | "check"
  | "x" | "arrow" | "zap" | "trending" | "users" | "star" | "loader";

type Recommendation = {
  skill: string;
  priority: string;
  reason: string;
  time: string;
};

type AnalyzeResponse = {
  match_score: number;
  summary: string;
  matching_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
};

const sampleCv = `Frontend Fresher with experience building React apps. Skilled in JavaScript, HTML, CSS, Git, REST API. Built student project: job board app with authentication and responsive UI.`;
const sampleJd = `We are hiring Frontend Fresher. Requirements: React, JavaScript, TypeScript, Git, REST API, Docker basic, testing basic. Nice to have AWS and CI/CD.`;

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }): ReactElement {
  const base = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  if (name === "loader") {
    return (
      <svg {...base} className={`${className} animate-spin`}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    );
  }
  const icons: Record<Exclude<IconName, "loader">, ReactElement> = {
    target:    <svg {...base}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>,
    sparkles:  <svg {...base}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></svg>,
    upload:    <svg {...base}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" /></svg>,
    file:      <svg {...base}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>,
    check:     <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M8 12l2.5 2.5L16 9" /></svg>,
    x:         <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6" /><path d="M9 9l6 6" /></svg>,
    arrow:     <svg {...base}><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>,
    zap:       <svg {...base}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    trending:  <svg {...base}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
    users:     <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    star:      <svg {...base}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  };
  return icons[name as Exclude<IconName, "loader">];
}

/* ── Animated SVG circular score ring ── */
function ScoreRing({ score }: { score: number }): ReactElement {
  const [animated, setAnimated] = useState(0);
  const safeScore = Math.min(100, Math.max(0, score));
  const r = 52;
  const circ = 2 * Math.PI * r; // ≈ 326.73

  useEffect(() => {
    const t = setTimeout(() => setAnimated(safeScore), 120);
    return () => clearTimeout(t);
  }, [safeScore]);

  const offset = circ * (1 - animated / 100);
  const ringColor = safeScore >= 70 ? "#10b981" : safeScore >= 45 ? "#f59e0b" : "#f43f5e";
  const textColor = safeScore >= 70 ? "text-emerald-400" : safeScore >= 45 ? "text-amber-400" : "text-rose-400";
  const label     = safeScore >= 70 ? "Strong Match"  : safeScore >= 45 ? "Partial Match" : "Weak Match";

  return (
    <div className="relative shrink-0" style={{ width: 168, height: 168 }}>
      <svg width="168" height="168" viewBox="0 0 168 168" aria-hidden="true">
        {/* track */}
        <circle cx="84" cy="84" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
        {/* progress */}
        <circle
          cx="84" cy="84" r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: "rotate(-90deg)",
            transformOrigin: "84px 84px",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black tabular-nums leading-none ${textColor}`}>{safeScore}%</span>
        <span className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
      </div>
    </div>
  );
}

/* ── Result dashboard ── */
function ResultDashboard({ result }: { result: AnalyzeResponse }): ReactElement {
  return (
    <div className="animate-fade-up space-y-5">

      {/* Hero summary card — dark gradient */}
      <Card className="overflow-hidden border-0">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-7 md:p-10">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <ScoreRing score={result.match_score} />
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <Icon name="sparkles" className="h-3.5 w-3.5" /> AI Analysis
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-snug text-white md:text-3xl">
                {result.summary}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
                Phân tích dựa trên skill match, kinh nghiệm và keyword alignment giữa CV và JD của bạn.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                {[
                  { value: result.matching_skills.length, label: "Matched",     color: "text-emerald-400" },
                  { value: result.missing_skills.length,  label: "Skill gaps",  color: "text-rose-400"    },
                  { value: result.recommendations.length, label: "Action items",color: "text-amber-400"   },
                ].map(({ value, label, color }) => (
                  <div key={label} className="rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
                    <div className={`text-2xl font-black ${color}`}>{value}</div>
                    <div className="mt-0.5 text-xs font-semibold text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills grid */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <Icon name="check" className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="font-extrabold text-slate-950">Matching Skills</h3>
            <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {result.matching_skills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matching_skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 5l2.5 2.5L8.5 2" /></svg>
                {skill}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
              <Icon name="x" className="h-4 w-4 text-rose-600" />
            </div>
            <h3 className="font-extrabold text-slate-950">Skill Gaps</h3>
            <span className="ml-auto rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
              {result.missing_skills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l6 6M8 2l-6 6" /></svg>
                {skill}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-extrabold text-slate-950">
            <Icon name="trending" className="h-4 w-4 text-emerald-500" /> Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((item, i) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">{i + 1}</span>
                <span className="text-sm leading-6 text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-extrabold text-slate-950">
            <Icon name="zap" className="h-4 w-4 text-amber-500" /> Areas to Improve
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.map((item, i) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-700">{i + 1}</span>
                <span className="text-sm leading-6 text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Learning roadmap */}
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100">
            <Icon name="trending" className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-950">Learning Roadmap</h3>
            <p className="text-sm text-slate-500">Các bước cải thiện CV theo thứ tự ưu tiên</p>
          </div>
        </div>
        <div className="space-y-3">
          {result.recommendations.map((item, i) => {
            const isHigh = item.priority === "High";
            return (
              <div
                key={item.skill}
                className={`flex gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm ${
                  isHigh ? "border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50" : "border-slate-100 bg-slate-50"
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  isHigh ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-200 text-slate-600"
                }`}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-950">{item.skill}</span>
                    <div className="flex items-center gap-2">
                      {isHigh && (
                        <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">High Priority</span>
                      )}
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-500">{item.time}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ── Main page ── */
export default function Home(): ReactElement {
  const [cvText, setCvText] = useState(sampleCv);
  const [jdText, setJdText] = useState(sampleJd);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sampleResult: AnalyzeResponse = {
    match_score: 78,
    summary: "Demo result",
    matching_skills: ["React", "JS", "Git", "REST API"],
    missing_skills: ["Docker", "TypeScript"],
    strengths: ["Good frontend base"],
    weaknesses: ["Missing backend"],
    recommendations: [
      {
        skill: "Docker",
        priority: "High",
        reason: "Needed for deployment",
        time: "5 days"
      }
    ]
  };

  async function analyze() {
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      // const response = await fetch(`${apiUrl}/api/analyze`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ cv_text: cvText, jd_text: jdText }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 900)); // sample result
      setResult(sampleResult); // sample result
      // if (!response.ok) throw new Error(`API error: ${response.status}`);
      // const data = (await response.json()) as AnalyzeResponse;
      // setResult(data);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-violet-200/20 blur-3xl" />
      </div>

      {/* Sticky glassmorphism header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <Icon name="target" className="h-4 w-4" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-950">
              FitCV <span className="text-indigo-600">AI</span>
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a href="#analyze" className="transition-colors hover:text-slate-950">Analyze</a>
            <a href="#features" className="transition-colors hover:text-slate-950">Features</a>
          </nav>
          <Button
            onClick={() => document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" })}
            className="hidden text-sm shadow-sm md:inline-flex"
          >
            Try free <Icon name="arrow" className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
          <Icon name="sparkles" className="h-4 w-4" />
          AI-powered CV matching for Vietnam freshers
        </div>
        <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
          Biết CV của bạn<br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            match JD bao nhiêu&nbsp;%
          </span>
          <br />trong 10 giây.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
          Paste CV, dán JD và nhận ngay match score chi tiết, skill gap analysis và learning roadmap cá nhân hóa.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={() => document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3.5 text-base shadow-lg shadow-indigo-200/60"
          >
            Analyze my CV <Icon name="arrow" className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="mx-auto mt-10 flex max-w-sm flex-wrap items-center justify-center gap-6 border-t border-slate-200 pt-8 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Icon name="zap"   className="h-4 w-4 text-indigo-500" /> Under 10 seconds</span>
          <span className="flex items-center gap-1.5"><Icon name="star"  className="h-4 w-4 text-amber-500"  /> AI-powered</span>
          <span className="flex items-center gap-1.5"><Icon name="users" className="h-4 w-4 text-emerald-500"/> Free to use</span>
        </div>
      </section>

      {/* Analyze form */}
      <section id="analyze" className="relative z-10 mx-auto max-w-5xl px-6 pb-12">
        <Card className="shadow-2xl shadow-slate-200/80">
          <div className="border-b border-slate-100 px-7 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">Analyze your CV fit</h2>
                <p className="mt-0.5 text-sm text-slate-500">Paste your CV and job description below</p>
              </div>
              <Badge tone="purple">
                <Icon name="sparkles" className="mr-1.5 h-3.5 w-3.5" /> AI Ready
              </Badge>
            </div>
          </div>
          <div className="p-7">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Icon name="file" className="h-4 w-4 text-slate-400" /> Your CV
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your CV content here..."
                  className="h-64 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Icon name="target" className="h-4 w-4 text-slate-400" /> Job Description
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="h-64 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={analyze} disabled={loading} className="w-full shadow-lg shadow-indigo-200/50 sm:w-auto">
                {loading
                  ? <><Icon name="loader" className="mr-2 h-4 w-4" /> Analyzing...</>
                  : <><Icon name="sparkles" className="mr-2 h-4 w-4" /> Analyze now</>
                }
              </Button>
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600">
                  <Icon name="x" className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* Results */}
      <section id="results" className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        {result ? (
          <ResultDashboard result={result} />
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
              <Icon name="file" className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950">Ready to analyze</h3>
            <p className="mt-2 text-slate-500">
              Paste your CV and job description above, then click Analyze.
            </p>
          </Card>
        )}
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-slate-950">Tại sao chọn FitCV AI?</h2>
          <p className="mt-3 text-slate-500">Công cụ phân tích CV thông minh dành riêng cho sinh viên & fresher Việt Nam</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: "target"   as IconName, color: "bg-indigo-100 text-indigo-600",  title: "Match Score",   desc: "Chấm điểm độ phù hợp CV với JD theo kỹ năng, kinh nghiệm và keyword." },
            { icon: "trending" as IconName, color: "bg-emerald-100 text-emerald-600",title: "Skill Roadmap", desc: "Đề xuất học gì trước, học trong bao lâu và lý do vì sao nên học." },
            { icon: "sparkles" as IconName, color: "bg-violet-100 text-violet-600",  title: "CV Tips",       desc: "Gợi ý viết lại bullet points để CV rõ impact và phù hợp JD hơn." },
          ].map(({ icon, color, title, desc }) => (
            <Card key={title} className="p-7 transition-shadow hover:shadow-md">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
                <Icon name={icon} className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
              <p className="mt-2 leading-7 text-slate-500">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-400 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Icon name="target" className="h-3.5 w-3.5" />
            </div>
            <span className="font-extrabold text-slate-950">FitCV AI</span>
          </div>
          <span>© 2026 FitCV AI · Built for Vietnam freshers</span>
        </div>
      </footer>
    </div>
  );
}
