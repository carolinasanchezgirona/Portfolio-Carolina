import type { Metadata } from "next";
import "./mobile-fixes.css";

export const metadata: Metadata = {
  title: "Gestión clínica | Carolina Sánchez",
  description: "Aplicación privada para la gestión clínica de Dememoria.",
  robots: { index: false, follow: false, nocache: true },
};

export default function ClinicaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
