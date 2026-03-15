import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// ─── POST /api/speedtest/optimize ───
// Applies safe, automated performance optimizations
export async function POST() {
  const results: { action: string; status: "applied" | "skipped" | "error"; detail: string }[] = [];

  // 1. Add optimized cache headers for static assets in next.config.ts
  try {
    const configPath = path.join(process.cwd(), "next.config.ts");
    const configContent = await fs.readFile(configPath, "utf-8");

    if (!configContent.includes("headers()")) {
      // Add headers function to next.config.ts
      const headersBlock = `
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|otf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache Next.js static chunks for 1 year
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Short cache for HTML pages (ISR-like behavior)
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },`;

      const updatedConfig = configContent.replace(
        /async rewrites\(\)/,
        `${headersBlock}\n  async rewrites()`
      );

      await fs.writeFile(configPath, updatedConfig, "utf-8");
      results.push({
        action: "Cache-Control & Security Headers",
        status: "applied",
        detail: "Ajout de Cache-Control (1 an) pour les assets statiques + headers de sécurité dans next.config.ts",
      });
    } else {
      results.push({
        action: "Cache-Control & Security Headers",
        status: "skipped",
        detail: "Les headers personnalisés sont déjà configurés dans next.config.ts",
      });
    }
  } catch (err: any) {
    results.push({
      action: "Cache-Control & Security Headers",
      status: "error",
      detail: `Erreur: ${err.message}`,
    });
  }

  // 2. Check if images config is optimized in next.config
  try {
    const configPath = path.join(process.cwd(), "next.config.ts");
    const configContent = await fs.readFile(configPath, "utf-8");

    if (!configContent.includes("images")) {
      const imageConfig = `
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },`;

      const updatedConfig = configContent.replace(
        /const nextConfig: NextConfig = \{/,
        `const nextConfig: NextConfig = {${imageConfig}`
      );

      await fs.writeFile(configPath, updatedConfig, "utf-8");
      results.push({
        action: "Next.js Image Optimization",
        status: "applied",
        detail: "Configuration d'optimisation des images ajoutée (AVIF/WebP, cache 1 an, tailles adaptatives)",
      });
    } else {
      results.push({
        action: "Next.js Image Optimization",
        status: "skipped",
        detail: "La configuration images est déjà présente dans next.config.ts",
      });
    }
  } catch (err: any) {
    results.push({
      action: "Next.js Image Optimization",
      status: "error",
      detail: `Erreur: ${err.message}`,
    });
  }

  // 3. Check for compression config
  try {
    const configPath = path.join(process.cwd(), "next.config.ts");
    const configContent = await fs.readFile(configPath, "utf-8");

    if (!configContent.includes("compress")) {
      const updatedConfig = configContent.replace(
        /const nextConfig: NextConfig = \{/,
        `const nextConfig: NextConfig = {\n  compress: true,`
      );

      await fs.writeFile(configPath, updatedConfig, "utf-8");
      results.push({
        action: "Compression gzip",
        status: "applied",
        detail: "Compression gzip activée dans Next.js",
      });
    } else {
      results.push({
        action: "Compression gzip",
        status: "skipped",
        detail: "La compression est déjà configurée",
      });
    }
  } catch (err: any) {
    results.push({
      action: "Compression gzip",
      status: "error",
      detail: `Erreur: ${err.message}`,
    });
  }

  // 4. Check for poweredByHeader config
  try {
    const configPath = path.join(process.cwd(), "next.config.ts");
    const configContent = await fs.readFile(configPath, "utf-8");

    if (!configContent.includes("poweredByHeader")) {
      const updatedConfig = configContent.replace(
        /const nextConfig: NextConfig = \{/,
        `const nextConfig: NextConfig = {\n  poweredByHeader: false,`
      );

      await fs.writeFile(configPath, updatedConfig, "utf-8");
      results.push({
        action: "Masquer X-Powered-By",
        status: "applied",
        detail: "Header X-Powered-By supprimé (sécurité + taille réduite)",
      });
    } else {
      results.push({
        action: "Masquer X-Powered-By",
        status: "skipped",
        detail: "Déjà configuré",
      });
    }
  } catch (err: any) {
    results.push({
      action: "Masquer X-Powered-By",
      status: "error",
      detail: `Erreur: ${err.message}`,
    });
  }

  // 5. Manual recommendations (not auto-fixable)
  const manualRecommendations = [
    {
      action: "Remplacer <img> par next/image",
      detail: "Parcourez vos composants et remplacez les balises <img> par le composant Image de Next.js pour bénéficier du lazy loading, du redimensionnement automatique et des formats modernes.",
    },
    {
      action: "Ajouter des index DB",
      detail: "Vérifiez les requêtes Prisma fréquentes et ajoutez des @@index dans schema.prisma pour les colonnes utilisées dans les filtres et tris.",
    },
    {
      action: "Code splitting & Dynamic imports",
      detail: "Utilisez next/dynamic pour charger les composants lourds (éditeurs, graphiques) uniquement quand nécessaire.",
    },
    {
      action: "Préchargement des fontes",
      detail: "Ajoutez rel='preload' pour les polices critiques et utilisez font-display: swap.",
    },
  ];

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    applied: results,
    manualRecommendations,
    message:
      results.filter(r => r.status === "applied").length > 0
        ? `✅ ${results.filter(r => r.status === "applied").length} optimisation(s) appliquée(s). Relancez le test pour voir l'impact.`
        : "Toutes les optimisations automatiques sont déjà en place. Consultez les recommandations manuelles.",
  });
}
