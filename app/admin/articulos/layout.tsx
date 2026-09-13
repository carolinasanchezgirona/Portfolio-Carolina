import Script from "next/script";
import type { ReactNode } from "react";

export default function AdminArticlesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Script src="/admin-articles-layout.js?v=20260913-layout-1" strategy="afterInteractive" />
    </>
  );
}
