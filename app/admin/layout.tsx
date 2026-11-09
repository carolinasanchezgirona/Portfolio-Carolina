import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../../public/admin-theme.css";
import "./admin-unified.css";
import "./workspace-navigation.css";
import "./admin-palette.css";
import "./admin-experience.css";

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

export const viewport: Viewport = { themeColor: "#708793" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#admin-main-content" className="admin-skip-link">Ir al contenido</a>
      {children}
      <Script src="/admin-experience.js?v=20261021-ux-1" strategy="afterInteractive" />
      <Script src="/admin-shell.js?v=20261009-nav-2" strategy="afterInteractive" />
      <Script src="/admin-articles-media.js?v=20260914-media-1" strategy="afterInteractive" />
    </>
  );
}
