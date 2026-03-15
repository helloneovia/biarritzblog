"use client";

import { useState, useCallback } from "react";

// ─── Types ───
interface HeaderAuditItem {
  key: string;
  label: string;
  present: boolean;
  value: string | null;
  critical: boolean;
}

interface PageResult {
  path: string;
  name: string;
  statusCode: number;
  ttfb: number;
  totalTime: number;
  pageSizeKB: number;
  bundleSizeJS_KB: number;
  bundleSizeCSS_KB: number;
  headerAudit: HeaderAuditItem[];
  assetsCount: { scripts: number; stylesheets: number; images: number; fonts: number };
}

interface DbResult {
  table: string;
  count: number;
  latencyMs: number;
}

interface ImageAuditItem {
  src: string;
  sizeBytes: number | null;
  format: string;
  isOptimized: boolean;
  usesNextImage: boolean;
  recommendation: string | null;
}

interface Recommendation {
  severity: "critical" | "warning" | "info";
  category: string;
  message: string;
  fix: string | null;
  autoFixable: boolean;
}

interface Summary {
  totalPages: number;
  avgTTFB: number;
  avgTotalTime: number;
  totalBundleJS_KB: number;
  totalBundleCSS_KB: number;
  totalImages: number;
  unoptimizedImages: number;
  criticalIssues: number;
  warnings: number;
  infos: number;
}

interface SpeedTestReport {
  timestamp: string;
  auditDurationMs: number;
  score: number;
  pages: PageResult[];
  images: ImageAuditItem[];
  database: DbResult[];
  recommendations: Recommendation[];
  summary: Summary;
}

interface OptimizeResult {
  timestamp: string;
  applied: { action: string; status: string; detail: string }[];
  manualRecommendations: { action: string; detail: string }[];
  message: string;
}

// ─── Score Gauge Component ───
function ScoreGauge({ score, size = 200 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 90 ? "#22c55e" : score >= 70 ? "#eab308" : score >= 50 ? "#f97316" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size / 1.4 }}>
      <svg width={size} height={size / 1.4} viewBox={`0 0 ${size} ${size / 1.3}`}>
        {/* Background arc */}
        <path
          d={`M ${size * 0.1} ${size / 1.5} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size / 1.5}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d={`M ${size * 0.1} ${size / 1.5} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size / 1.5}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${offset}`}
          style={{ transition: "stroke-dashoffset 1.5s ease-out, stroke 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className="text-5xl font-black tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">/ 100</span>
      </div>
    </div>
  );
}

// ─── Metric Card ───
function MetricCard({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 hover:bg-white/[0.07] transition-colors">
      <span className="text-xs font-bold text-white/40 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tabular-nums" style={{ color: color || "#fff" }}>
          {value}
        </span>
        {unit && <span className="text-sm font-bold text-white/50">{unit}</span>}
      </div>
    </div>
  );
}

// ─── Status Badge ───
function StatusBadge({ status }: { status: number }) {
  const color = status >= 200 && status < 300 ? "bg-green-500/20 text-green-400" : status >= 300 && status < 400 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>{status || "ERR"}</span>;
}

// ─── Severity Badge ───
function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[severity] || styles.info}`}>
      {severity === "critical" ? "🔴 Critique" : severity === "warning" ? "🟡 Attention" : "🔵 Info"}
    </span>
  );
}

// ─── Progress Bar ───
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// ─── DB Latency Color ───
function getLatencyColor(ms: number) {
  if (ms < 50) return "#22c55e";
  if (ms < 200) return "#eab308";
  if (ms < 500) return "#f97316";
  return "#ef4444";
}

// ─── TTFB Color ───
function getTTFBColor(ms: number) {
  if (ms < 500) return "#22c55e";
  if (ms < 1000) return "#eab308";
  if (ms < 2000) return "#f97316";
  return "#ef4444";
}

export default function SpeedTestPage() {
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [report, setReport] = useState<SpeedTestReport | null>(null);
  const [previousReport, setPreviousReport] = useState<SpeedTestReport | null>(null);
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "pages" | "images" | "database" | "headers" | "recommendations">("overview");

  const runTest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/speedtest");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SpeedTestReport = await res.json();
      if (report) setPreviousReport(report);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Test failed");
    } finally {
      setLoading(false);
    }
  }, [report]);

  const runOptimize = useCallback(async () => {
    setOptimizing(true);
    try {
      const res = await fetch("/api/speedtest/optimize", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: OptimizeResult = await res.json();
      setOptimizeResult(data);

      // Re-run test after optimization
      setPreviousReport(report);
      const res2 = await fetch("/api/speedtest");
      if (res2.ok) {
        const data2: SpeedTestReport = await res2.json();
        setReport(data2);
      }
    } catch (err: any) {
      setError(err.message || "Optimization failed");
    } finally {
      setOptimizing(false);
    }
  }, [report]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d1225]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-lg font-black shadow-lg shadow-orange-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Speed Test</h1>
              <p className="text-xs text-white/40 font-medium">biarritz.blog • Performance Auditor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runOptimize}
              disabled={optimizing || loading || !report}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {optimizing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Optimisation...
                </span>
              ) : "🔧 Optimiser"}
            </button>
            <button
              onClick={runTest}
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Analyse en cours...
                </span>
              ) : "🚀 Lancer le test"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
            ❌ {error}
          </div>
        )}

        {/* Empty state */}
        {!report && !loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 flex items-center justify-center text-5xl">
              ⚡
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2">Audit de Performance</h2>
              <p className="text-white/50 max-w-md">
                Analysez la vitesse de votre site, identifiez les bottlenecks, et appliquez des optimisations automatiques.
              </p>
            </div>
            <button
              onClick={runTest}
              className="px-8 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-xl shadow-orange-500/25 transition-all flex items-center gap-2"
            >
              🚀 Lancer l&apos;audit complet
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && !report && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">⚡</div>
            </div>
            <p className="text-white/60 font-bold animate-pulse">Analyse de biarritz.blog en cours...</p>
            <p className="text-xs text-white/30">Test des pages, assets, base de données, headers...</p>
          </div>
        )}

        {/* Report */}
        {report && (
          <>
            {/* Score + Summary Bar */}
            <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#111827] to-[#0d1225] border border-white/10 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <ScoreGauge score={report.score} size={200} />
                  <p className="text-center text-xs font-bold text-white/40 mt-2">SCORE GLOBAL</p>
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <MetricCard label="TTFB Moyen" value={report.summary.avgTTFB} unit="ms" color={getTTFBColor(report.summary.avgTTFB)} />
                  <MetricCard label="Temps de charge" value={report.summary.avgTotalTime} unit="ms" />
                  <MetricCard label="Bundle JS" value={report.summary.totalBundleJS_KB} unit="KB" color={report.summary.totalBundleJS_KB > 300 ? "#f97316" : "#22c55e"} />
                  <MetricCard label="Bundle CSS" value={report.summary.totalBundleCSS_KB} unit="KB" />
                </div>
              </div>
              {/* Quick stats */}
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-6 text-xs font-bold text-white/40">
                <span>🕐 Audit en {report.auditDurationMs}ms</span>
                <span>📄 {report.summary.totalPages} pages testées</span>
                <span>🖼️ {report.summary.totalImages} images ({report.summary.unoptimizedImages} non optimisées)</span>
                <span className={report.summary.criticalIssues > 0 ? "text-red-400" : "text-green-400"}>
                  {report.summary.criticalIssues > 0 ? `🔴 ${report.summary.criticalIssues} critique(s)` : "✅ 0 critique"}
                </span>
                <span>{report.summary.warnings > 0 ? `🟡 ${report.summary.warnings} attention` : ""}</span>
              </div>

              {/* Before/After comparison */}
              {previousReport && (
                <div className="mt-6 pt-4 border-t border-white/5">
                  <h3 className="text-sm font-black text-white/60 mb-3 flex items-center gap-2">📊 Comparaison Avant / Après</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ComparisonCard label="Score" before={previousReport.score} after={report.score} unit="" higherIsBetter />
                    <ComparisonCard label="TTFB Moyen" before={previousReport.summary.avgTTFB} after={report.summary.avgTTFB} unit="ms" higherIsBetter={false} />
                    <ComparisonCard label="Bundle JS" before={previousReport.summary.totalBundleJS_KB} after={report.summary.totalBundleJS_KB} unit="KB" higherIsBetter={false} />
                    <ComparisonCard label="Issues" before={previousReport.summary.criticalIssues + previousReport.summary.warnings} after={report.summary.criticalIssues + report.summary.warnings} unit="" higherIsBetter={false} />
                  </div>
                </div>
              )}
            </div>

            {/* Optimize result */}
            {optimizeResult && (
              <div className="mb-8 p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
                <h3 className="text-sm font-black text-green-400 mb-3">🔧 Résultat de l&apos;Optimisation</h3>
                <p className="text-sm text-green-300/80 mb-4">{optimizeResult.message}</p>
                <div className="space-y-2">
                  {optimizeResult.applied.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className={`w-2 h-2 rounded-full ${a.status === "applied" ? "bg-green-400" : a.status === "skipped" ? "bg-yellow-400" : "bg-red-400"}`} />
                      <span className="font-bold text-white/80">{a.action}</span>
                      <span className="text-white/40 text-xs">{a.detail}</span>
                    </div>
                  ))}
                </div>

                {optimizeResult.manualRecommendations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-green-500/10">
                    <p className="text-xs font-bold text-white/40 mb-2">📝 Actions manuelles recommandées :</p>
                    {optimizeResult.manualRecommendations.map((r, i) => (
                      <div key={i} className="text-xs text-white/60 mb-1">
                        <span className="font-bold text-white/80">• {r.action}:</span> {r.detail}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-2xl overflow-x-auto">
              {(["overview", "pages", "images", "database", "headers", "recommendations"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60"}`}
                >
                  {tab === "overview" && "📊 "}
                  {tab === "pages" && "📄 "}
                  {tab === "images" && "🖼️ "}
                  {tab === "database" && "🗄️ "}
                  {tab === "headers" && "🔒 "}
                  {tab === "recommendations" && "💡 "}
                  {tab === "overview" ? "Vue d'ensemble" :
                   tab === "pages" ? "Pages" :
                   tab === "images" ? "Images" :
                   tab === "database" ? "Base de données" :
                   tab === "headers" ? "Headers" :
                   "Recommandations"}
                  {tab === "recommendations" && report.recommendations.length > 0 && (
                    <span className="ml-1 bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full text-[10px]">{report.recommendations.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Overview */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pages overview */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <h3 className="text-sm font-black text-white/60 mb-4">📄 Performance des Pages</h3>
                    <div className="space-y-4">
                      {report.pages.map((p) => (
                        <div key={p.path} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={p.statusCode} />
                              <span className="text-sm font-bold">{p.name}</span>
                              <span className="text-xs text-white/30">{p.path}</span>
                            </div>
                            <span className="text-sm font-bold tabular-nums" style={{ color: getTTFBColor(p.ttfb) }}>
                              {p.ttfb}ms
                            </span>
                          </div>
                          <ProgressBar value={p.ttfb} max={5000} color={getTTFBColor(p.ttfb)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assets overview */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <h3 className="text-sm font-black text-white/60 mb-4">📦 Répartition des Assets</h3>
                    <div className="space-y-4">
                      {report.pages.map((p) => (
                        <div key={p.path}>
                          <p className="text-xs font-bold text-white/50 mb-2">{p.name}</p>
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-blue-500/10 rounded-lg p-2">
                              <p className="text-lg font-black text-blue-400">{p.assetsCount.scripts}</p>
                              <p className="text-[10px] text-white/40 font-bold">JS</p>
                            </div>
                            <div className="bg-purple-500/10 rounded-lg p-2">
                              <p className="text-lg font-black text-purple-400">{p.assetsCount.stylesheets}</p>
                              <p className="text-[10px] text-white/40 font-bold">CSS</p>
                            </div>
                            <div className="bg-orange-500/10 rounded-lg p-2">
                              <p className="text-lg font-black text-orange-400">{p.assetsCount.images}</p>
                              <p className="text-[10px] text-white/40 font-bold">IMG</p>
                            </div>
                            <div className="bg-green-500/10 rounded-lg p-2">
                              <p className="text-lg font-black text-green-400">{p.assetsCount.fonts}</p>
                              <p className="text-[10px] text-white/40 font-bold">FONT</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DB overview */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <h3 className="text-sm font-black text-white/60 mb-4">🗄️ Latence Base de Données</h3>
                    <div className="space-y-3">
                      {report.database.map((d) => (
                        <div key={d.table} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold">{d.table}</span>
                            <span className="text-xs text-white/30">{d.count >= 0 ? `${d.count} rows` : "erreur"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ProgressBar value={d.latencyMs} max={500} color={getLatencyColor(d.latencyMs)} />
                            <span className="text-sm font-bold tabular-nums min-w-[60px] text-right" style={{ color: getLatencyColor(d.latencyMs) }}>
                              {d.latencyMs >= 0 ? `${d.latencyMs}ms` : "ERR"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick recommendations */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <h3 className="text-sm font-black text-white/60 mb-4">💡 Top Recommandations</h3>
                    <div className="space-y-3">
                      {report.recommendations.slice(0, 5).map((r, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <SeverityBadge severity={r.severity} />
                          <div>
                            <p className="text-sm font-medium text-white/80">{r.message}</p>
                            {r.fix && <p className="text-xs text-white/40 mt-1">{r.fix}</p>}
                          </div>
                        </div>
                      ))}
                      {report.recommendations.length === 0 && (
                        <p className="text-sm text-green-400 font-bold">✅ Aucun problème détecté!</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pages Detail */}
              {activeTab === "pages" && (
                <div className="space-y-4">
                  {report.pages.map((p) => (
                    <div key={p.path} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <StatusBadge status={p.statusCode} />
                        <h3 className="text-base font-black">{p.name}</h3>
                        <span className="text-xs text-white/30 font-mono">{p.path}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <MetricCard label="TTFB" value={p.ttfb} unit="ms" color={getTTFBColor(p.ttfb)} />
                        <MetricCard label="Chargement total" value={p.totalTime} unit="ms" />
                        <MetricCard label="Taille page" value={p.pageSizeKB} unit="KB" />
                        <MetricCard label="Bundle JS" value={p.bundleSizeJS_KB} unit="KB" color={p.bundleSizeJS_KB > 300 ? "#f97316" : "#22c55e"} />
                        <MetricCard label="Bundle CSS" value={p.bundleSizeCSS_KB} unit="KB" />
                      </div>
                      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                        <div className="bg-blue-500/10 rounded-lg p-2">
                          <p className="text-xl font-black text-blue-400">{p.assetsCount.scripts}</p>
                          <p className="text-[10px] text-white/40 font-bold">Scripts</p>
                        </div>
                        <div className="bg-purple-500/10 rounded-lg p-2">
                          <p className="text-xl font-black text-purple-400">{p.assetsCount.stylesheets}</p>
                          <p className="text-[10px] text-white/40 font-bold">CSS</p>
                        </div>
                        <div className="bg-orange-500/10 rounded-lg p-2">
                          <p className="text-xl font-black text-orange-400">{p.assetsCount.images}</p>
                          <p className="text-[10px] text-white/40 font-bold">Images</p>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-2">
                          <p className="text-xl font-black text-green-400">{p.assetsCount.fonts}</p>
                          <p className="text-[10px] text-white/40 font-bold">Fonts</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Images */}
              {activeTab === "images" && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <h3 className="text-sm font-black text-white/60 mb-4">
                    🖼️ Audit Images ({report.images.length} images, {report.summary.unoptimizedImages} non optimisées)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-white/40 text-xs font-bold uppercase">
                          <th className="text-left py-2 pr-4">Source</th>
                          <th className="text-left py-2 pr-4">Format</th>
                          <th className="text-right py-2 pr-4">Taille</th>
                          <th className="text-center py-2 pr-4">next/image</th>
                          <th className="text-center py-2 pr-4">Optimisé</th>
                          <th className="text-left py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.images.map((img, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="py-2 pr-4">
                              <span className="text-xs font-mono text-white/60 truncate block max-w-[300px]" title={img.src}>
                                {img.src.split("/").pop()}
                              </span>
                            </td>
                            <td className="py-2 pr-4">
                              <span className="text-xs font-bold uppercase text-white/50">{img.format}</span>
                            </td>
                            <td className="py-2 pr-4 text-right tabular-nums">
                              {img.sizeBytes !== null ? (
                                <span className={`font-bold ${img.sizeBytes > 200000 ? "text-red-400" : img.sizeBytes > 100000 ? "text-yellow-400" : "text-green-400"}`}>
                                  {(img.sizeBytes / 1024).toFixed(0)} KB
                                </span>
                              ) : (
                                <span className="text-white/30">—</span>
                              )}
                            </td>
                            <td className="py-2 pr-4 text-center">
                              {img.usesNextImage ? <span className="text-green-400">✅</span> : <span className="text-red-400">❌</span>}
                            </td>
                            <td className="py-2 pr-4 text-center">
                              {img.isOptimized ? <span className="text-green-400">✅</span> : <span className="text-red-400">❌</span>}
                            </td>
                            <td className="py-2">
                              {img.recommendation && (
                                <span className="text-xs text-yellow-400/80">{img.recommendation}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Database */}
              {activeTab === "database" && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <h3 className="text-sm font-black text-white/60 mb-4">🗄️ Audit Base de Données</h3>
                  <div className="space-y-4">
                    {report.database.map((d) => (
                      <div key={d.table} className="bg-white/[0.03] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-base font-black">{d.table}</span>
                            <span className="text-xs text-white/30 ml-3">{d.count >= 0 ? `${d.count} enregistrements` : "Erreur"}</span>
                          </div>
                          <span className="text-2xl font-black tabular-nums" style={{ color: getLatencyColor(d.latencyMs) }}>
                            {d.latencyMs >= 0 ? `${d.latencyMs}ms` : "ERR"}
                          </span>
                        </div>
                        <ProgressBar value={d.latencyMs} max={500} color={getLatencyColor(d.latencyMs)} />
                        <div className="mt-2 text-xs text-white/30">
                          {d.latencyMs < 50 ? "🟢 Excellent" : d.latencyMs < 200 ? "🟡 Acceptable" : d.latencyMs < 500 ? "🟠 Lent" : "🔴 Critique"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Headers */}
              {activeTab === "headers" && (
                <div className="space-y-4">
                  {report.pages.map((p) => (
                    <div key={p.path} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <h3 className="text-sm font-black text-white/60 mb-4">{p.name} <span className="text-white/30 font-mono">{p.path}</span></h3>
                      <div className="space-y-2">
                        {p.headerAudit.map((h) => (
                          <div key={h.key} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${h.present ? "bg-green-400" : h.critical ? "bg-red-400" : "bg-yellow-400"}`} />
                              <span className="text-sm font-bold">{h.label}</span>
                              {h.critical && !h.present && <span className="text-[10px] text-red-400 font-bold">CRITIQUE</span>}
                            </div>
                            <span className="text-xs text-white/40 font-mono max-w-[300px] truncate">
                              {h.value || "Non défini"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {activeTab === "recommendations" && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <h3 className="text-sm font-black text-white/60 mb-4">
                    💡 Recommandations ({report.recommendations.length})
                  </h3>
                  <div className="space-y-4">
                    {report.recommendations.map((r, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${r.severity === "critical" ? "bg-red-500/5 border-red-500/20" : r.severity === "warning" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-blue-500/5 border-blue-500/20"}`}>
                        <div className="flex items-start gap-3">
                          <SeverityBadge severity={r.severity} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-white/40 uppercase">{r.category}</span>
                              {r.autoFixable && (
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">AUTO-FIXABLE</span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-white/80">{r.message}</p>
                            {r.fix && (
                              <p className="text-xs text-white/40 mt-2 bg-white/5 p-2 rounded-lg font-mono">{r.fix}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {report.recommendations.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-4xl mb-3">🎉</p>
                        <p className="text-lg font-black text-green-400">Parfait!</p>
                        <p className="text-sm text-white/40">Aucune recommandation. Votre site est bien optimisé.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer timestamp */}
            <div className="mt-8 text-center text-xs text-white/20">
              Dernier audit: {new Date(report.timestamp).toLocaleString("fr-FR")} • Durée: {report.auditDurationMs}ms
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ─── Comparison Card ───
function ComparisonCard({ label, before, after, unit, higherIsBetter }: {
  label: string; before: number; after: number; unit: string; higherIsBetter: boolean;
}) {
  const diff = after - before;
  const improved = higherIsBetter ? diff > 0 : diff < 0;
  const neutral = diff === 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-black tabular-nums">{after}{unit}</span>
        {!neutral && (
          <span className={`text-xs font-bold ${improved ? "text-green-400" : "text-red-400"}`}>
            {improved ? "▼" : "▲"} {Math.abs(diff)}{unit}
          </span>
        )}
      </div>
      <p className="text-[10px] text-white/30 mt-0.5">Avant: {before}{unit}</p>
    </div>
  );
}
