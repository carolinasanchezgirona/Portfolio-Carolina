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
      <script src="/admin-articles-layout.js?v=20260913-layout-2" defer />
    </>
  );
}
