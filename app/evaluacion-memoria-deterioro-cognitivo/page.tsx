import type { Metadata } from "next";
import NeuroAssessmentService from "../components/neuro-assessment-service";
import "../seo-pages.css";
import "../evaluacion-tdah-adultos/tdah.css";

const canonical = "/evaluacion-memoria-deterioro-cognitivo/";
export const metadata: Metadata = {
  title: "Evaluación de memoria y deterioro cognitivo en adultos | Arenys de Mar",
  description: "Valoración de memoria y deterioro cognitivo en Arenys de Mar: evaluación focalizada 350 € y neuropsicológica ampliada 500 €, con informe y devolución.",
  alternates: { canonical },
  openGraph: {
    title: "Evaluación de memoria y deterioro cognitivo | Carolina Sánchez",
    description: "Valoración de memoria para adultos: modalidades de 350 € y 500 €, con pruebas individualizadas, informe y devolución.",
    url: "https://carolinasanchezgirona.com" + canonical,
    type: "website",
  },
};
export default function MemoryAssessmentPage() {
  return (
    <NeuroAssessmentService
      slug="evaluacion-memoria-deterioro-cognitivo"
      shortName="Evaluación de memoria"
      eyebrow="Neuropsicología clínica · Adultos y personas mayores"
      title="Evaluación de memoria y deterioro cognitivo"
      lead="¿Has notado olvidos más frecuentes, cambios en la atención o dificultades para realizar tareas cotidianas? Una valoración individualizada permite explorar el perfil cognitivo y orientar los siguientes pasos sin asumir de entrada que exista una demencia."
      imageUrl="https://images.pexels.com/photos/6818285/pexels-photo-6818285.jpeg?auto=compress&cs=tinysrgb&w=1200"
      imageAlt="Persona mayor escribiendo en su agenda durante una actividad cotidiana de atención y planificación"
      requestSubject="Solicitud de evaluación de memoria y deterioro cognitivo"
      introTitle="Comprender los cambios de memoria en su contexto"
      intro={[
        "La memoria se relaciona con la atención, el lenguaje, las funciones ejecutivas, el sueño, el estado emocional y el funcionamiento cotidiano. Un resultado aislado en una prueba de cribado no basta para establecer un diagnóstico.",
        "La evaluación integra el motivo de consulta, la evolución de los cambios, antecedentes médicos, nivel educativo, medicación, observación clínica, pruebas seleccionadas y, con consentimiento, información de familiares o personas de referencia.",
      ]}
      asideTitle="No todos los olvidos indican deterioro cognitivo"
      asideBody="La exploración permite diferenciar una queja subjetiva de dificultades objetivables y valorar si resulta indicado ampliar el estudio o coordinarlo con neurología, geriatría o atención primaria."
      modalityIntro="Dos niveles de exploración según la pregunta clínica. La modalidad ampliada permite caracterizar con mayor detalle el rendimiento y establecer una línea base para el seguimiento."
      modalities={[
        {
          title: "Valoración clínica focalizada",
          price: 350,
          time: "Orientativamente, 2–3 sesiones · Precio cerrado",
          description: "Primera exploración estructurada de memoria y funcionamiento cognitivo para orientar las quejas referidas y determinar si son necesarias pruebas adicionales.",
          features: [
            "Entrevista clínica y análisis de la evolución de los cambios.",
            "Cribado cognitivo y pruebas focalizadas seleccionadas según edad y escolaridad.",
            "Exploración del funcionamiento cotidiano y factores emocionales o médicos relevantes.",
            "Informe de orientación clínica, devolución y recomendaciones.",
          ],
        },
        {
          title: "Evaluación neuropsicológica ampliada",
          price: 500,
          time: "Orientativamente, 3–4 sesiones · Precio cerrado",
          description: "Exploración más extensa para describir fortalezas y dificultades cognitivas, documentar un perfil inicial y apoyar la toma de decisiones clínicas y el seguimiento.",
          features: [
            "Incluye todo el proceso de la valoración focalizada.",
            "Exploración individualizada de aprendizaje y memoria, atención, lenguaje, funciones ejecutivas y habilidades visuoespaciales.",
            "Análisis del funcionamiento instrumental y comparación con antecedentes o evaluaciones previas cuando existan.",
            "Informe neuropsicológico ampliado, devolución y recomendaciones de seguimiento o derivación.",
          ],
        },
      ]}
      difference={150}
      steps={[
        { title: "Entrevista", detail: "Cambios percibidos, evolución, antecedentes, medicación y autonomía." },
        { title: "Exploración", detail: "Pruebas cognitivas pertinentes y observación del desempeño." },
        { title: "Integración", detail: "Perfil cognitivo, factores moduladores e impacto funcional." },
        { title: "Devolución", detail: "Informe, explicación de resultados y próximos pasos." },
      ]}
      caution="La evaluación neuropsicológica caracteriza el rendimiento y aporta hipótesis clínicas. No permite, por sí sola, determinar la etiología de una demencia ni sustituye las exploraciones médicas indicadas. Si existe un empeoramiento agudo, confusión súbita u otros signos neurológicos, se requiere valoración médica prioritaria."
      faqs={[
        { question: "¿Qué diferencia hay entre las dos modalidades?", answer: "La focalizada responde a una primera pregunta clínica mediante entrevista, cribado y exploración selectiva. La ampliada estudia con más detalle los dominios cognitivos y el funcionamiento cotidiano, especialmente cuando hay cambios persistentes o se requiere un perfil para seguimiento." },
        { question: "¿Debo tener un diagnóstico médico previo?", answer: "No. Puedes solicitar valoración por quejas de memoria o cambios percibidos. Cuando corresponda, se recomendará coordinación con atención primaria, neurología o geriatría." },
        { question: "¿Conviene acudir acompañado?", answer: "Es opcional. Si la persona evaluada lo autoriza, la información de un familiar puede ayudar a reconstruir la evolución y el impacto funcional." },
        { question: "¿Se puede comparar con una evaluación anterior?", answer: "Sí. Los informes previos permiten valorar posibles cambios longitudinales, teniendo en cuenta diferencias entre pruebas, práctica y contexto clínico." },
        { question: "¿Incluye informe y devolución?", answer: "Sí. Ambas modalidades incluyen un informe escrito y una sesión de devolución. Las conclusiones señalarán expresamente las limitaciones de la información disponible." },
      ]}
      closingTitle="Una valoración que ayude a decidir"
      closingBody="El objetivo no es poner una etiqueta a cada olvido, sino comprender el patrón de dificultades, su repercusión en la vida cotidiana y qué actuaciones están justificadas en cada caso."
    />
  );
}
