import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://biarritz.blog";

// Pages to audit
const PAGES_TO_TEST = [
  { path: "/", name: "Accueil" },
  { path: "/product", name: "Produit" },
  { path: "/blog", name: "Blog" },
  { path: "/contact", name: "Contact" },
];

// Required security / perf headers
const EXPECTED_HEADERS = [
  { key: "cache-control", label: "Cache-Control", critical: true },
  { key: "content-encoding", label: "Compression (gzip/br)", critical: true },
  { key: "x-content-type-options", label: "X-Content-Type-Options", critical: false },
  { key: "x-frame-options", label: "X-Frame-Options", critical: false },
  { key: "strict-transport-security", label: "HSTS", critical: false },
  { key: "content-security-policy", label: "CSP", critical: false },
];

interface PageResult {
  path: string;
  name: string;
  statusCode: number;
  ttfb: number;
  totalTime: number;
  pageSize: number;
  headers: Record<string, string>;
  headerAudit: { key: string; label: string; present: boolean; value: string | null; critical: boolean }[];
  assets: {
    scripts: { src: string; size: number | null }[];
    stylesheets: { href: string; size: number | null }[];
    images: { src: string; size: number | null; usesNextImage: boolean; format: string }[];
    fonts: { href: string; size: number | null }[];
  };
  bundleSizeJS: number;
  bundleSizeCSS: number;
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

// ─── Helper: Fetch a page and measure timing ───
async function fetchPage(url: string): Promise<{ html: string; statusCode: number; ttfb: number; totalTime: number; pageSize: number; headers: Record<string, string> }> {
  const start = performance.now();
  let ttfbEnd = 0;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "BiarritzSpeedTest/1.0", Accept: "text/html" },
      cache: "no-store",
    });
    ttfbEnd = performance.now();

    const html = await res.text();
    const totalEnd = performance.now();

    const hdrs: Record<string, string> = {};
    res.headers.forEach((v, k) => { hdrs[k] = v; });

    return {
      html,
      statusCode: res.status,
      ttfb: Math.round(ttfbEnd - start),
      totalTime: Math.round(totalEnd - start),
      pageSize: new TextEncoder().encode(html).length,
      headers: hdrs,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Helper: Get file size via HEAD ───
async function getRemoteSize(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
    const cl = res.headers.get("content-length");
    return cl ? parseInt(cl, 10) : null;
  } catch {
    return null;
  }
}

// ─── Helper: Extract assets from HTML ───
function extractAssets(html: string, baseUrl: string) {
  const scripts: { src: string; size: number | null }[] = [];
  const stylesheets: { href: string; size: number | null }[] = [];
  const images: { src: string; size: number | null; usesNextImage: boolean; format: string }[] = [];
  const fonts: { href: string; size: number | null }[] = [];

  // Scripts
  const scriptRegex = /<script[^>]+src="([^"]+)"/g;
  let m;
  while ((m = scriptRegex.exec(html)) !== null) {
    const src = m[1].startsWith("http") ? m[1] : `${baseUrl}${m[1]}`;
    scripts.push({ src, size: null });
  }

  // Stylesheets
  const cssRegex = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g;
  while ((m = cssRegex.exec(html)) !== null) {
    const href = m[1].startsWith("http") ? m[1] : `${baseUrl}${m[1]}`;
    stylesheets.push({ href, size: null });
  }
  // Also match href before rel
  const cssRegex2 = /<link[^>]+href="([^"]+)"[^>]+rel="stylesheet"/g;
  while ((m = cssRegex2.exec(html)) !== null) {
    const href = m[1].startsWith("http") ? m[1] : `${baseUrl}${m[1]}`;
    if (!stylesheets.some(s => s.href === href)) {
      stylesheets.push({ href, size: null });
    }
  }

  // Images — detect next/image usage (srcset with /_next/image)
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  while ((m = imgRegex.exec(html)) !== null) {
    const src = m[1];
    const fullTag = m[0];
    const usesNextImage = src.includes("/_next/image") || fullTag.includes("srcset");
    const ext = src.split("?")[0].split(".").pop()?.toLowerCase() || "unknown";
    const resolvedSrc = src.startsWith("http") ? src : `${baseUrl}${src}`;
    images.push({ src: resolvedSrc, size: null, usesNextImage, format: ext });
  }

  // Fonts
  const fontRegex = /<link[^>]+href="([^"]+\.(woff2?|ttf|otf|eot)[^"]*)"/g;
  while ((m = fontRegex.exec(html)) !== null) {
    const href = m[1].startsWith("http") ? m[1] : `${baseUrl}${m[1]}`;
    fonts.push({ href, size: null });
  }

  return { scripts, stylesheets, images, fonts };
}

// ─── Helper: Audit headers ───
function auditHeaders(headers: Record<string, string>) {
  return EXPECTED_HEADERS.map(({ key, label, critical }) => ({
    key,
    label,
    present: !!headers[key],
    value: headers[key] || null,
    critical,
  }));
}

// ─── Helper: Database audit ───
async function auditDatabase(): Promise<DbResult[]> {
  const tables: { table: string; query: () => Promise<number> }[] = [
    { table: "Product", query: () => prisma.product.count() },
    { table: "Order", query: () => prisma.order.count() },
    { table: "Post", query: () => prisma.post.count() },
    { table: "Review", query: () => prisma.review.count() },
    { table: "User", query: () => prisma.user.count() },
    { table: "SiteConfig", query: () => prisma.siteConfig.count() },
  ];

  const results: DbResult[] = [];
  for (const t of tables) {
    const start = performance.now();
    try {
      const count = await t.query();
      const latencyMs = Math.round(performance.now() - start);
      results.push({ table: t.table, count, latencyMs });
    } catch {
      results.push({ table: t.table, count: -1, latencyMs: -1 });
    }
  }
  return results;
}

// ─── Helper: Calculate score ───
function calculateScore(pages: PageResult[], db: DbResult[], recommendations: Recommendation[]): number {
  let score = 100;

  // Page load penalties
  for (const p of pages) {
    if (p.ttfb > 2000) score -= 15;
    else if (p.ttfb > 1000) score -= 8;
    else if (p.ttfb > 500) score -= 3;

    if (p.totalTime > 5000) score -= 10;
    else if (p.totalTime > 3000) score -= 5;

    if (p.pageSize > 500000) score -= 5;

    if (p.bundleSizeJS > 500000) score -= 10;
    else if (p.bundleSizeJS > 300000) score -= 5;
  }

  // DB penalties
  for (const d of db) {
    if (d.latencyMs > 1000) score -= 10;
    else if (d.latencyMs > 500) score -= 5;
    else if (d.latencyMs > 200) score -= 2;
  }

  // Recommendation penalties
  for (const r of recommendations) {
    if (r.severity === "critical") score -= 5;
    else if (r.severity === "warning") score -= 2;
  }

  return Math.max(0, Math.min(100, score));
}

// ─── Helper: Generate recommendations ───
function generateRecommendations(pages: PageResult[], db: DbResult[], imageAudit: ImageAuditItem[]): Recommendation[] {
  const recs: Recommendation[] = [];

  // Page-level recommendations
  for (const p of pages) {
    if (p.ttfb > 2000) {
      recs.push({
        severity: "critical",
        category: "Performance",
        message: `La page "${p.name}" (${p.path}) a un TTFB de ${p.ttfb}ms (> 2s). Le serveur répond trop lentement.`,
        fix: "Vérifiez les requêtes DB, activez le caching, et optimisez les Server Components.",
        autoFixable: false,
      });
    } else if (p.ttfb > 1000) {
      recs.push({
        severity: "warning",
        category: "Performance",
        message: `La page "${p.name}" a un TTFB de ${p.ttfb}ms. Cible : < 800ms.`,
        fix: "Utilisez unstable_cache ou ISR pour réduire le temps de réponse serveur.",
        autoFixable: false,
      });
    }

    if (p.pageSize > 500000) {
      recs.push({
        severity: "warning",
        category: "Taille de page",
        message: `"${p.name}" fait ${(p.pageSize / 1024).toFixed(0)} KB — c'est lourd pour le HTML seul.`,
        fix: "Réduisez le HTML inline, utilisez le lazy loading pour les composants non-critiques.",
        autoFixable: false,
      });
    }

    // Header issues
    for (const h of p.headerAudit) {
      if (!h.present && h.critical) {
        recs.push({
          severity: "warning",
          category: "Headers",
          message: `Header "${h.label}" manquant sur ${p.name}.`,
          fix: h.key === "cache-control"
            ? "Ajoutez des headers Cache-Control dans next.config.ts"
            : "Configurez le reverse proxy ou les headers Next.js.",
          autoFixable: h.key === "cache-control",
        });
      }
    }

    // Big bundles
    if (p.bundleSizeJS > 500000) {
      recs.push({
        severity: "critical",
        category: "Bundle JS",
        message: `Le bundle JS sur "${p.name}" fait ${(p.bundleSizeJS / 1024).toFixed(0)} KB. Cible : < 300 KB.`,
        fix: "Utilisez le code splitting, dynamic imports, et supprimez les dépendances inutilisées.",
        autoFixable: false,
      });
    }
  }

  // Image recommendations
  const unoptimizedImages = imageAudit.filter(i => !i.isOptimized);
  if (unoptimizedImages.length > 0) {
    recs.push({
      severity: "warning",
      category: "Images",
      message: `${unoptimizedImages.length} image(s) non optimisée(s) détectée(s) (PNG/JPG non-compressés ou trop lourds).`,
      fix: "Convertissez en WebP/AVIF et utilisez le composant next/image pour l'optimisation automatique.",
      autoFixable: false,
    });
  }

  const noNextImages = imageAudit.filter(i => !i.usesNextImage);
  if (noNextImages.length > 0) {
    recs.push({
      severity: "info",
      category: "Images",
      message: `${noNextImages.length} image(s) utilisent <img> au lieu de next/image. L'optimisation automatique est désactivée.`,
      fix: "Remplacez les balises <img> par le composant Image de Next.js.",
      autoFixable: false,
    });
  }

  // DB recommendations
  for (const d of db) {
    if (d.latencyMs > 500) {
      recs.push({
        severity: d.latencyMs > 1000 ? "critical" : "warning",
        category: "Base de données",
        message: `La requête "${d.table}" prend ${d.latencyMs}ms.`,
        fix: "Ajoutez des index, utilisez le caching, ou optimisez la requête Prisma.",
        autoFixable: false,
      });
    }
  }

  return recs;
}

// ─── Main GET handler ───
export async function GET() {
  const startTime = performance.now();

  try {
    // 1. Audit pages in parallel
    const pagePromises = PAGES_TO_TEST.map(async (page) => {
      const url = `${SITE_URL}${page.path}`;
      try {
        const { html, statusCode, ttfb, totalTime, pageSize, headers } = await fetchPage(url);
        const assets = extractAssets(html, SITE_URL);
        const headerAudit = auditHeaders(headers);

        // Measure asset sizes (batch, first 20 per type max)
        const assetSizePromises: Promise<void>[] = [];
        for (const s of assets.scripts.slice(0, 20)) {
          assetSizePromises.push(getRemoteSize(s.src).then(sz => { s.size = sz; }));
        }
        for (const s of assets.stylesheets.slice(0, 10)) {
          assetSizePromises.push(getRemoteSize(s.href).then(sz => { s.size = sz; }));
        }
        for (const img of assets.images.slice(0, 20)) {
          assetSizePromises.push(getRemoteSize(img.src).then(sz => { img.size = sz; }));
        }
        await Promise.allSettled(assetSizePromises);

        const bundleSizeJS = assets.scripts.reduce((sum, s) => sum + (s.size || 0), 0);
        const bundleSizeCSS = assets.stylesheets.reduce((sum, s) => sum + (s.size || 0), 0);

        return {
          path: page.path,
          name: page.name,
          statusCode,
          ttfb,
          totalTime,
          pageSize,
          headers,
          headerAudit,
          assets,
          bundleSizeJS,
          bundleSizeCSS,
        } as PageResult;
      } catch (err: any) {
        return {
          path: page.path,
          name: page.name,
          statusCode: 0,
          ttfb: -1,
          totalTime: -1,
          pageSize: 0,
          headers: {},
          headerAudit: [],
          assets: { scripts: [], stylesheets: [], images: [], fonts: [] },
          bundleSizeJS: 0,
          bundleSizeCSS: 0,
        } as PageResult;
      }
    });

    const pages = await Promise.all(pagePromises);

    // 2. Database audit
    const database = await auditDatabase();

    // 3. Image audit (aggregate from all pages)
    const allImages: ImageAuditItem[] = [];
    const seenSrcs = new Set<string>();
    for (const p of pages) {
      for (const img of p.assets.images) {
        if (seenSrcs.has(img.src)) continue;
        seenSrcs.add(img.src);
        const isOptimized =
          img.usesNextImage ||
          ["webp", "avif", "svg"].includes(img.format) ||
          (img.size !== null && img.size < 100000);
        allImages.push({
          src: img.src,
          sizeBytes: img.size,
          format: img.format,
          isOptimized,
          usesNextImage: img.usesNextImage,
          recommendation: !isOptimized
            ? `Convertir en WebP/AVIF (actuellement ${img.format}, ${img.size ? (img.size / 1024).toFixed(0) + " KB" : "taille inconnue"})`
            : null,
        });
      }
    }

    // 4. Recommendations
    const recommendations = generateRecommendations(pages, database, allImages);

    // 5. Score
    const score = calculateScore(pages, database, recommendations);

    const totalAuditTime = Math.round(performance.now() - startTime);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      auditDurationMs: totalAuditTime,
      score,
      pages: pages.map(p => ({
        path: p.path,
        name: p.name,
        statusCode: p.statusCode,
        ttfb: p.ttfb,
        totalTime: p.totalTime,
        pageSizeKB: Math.round(p.pageSize / 1024),
        bundleSizeJS_KB: Math.round(p.bundleSizeJS / 1024),
        bundleSizeCSS_KB: Math.round(p.bundleSizeCSS / 1024),
        headerAudit: p.headerAudit,
        assetsCount: {
          scripts: p.assets.scripts.length,
          stylesheets: p.assets.stylesheets.length,
          images: p.assets.images.length,
          fonts: p.assets.fonts.length,
        },
      })),
      images: allImages,
      database,
      recommendations,
      summary: {
        totalPages: pages.length,
        avgTTFB: Math.round(pages.reduce((s, p) => s + (p.ttfb > 0 ? p.ttfb : 0), 0) / pages.filter(p => p.ttfb > 0).length || 0),
        avgTotalTime: Math.round(pages.reduce((s, p) => s + (p.totalTime > 0 ? p.totalTime : 0), 0) / pages.filter(p => p.totalTime > 0).length || 0),
        totalBundleJS_KB: Math.round(Math.max(...pages.map(p => p.bundleSizeJS)) / 1024),
        totalBundleCSS_KB: Math.round(Math.max(...pages.map(p => p.bundleSizeCSS)) / 1024),
        totalImages: allImages.length,
        unoptimizedImages: allImages.filter(i => !i.isOptimized).length,
        criticalIssues: recommendations.filter(r => r.severity === "critical").length,
        warnings: recommendations.filter(r => r.severity === "warning").length,
        infos: recommendations.filter(r => r.severity === "info").length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Speed test failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
