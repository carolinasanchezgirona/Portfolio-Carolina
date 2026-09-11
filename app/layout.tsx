import type { Metadata } from "next";
import "./globals.css";
import "./mineuri-theme.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://carolinasanchezgirona.com"),
  title: {
    default: "Carolina Sánchez | Psicóloga y Neuropsicóloga en Arenys de Mar",
    template: "%s | Carolina Sánchez",
  },
  description:
    "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online. Evaluación, intervención y acompañamiento psicológico con una mirada rigurosa, cercana y centrada en la persona.",
  keywords: [
    "psicóloga Arenys de Mar",
    "neuropsicóloga Arenys de Mar",
    "psicología Maresme",
    "neuropsicología Maresme",
    "psicología online",
    "evaluación neuropsicológica",
    "deterioro cognitivo",
    "demencias",
    "ansiedad",
    "duelo",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://carolinasanchezgirona.com",
    siteName: "Carolina Sánchez | Psicóloga",
    title: "Carolina Sánchez | Psicóloga y Neuropsicóloga",
    description:
      "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Carolina Sánchez | Psicóloga y Neuropsicóloga",
  alternateName: "Dememoria",
  url: "https://carolinasanchezgirona.com",
  email: "contact@carolinasanchezgirona.com",
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  description:
    "Consulta de psicología sanitaria y neuropsicología clínica en Arenys de Mar y online.",
  founder: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Psicóloga General Sanitaria y Neuropsicóloga",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
