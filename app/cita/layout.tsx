import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Pedir cita | Carolina Sánchez Girona",
  },
  description: "Reserva una sesión de Psicología General Sanitaria o Neuropsicología con Carolina Sánchez Girona en Arenys de Mar.",
  alternates: {
    canonical: "https://carolinasanchezgirona.com/cita/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://carolinasanchezgirona.com/cita/",
    siteName: "Carolina Sánchez | Psicóloga",
    title: "Pedir cita | Carolina Sánchez Girona",
    description: "Consulta la disponibilidad y reserva una sesión de psicología o neuropsicología.",
    images: ["/carolina-sanchez-retrato.jpg"],
  },
  twitter: {
    card: "summary",
    title: "Pedir cita | Carolina Sánchez Girona",
    description: "Reserva una sesión de psicología o neuropsicología en Arenys de Mar.",
    images: ["/carolina-sanchez-retrato.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
