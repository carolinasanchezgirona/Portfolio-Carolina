import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi agenda | Carolina Sánchez",
  description: "Agenda profesional privada de Carolina Sánchez.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AgendaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
