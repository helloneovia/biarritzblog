"use client";

import dynamic from "next/dynamic";

const SupportWidget = dynamic(
  () => import("@/components/layout/SupportWidget").then(m => m.SupportWidget),
  { ssr: false }
);

export function LazySupportWidget({ t }: { t: Record<string, string> }) {
  return <SupportWidget t={t} />;
}
