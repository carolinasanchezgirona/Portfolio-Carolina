import type { ReactNode } from "react";
import "./mobile-fixes.css";

export default function AdminArticlesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <script src="/admin-articles-layout.js?v=20260913-layout-2" defer />
    </>
  );
}
