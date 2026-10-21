import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi agenda | Carolina Sánchez",
  description: "Agenda profesional privada de Carolina Sánchez.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AgendaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <Script src="/admin-series-edit.js?v=20260915-1" strategy="afterInteractive" />
      <Script src="/admin-rebook-receiver.js?v=20260915-1" strategy="afterInteractive" />
      <Script src="/admin-ux-guards.js?v=20260915-1" strategy="afterInteractive" />
      <Script src="/admin-month-view.js?v=20260920-holidays-1" strategy="afterInteractive" />
      <Script src="/admin-quick-reschedule.js?v=20260915-2" strategy="afterInteractive" />
      <Script src="/admin-waitlist.js?v=20260915-2" strategy="afterInteractive" />
      <Script src="/admin-recurrence-v2.js?v=20261006-1" strategy="afterInteractive" />
      <Script src="/admin-communications.js?v=20261006-1" strategy="afterInteractive" />
      <Script src="/admin-agenda-view-switcher.js?v=20261009-1" strategy="afterInteractive" />
    </>
  );
}
