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
      <script src="/admin-series-edit.js?v=20260915-1" defer />
      <script src="/admin-rebook-receiver.js?v=20260915-1" defer />
      <script src="/admin-ux-guards.js?v=20260915-1" defer />
      <script src="/admin-month-view.js?v=20260915-2" defer />
      <script src="/admin-quick-reschedule.js?v=20260915-2" defer />
      <script src="/admin-waitlist.js?v=20260915-2" defer />
    </>
  );
}
