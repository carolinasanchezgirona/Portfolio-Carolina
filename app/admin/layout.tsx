import type { Metadata } from "next";
import Script from "next/script";
import "./admin-unified.css";
import "./workspace-navigation.css";
import "./admin-palette.css";

export const metadata: Metadata = {
  title: "Administración | Carolina Sánchez",
  manifest: "/clinic-manifest.webmanifest",
  icons: { icon: { url: "/clinic-pwa-icon-192.png", type: "image/png", sizes: "192x192" }, apple: { url: "/clinic-pwa-icon-180.png", type: "image/png", sizes: "180x180" } },
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
      <Script src="/admin-shell.js?v=20261009-nav-2" strategy="afterInteractive" />
      <Script src="/admin-articles-media.js?v=20260914-media-1" strategy="afterInteractive" />
    </>
  );
}
