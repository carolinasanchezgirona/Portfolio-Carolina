import type { Metadata } from "next";
import GoogleAnalyticsConsent from "./components/google-analytics-consent";
import SiteShell from "./components/site-shell";
import "./globals.css";
import "./mineuri-theme.css";
import "./type-scale.css";
import "./coherence.css";
import "./hero-soft.css";
import "./editorial.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://carolinasanchezgirona.com"),
  applicationName: "Carolina Sánchez | Psicóloga",
  creator: "Carolina Sánchez Girona",
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
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://carolinasanchezgirona.com",
    siteName: "Carolina Sánchez | Psicóloga",
    title: "Carolina Sánchez | Psicóloga y Neuropsicóloga",
    description:
      "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online.",
    images: [
      {
        url: "/carolina-sanchez-retrato.jpg",
        width: 480,
        height: 618,
        alt: "Carolina Sánchez, psicóloga y neuropsicóloga",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Carolina Sánchez | Psicóloga y Neuropsicóloga",
    description: "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online.",
    images: ["/carolina-sanchez-retrato.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona",
      name: "Carolina Sánchez Girona",
      jobTitle: "Psicóloga General Sanitaria y Neuropsicóloga",
      url: "https://carolinasanchezgirona.com/sobre-mi/",
      image: "https://carolinasanchezgirona.com/carolina-sanchez-retrato.jpg",
      identifier: {
        "@type": "PropertyValue",
        propertyID: "COPC",
        value: "24892",
      },
      sameAs: [
        "https://www.linkedin.com/in/carolina-s%C3%A1nchez-girona-43b3b94a/",
      ],
      memberOf: {
        "@type": "Organization",
        name: "Grup de Treball Neuropsicologia i salut mental del Col·legi Oficial de Psicologia de Catalunya",
      },
      knowsAbout: [
        "Psicología General Sanitaria",
        "Neuropsicología",
        "Evaluación neuropsicológica",
        "Deterioro cognitivo",
        "Demencias",
        "Ansiedad",
        "Duelo",
        "Estimulación cognitiva",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://carolinasanchezgirona.com/#dememoria",
      name: "Carolina Sánchez | Psicóloga y Neuropsicóloga",
      alternateName: "Dememoria",
      url: "https://carolinasanchezgirona.com",
      image: "https://carolinasanchezgirona.com/carolina-sanchez-retrato.jpg",
      email: "contact@carolinasanchezgirona.com",
      telephone: "+34604974857",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Carrer Barcelona 8, Local",
        postalCode: "08350",
        addressLocality: "Arenys de Mar",
        addressRegion: "Cataluña",
        addressCountry: "ES",
      },
      areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
      description:
        "Consulta de Psicología General Sanitaria y Neuropsicología en Arenys de Mar y online.",
      sameAs: [
        "https://www.linkedin.com/in/carolina-s%C3%A1nchez-girona-43b3b94a/",
      ],
      founder: {
        "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios clínicos",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Psicología General Sanitaria",
              url: "https://carolinasanchezgirona.com/psicologia/",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Neuropsicología",
              url: "https://carolinasanchezgirona.com/neuropsicologia/",
            },
          },
        ],
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#FBF9F5" />
        <meta property="og:image" content="https://carolinasanchezgirona.com/carolina-sanchez-retrato.jpg" />
        <meta property="og:image:width" content="480" />
        <meta property="og:image:height" content="618" />
        <meta property="og:image:alt" content="Carolina Sánchez, psicóloga y neuropsicóloga" />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
        <GoogleAnalyticsConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
