import Script from "next/script";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./mobile-fixes.css";

export const metadata: Metadata = {
  title: "Artículos | Administración",
  description: "Gestión privada de artículos.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminArticlesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Script src="/admin-articles-layout.js?v=20260913-layout-2" strategy="afterInteractive" />
      <Script src="/articles-ux-guards.js?v=20260915-1" strategy="afterInteractive" />
      <Script src="/article-versioning.js?v=20261006-1" strategy="afterInteractive" />
    </>
  );
}
