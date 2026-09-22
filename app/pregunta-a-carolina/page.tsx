import type { Metadata } from "next";
import QuestionsExperience from "./questions-experience";
import { getPublishedExpertQuestions } from "./questions-data";
import "./questions.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "Preguntas de psicología y neuropsicología | Carolina Sánchez" },
  description: "Envía tu pregunta a Carolina Sánchez, psicóloga y neuropsicóloga, y consulta respuestas divulgativas sobre ansiedad, duelo, relaciones, memoria y deterioro cognitivo.",
  alternates: { canonical: "/pregunta-a-carolina/" },
  openGraph: {
    title: "Pregunta a Carolina | Psicología y neuropsicología",
    description: "Un buzón de preguntas y respuestas profesionales sobre psicología, memoria y neuropsicología.",
    url: "https://carolinasanchezgirona.com/pregunta-a-carolina/",
    type: "website",
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
