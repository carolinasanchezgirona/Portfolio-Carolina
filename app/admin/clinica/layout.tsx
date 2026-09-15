import type { Metadata } from "next";
import "./mobile-fixes.css";
import "./brand-fixes.css";

export const metadata: Metadata = {
  title: "Gestión clínica | Carolina Sánchez",
  description: "Aplicación privada para la gestión clínica de Dememoria.",
  robots: { index: false, follow: false, nocache: true },
};

export default function ClinicaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <script src="/admin-clinica-print-fixes.js?v=20260915-1" defer />
      <script src="/clinic-rebook.js?v=20260915-1" defer />
      <script src="/clinic-report-options.js?v=20260915-2" defer />
      <script src="/clinic-ux-guards.js?v=20260915-1" defer />
      <script src="/clinic-patient-dashboard.js?v=20260915-2" defer />
      <script src="/clinic-goals-manager.js?v=20260915-2" defer />
      <script src="/clinic-scale-trends.js?v=20260915-2" defer />
      <script src="/clinic-template-library.js?v=20260915-3" defer />
    </>
  );
}
