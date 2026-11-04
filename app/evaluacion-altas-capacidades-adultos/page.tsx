import type { Metadata } from "next";
import NeuroAssessmentService from "../components/neuro-assessment-service";
import "../seo-pages.css";
import "../evaluacion-tdah-adultos/tdah.css";

const canonical = "/evaluacion-altas-capacidades-adultos/";
export const metadata: Metadata = {
  title: "Evaluación de altas capacidades intelectuales en adultos | Arenys de Mar",
  description: "Evaluación de altas capacidades en adultos en Arenys de Mar: perfil cognitivo 450 € y valoración ampliada 600 €, con pruebas, informe y devolución.",
  alternates: { canonical },
  openGraph: {
    title: "Altas capacidades en adultos: evaluación | Carolina Sánchez",
    description: "Estudio individualizado del perfil cognitivo en adultos. Dos modalidades, informe y sesión de devolución incluidos.",
    url: "https://carolinasanchezgirona.com" + canonical,
    type: "website",
  },
};
export default function AdultHighAbilitiesAssessmentPage() {
  return (
    <NeuroAssessmentService
      slug="evaluacion-altas-capacidades-adultos"
      shortName="Altas capacidades en adultos"
      eyebrow="Evaluación psicológica y neuropsicológica · Adultos"
      title="Evaluación de altas capacidades en adultos"
      lead="¿Te interesa comprender mejor tu perfil intelectual, tus fortalezas cognitivas y posibles discrepancias entre capacidades? Una evaluación rigurosa permite analizar resultados psicométricos en su contexto, sin convertir una puntuación en una explicación total de la persona."
      imageUrl="https://images.pexels.com/photos/8086374/pexels-photo-8086374.jpeg?auto=compress&cs=tinysrgb&w=1200"
      imageAlt="Mujer adulta trabajando con libros y notas en un entorno de estudio y reflexión"
      requestSubject="Solicitud de evaluación de altas capacidades en adultos"
      introTitle="Conocer el perfil intelectual, no solo una cifra"
      intro={[
        "Las altas capacidades intelectuales describen perfiles diversos y no constituyen por sí mismas un trastorno mental. La evaluación requiere instrumentos estandarizados apropiados, una entrevista que contextualice el motivo de consulta y una interpretación prudente de las puntuaciones.",
        "El estudio analiza fortalezas, diferencias entre índices y posibles factores que afectan al rendimiento. No se infiere una condición clínica ni una necesidad de tratamiento a partir de un resultado elevado.",
      ]}
      asideTitle="Una valoración ajustada a tu pregunta"
      asideBody="No es lo mismo querer conocer el perfil intelectual que explorar dificultades de atención, rendimiento desigual o experiencias emocionales asociadas. La elección de pruebas responde a ese objetivo."
      modalityIntro="La modalidad ampliada no determina que una persona tenga más o menos capacidad. Aporta información adicional cuando el motivo de consulta requiere estudiar otras funciones cognitivas o aspectos clínicos."
      modalities={[
        {
          title: "Evaluación del perfil intelectual",
          price: 450,
          time: "Orientativamente, 2–3 sesiones · Precio cerrado",
          description: "Valoración psicométrica de capacidades intelectuales y análisis de su perfil, con integración del motivo de consulta y los antecedentes relevantes.",
          features: [
            "Entrevista clínica y delimitación de la pregunta de evaluación.",
            "Pruebas estandarizadas de capacidad intelectual seleccionadas según indicación.",
            "Interpretación del perfil global y de sus posibles diferencias internas.",
            "Informe escrito, devolución y recomendaciones individualizadas.",
          ],
        },
        {
          title: "Evaluación cognitiva ampliada",
          price: 600,
          time: "Orientativamente, 3–4 sesiones · Precio cerrado",
          description: "Añade una exploración individualizada de otros procesos cognitivos y factores clínicos cuando existe una necesidad concreta de diagnóstico diferencial o comprensión del funcionamiento.",
          features: [
            "Incluye la evaluación del perfil intelectual.",
            "Exploración selectiva de atención, memoria de trabajo, funciones ejecutivas y otros dominios cuando proceda.",
            "Integración con antecedentes académicos, profesionales y funcionamiento cotidiano.",
            "Informe ampliado, sesión de devolución y orientación específica.",
          ],
        },
      ]}
      difference={150}
      steps={[
        { title: "Entrevista", detail: "Motivo de consulta, historia académica, laboral y desarrollo." },
        { title: "Pruebas", detail: "Instrumentos psicométricos seleccionados según la pregunta clínica." },
        { title: "Integración", detail: "Interpretación normativa y del perfil, con límites de validez." },
        { title: "Devolución", detail: "Informe, explicación del perfil y recomendaciones." },
      ]}
      caution="Las altas capacidades no son un diagnóstico del DSM-5-TR ni de la CIE-11. No existe una única puntuación universal que resuma todos los perfiles, y los criterios de identificación pueden variar según el contexto. La valoración de un adulto no equivale automáticamente a una acreditación educativa o administrativa."
      faqs={[
        { question: "¿Se pueden evaluar altas capacidades por primera vez en la edad adulta?", answer: "Sí. Es posible estudiar el funcionamiento intelectual en adultos aunque no existiera identificación en la infancia. La interpretación debe considerar trayectoria, contexto y propiedades psicométricas de las pruebas." },
        { question: "¿Qué diferencia hay entre la modalidad de 450 € y la de 600 €?", answer: "La primera se centra en el perfil intelectual. La ampliada añade exploración cognitiva selectiva si existen preguntas sobre atención, funciones ejecutivas, memoria u otros procesos. Más pruebas no significan necesariamente una identificación más válida." },
        { question: "¿Puedo saber si también existe TDAH o TEA?", answer: "Una evaluación de altas capacidades no sustituye un protocolo diagnóstico de TDAH o TEA. Si el motivo de consulta lo justifica, se propondrá una valoración diferencial específica." },
        { question: "¿El resultado sirve como certificación oficial?", answer: "Recibirás un informe psicológico profesional. La aceptación del documento en procesos académicos, administrativos o de selección depende de los criterios de cada organismo y no puede garantizarse." },
        { question: "¿Incluye informe y devolución?", answer: "Sí. Las dos modalidades incluyen informe escrito, explicación de resultados y recomendaciones adaptadas al motivo de consulta." },
      ]}
      closingTitle="Comprender tu funcionamiento con rigor"
      closingBody="La finalidad es construir un perfil cognitivo interpretable y útil. Las puntuaciones se explican en su contexto, con sus fortalezas, discrepancias y límites, para evitar conclusiones reduccionistas."
    />
  );
}
