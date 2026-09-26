import type { Metadata } from "next";
import QuestionsExperience from "./questions-experience";
import { getPublishedExpertQuestions } from "./questions-data";
import "./questions.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "Tu Consulta: preguntas de psicología | Carolina Sánchez" },
  description: "Envía tu pregunta a Carolina Sánchez, psicóloga y neuropsicóloga, y consulta respuestas divulgativas sobre ansiedad, duelo, relaciones, memoria y deterioro cognitivo.",
  alternates: { canonical: "/pregunta-a-carolina/" },
  openGraph: {
    title: "Tu Consulta | Carolina Sánchez, psicóloga y neuropsicóloga",
    description: "Un buzón de preguntas y respuestas profesionales sobre psicología, memoria y neuropsicología.",
    url: "https://carolinasanchezgirona.com/pregunta-a-carolina/",
    type: "website",
    images: [{ url: "/carolina-sanchez-tu-consulta.webp", width: 640, height: 640, alt: "Carolina Sánchez en Tu Consulta, espacio de preguntas de psicología y neuropsicología" }],
  },
  twitter: {
    card: "summary",
    images: ["/carolina-sanchez-tu-consulta.webp"],
  },
};

export default async function QuestionPage() {
  const questions = await getPublishedExpertQuestions();
  return (
    <main className="editorial-site question-page">
      <QuestionsExperience initialQuestions={questions} />
    </main>
  );
}
