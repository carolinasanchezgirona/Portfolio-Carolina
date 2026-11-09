import type { Metadata } from "next";
import ClinicalConsentTemplate from "../components/clinical-consent-template";

export const metadata: Metadata = {
  title: "Consentimiento informado psicológico | Carolina Sánchez Girona",
  description: "Consentimiento informado para intervención psicológica en la consulta de Carolina Sánchez Girona.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ConsentPage() {
  return <ClinicalConsentTemplate kind="psychological" />;
}
