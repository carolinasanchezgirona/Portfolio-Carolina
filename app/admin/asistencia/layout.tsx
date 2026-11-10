import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control de asistencia | Carolina Sánchez Girona",
  description: "Área profesional privada de control de asistencia.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AttendanceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
