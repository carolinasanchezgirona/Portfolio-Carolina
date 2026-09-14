import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Administración | Carolina Sánchez",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Script src="/admin-articles-media.js?v=20260914-media-1" strategy="afterInteractive" />
    </>
  );
}
