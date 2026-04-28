"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";

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

function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const icons: Record<string, React.ReactNode> = {
    target: <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>,
    sparkles: <svg {...common}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></svg>,
    upload: <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" /></svg>,
    file: <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>,
    check: <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M8 12l2.5 2.5L16 9" /></svg>,
    x: <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6" /><path d="M9 9l6 6" /></svg>,
    arrow: <svg {...common}><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>,
  };
  return icons[name] || icons.sparkles;
}

function ScoreRing({ score }: { score: number }) {
  const safeScore = Math.min(100, Math.max(0, score));
  const degrees = Math.round((safeScore / 100) * 360);
  return (
    <div
      className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(#4f46e5 0deg ${degrees}deg, #e2e8f0 ${degrees}deg 360deg)` }}
    >
      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
        <div className="text-4xl font-extrabold tracking-tight text-slate-950">{safeScore}%</div>
        <div className="mt-1 text-sm font-semibold text-slate-500">Job match</div>
      </div>
    </div>
  );
}

function ResultDashboard({ result }: { result: AnalyzeResponse }) {
  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <ScoreRing score={result.match_score} />
          <div>
            <Badge tone="purple">AI analysis result</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">{result.summary}</h2>
            <p className="mt-3 text-slate-600">Dựa trên CV và JD bạn nhập, hệ thống đã xác định skill match, skill gap và roadmap cải thiện.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-emerald-100 bg-emerald-50/70 p-6">
          <div className="mb-3 flex items-center gap-2 font-bold text-emerald-800"><Icon name="check" /> Matching skills</div>
          <div className="flex flex-wrap gap-2">
            {result.matching_skills.map((skill) => <Badge key={skill} tone="green">{skill}</Badge>)}
          </div>
        </Card>
        <Card className="border-rose-100 bg-rose-50/70 p-6">
          <div className="mb-3 flex items-center gap-2 font-bold text-rose-800"><Icon name="x" /> Missing skills</div>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.map((skill) => <Badge key={skill} tone="red">{skill}</Badge>)}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-3 font-bold text-slate-950">Strengths</h3>
          <ul className="space-y-2 text-slate-600">
            {result.strengths.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="mb-3 font-bold text-slate-950">Weaknesses</h3>
          <ul className="space-y-2 text-slate-600">
            {result.weaknesses.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-xl font-extrabold text-slate-950">Skill roadmap</h3>
        <div className="space-y-3">
          {result.recommendations.map((item) => (
            <div key={item.skill} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-bold text-slate-950">{item.skill}</div>
                <Badge tone={item.priority === "High" ? "purple" : "neutral"}>{item.priority} - {item.time}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function Home() {
  const [cvText, setCvText] = useState(sampleCv);
  const [jdText, setJdText] = useState(sampleJd);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_text: cvText, jd_text: jdText }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = (await response.json()) as AnalyzeResponse;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute right-[-10%] top-[25%] h-[380px] w-[380px] rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-300"><Icon name="target" /></div>
          <div className="text-lg font-extrabold tracking-tight">FitCV AI</div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a href="#analyze">Analyze</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Badge tone="purple"><Icon name="sparkles" className="mr-2 h-4 w-4" /> AI CV matching for students & freshers</Badge>
          <h1 className="mt-6 text-5xl font-extrabold tracking-[-0.05em] text-slate-950 md:text-7xl">Biết CV của bạn match JD bao nhiêu % trong 10 giây.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Upload hoặc paste CV, dán JD, rồi nhận match score, skill gap và roadmap cải thiện trước khi apply.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" })} className="text-base">Analyze my CV <Icon name="arrow" className="ml-2 h-5 w-5" /></Button>
            <Button variant="secondary" className="text-base">Watch demo</Button>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-4">
            <div><div className="text-2xl font-extrabold">10s</div><div className="text-sm text-slate-500">analysis</div></div>
            <div><div className="text-2xl font-extrabold">AI</div><div className="text-sm text-slate-500">feedback</div></div>
            <div><div className="text-2xl font-extrabold">3 steps</div><div className="text-sm text-slate-500">to improve</div></div>
          </div>
        </div>

        <Card id="analyze" className="p-5 shadow-2xl shadow-indigo-100/70">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-extrabold">Analyze your fit</h2>
            <Badge tone="purple">Connected to FastAPI</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">CV text</label>
              <textarea value={cvText} onChange={(e) => setCvText(e.target.value)} className="h-56 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Job description</label>
              <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} className="h-56 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={analyze} disabled={loading} className="w-full sm:w-auto">
              {loading ? "Analyzing..." : "Analyze now"} <Icon name="sparkles" className="ml-2 h-4 w-4" />
            </Button>
            {error && <div className="text-sm font-semibold text-rose-600">{error}</div>}
          </div>
        </Card>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        {result ? <ResultDashboard result={result} /> : (
          <Card className="p-8 text-center">
            <Icon name="file" className="mx-auto mb-3 h-8 w-8 text-indigo-600" />
            <h2 className="text-2xl font-extrabold">Paste CV and JD, then click Analyze.</h2>
            <p className="mt-2 text-slate-600">Backend will return mock data without OpenAI key, or real AI analysis when configured.</p>
          </Card>
        )}
      </section>

      <section id="features" className="relative z-10 mx-auto grid max-w-7xl gap-5 px-6 pb-20 md:grid-cols-3">
        {[
          ["Match score", "Chấm độ phù hợp CV với từng JD theo kỹ năng, kinh nghiệm và keyword."],
          ["Skill roadmap", "Đề xuất học gì trước, học trong bao lâu và vì sao nên học."],
          ["CV improvement", "Gợi ý viết lại bullet points để CV rõ impact và hợp JD hơn."],
        ].map(([title, desc]) => (
          <Card key={title} className="p-7">
            <h3 className="text-xl font-extrabold">{title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{desc}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
