import type { Metadata } from "next";
import ClinicalConsentTemplate from "../components/clinical-consent-template";

export const metadata: Metadata = {
  title: "Consentimiento informado neuropsicológico | Carolina Sánchez Girona",
  description: "Consentimiento informado para intervención neuropsicológica en la consulta de Carolina Sánchez Girona.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ConsentPage() {
  return <ClinicalConsentTemplate kind="neuropsychological" />;
}
