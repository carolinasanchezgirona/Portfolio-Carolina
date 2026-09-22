"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../lib/supabase-public";
import { getPublishedExpertQuestions, PublicExpertQuestion, QuestionCategory } from "./questions-data";

const categoryLabels: Record<QuestionCategory, string> = {
  psicologia: "Psicología",
  "ansiedad-animo": "Ansiedad y estado de ánimo",
  "relaciones-duelo": "Relaciones y duelo",
  neuropsicologia: "Neuropsicología",
  "memoria-deterioro": "Memoria y deterioro cognitivo",
  "familiares-cuidadores": "Familiares y cuidadores",
  otra: "Otra consulta",
};

const filterOptions: Array<{ value: "todas" | QuestionCategory; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "psicologia", label: "Psicología" },
  { value: "ansiedad-animo", label: "Ansiedad y ánimo" },
  { value: "relaciones-duelo", label: "Relaciones y duelo" },
  { value: "neuropsicologia", label: "Neuropsicología" },
  { value: "memoria-deterioro", label: "Memoria" },
  { value: "familiares-cuidadores", label: "Cuidadores" },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

export default function QuestionsExperience({ initialQuestions }: { initialQuestions: PublicExpertQuestion[] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"todas" | QuestionCategory>("todas");
  const [visibleCount, setVisibleCount] = useState(10);
  const [question, setQuestion] = useState("");
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    getPublishedExpertQuestions().then((fresh) => {
      if (fresh.length || !initialQuestions.length) setQuestions(fresh);
    });
  }, [initialQuestions.length]);

  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (!slug) return;
    window.requestAnimationFrame(() => {
      const target = document.getElementById(slug) as HTMLDetailsElement | null;
      if (target) {
        target.open = true;
        target.scrollIntoView({ block: "center" });
      }
    });
  }, [questions]);

  useEffect(() => setVisibleCount(10), [search, category]);

  const filteredQuestions = useMemo(() => {
    const term = normalize(search.trim());
    return questions.filter((item) => {
      const categoryMatches = category === "todas" || item.category === category;
      const textMatches = !term || normalize(`${item.question} ${item.answer}`).includes(term);
      return categoryMatches && textMatches;
    });
  }, [questions, search, category]);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }), [questions]);

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 80) {
      setFormState("error");
      setFormMessage("Desarrolla un poco más la pregunta: necesitamos al menos 80 caracteres.");
      return;
    }

    setFormState("sending");
    setFormMessage("Enviando tu pregunta de forma segura…");
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-expert-question`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          category: data.get("category"),
          email: data.get("email"),
          website: data.get("website"),
          privacyAccepted: data.get("privacy") === "on",
          healthConsent: data.get("health-consent") === "on",
          publishConsent: data.get("publish-consent") === "on",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "No se ha podido enviar la pregunta.");
      form.reset();
      setQuestion("");
      setFormState("success");
      setFormMessage("Gracias. He recibido tu pregunta y la revisaré antes de publicar una versión anonimizada.");
    } catch (error) {
      setFormState("error");
      setFormMessage(error instanceof Error ? error.message : "No se ha podido enviar la pregunta.");
    }
  }

  return (
    <>
      {questions.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}

      <section className="question-hero" aria-labelledby="question-page-title">
        <div className="editorial-wrap question-hero-grid">
          <div className="question-hero-copy">
            <p className="editorial-eyebrow">Divulgación en psicología y neuropsicología</p>
            <h1 id="question-page-title">Pregunta a Carolina</h1>
            <p className="question-intro">
              Envíame una duda general sobre bienestar emocional, relaciones, memoria o neuropsicología. Seleccionaré
              preguntas de interés común y responderé aquí con una mirada profesional, clara y comprensible.
            </p>
            <div className="question-principles" aria-label="Cómo funciona">
              <span><strong>01</strong> Tú preguntas</span>
              <span><strong>02</strong> Yo reviso y anonimizo</span>
              <span><strong>03</strong> La respuesta se publica aquí</span>
            </div>
            <aside className="question-boundary">
              <strong>Antes de escribir</strong>
              <p>No incluyas nombres, diagnósticos, medicación ni datos que permitan identificarte a ti o a otra persona.</p>
              <p>Este espacio es divulgativo: no ofrece diagnóstico, tratamiento individual ni atención urgente.</p>
            </aside>
          </div>

          <form className="question-form" onSubmit={submitQuestion}>
            <div className="question-form-heading">
              <p className="editorial-section-eyebrow">Buzón confidencial</p>
              <h2>¿Qué te gustaría comprender mejor?</h2>
              <p>Tu texto original nunca se publica. Si la pregunta es seleccionada, antes prepararé una versión anónima.</p>
            </div>

            <label>
              Tema
              <select name="category" defaultValue="" required>
                <option value="" disabled>Selecciona una opción</option>
                {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>

            <label>
              Tu pregunta
              <textarea
                name="question"
                rows={7}
                minLength={80}
                maxLength={1200}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Explica tu duda de forma general, sin datos personales ni información que permita identificar a nadie."
                required
              />
              <span className="question-character-count">{question.length}/1.200 · mínimo 80</span>
            </label>

            <label>
              Correo para avisarte si se publica <span>(opcional)</span>
              <input name="email" type="email" autoComplete="email" maxLength={254} placeholder="tu@correo.com" />
              <small>No aparecerá en la web.</small>
            </label>

            <label className="question-honeypot" aria-hidden="true">
              Web
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>

            <div className="question-consents">
              <label><input name="privacy" type="checkbox" required /><span>He leído la <a href="/privacidad/" target="_blank">política de privacidad</a>.</span></label>
              <label><input name="health-consent" type="checkbox" required /><span>Consiento expresamente el tratamiento de la información de salud que decida incluir para gestionar esta pregunta.</span></label>
              <label><input name="publish-consent" type="checkbox" required /><span>Autorizo la publicación de una versión revisada y anonimizada de la pregunta junto con la respuesta.</span></label>
            </div>

            <button className="editorial-btn editorial-btn-primary question-submit" type="submit" disabled={formState === "sending"}>
              {formState === "sending" ? "Enviando…" : "Enviar pregunta"}
            </button>
            <p className={`question-form-message ${formState}`} role="status" aria-live="polite">{formMessage}</p>
          </form>
        </div>
      </section>

      <section className="question-archive editorial-section" aria-labelledby="answered-questions-title">
        <div className="editorial-wrap">
          <div className="question-archive-heading">
            <div>
              <p className="editorial-section-eyebrow">Respuestas profesionales</p>
              <h2 id="answered-questions-title">Preguntas respondidas</h2>
              <p>Un archivo acumulativo para consultar dudas frecuentes y encontrar orientación general.</p>
            </div>
            <label className="question-search">
              <span>Buscar en las respuestas</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ej. memoria, ansiedad, duelo…" />
            </label>
          </div>

          <div className="question-filters" aria-label="Filtrar preguntas por tema">
            {filterOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={category === option.value ? "active" : ""}
                aria-pressed={category === option.value}
                onClick={() => setCategory(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {filteredQuestions.length ? (
            <div className="question-list">
              {filteredQuestions.slice(0, visibleCount).map((item) => (
                <details className="question-answer" id={item.anchor_slug} key={item.id}>
                  <summary>
                    <span>
                      <small>{categoryLabels[item.category]}</small>
                      <strong>{item.question}</strong>
                    </span>
                    <i aria-hidden="true">+</i>
                  </summary>
                  <div className="question-answer-body">
                    <p>{item.answer}</p>
                    <footer>
                      <span>Respondido por Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga · COPC 24892</span>
                      {item.related_page && <a href={item.related_page}>Ampliar información →</a>}
                    </footer>
                  </div>
                </details>
              ))}
              {visibleCount < filteredQuestions.length && (
                <button className="question-load-more" type="button" onClick={() => setVisibleCount((count) => count + 10)}>
                  Mostrar más respuestas
                </button>
              )}
            </div>
          ) : (
            <div className="question-empty">
              <strong>{questions.length ? "No hay resultados con estos filtros." : "El archivo empieza aquí."}</strong>
              <p>{questions.length ? "Prueba con otra palabra o categoría." : "Las primeras respuestas aparecerán cuando hayan sido revisadas y publicadas."}</p>
            </div>
          )}
        </div>
      </section>

      <section className="question-author editorial-section" aria-labelledby="question-author-title">
        <div className="editorial-wrap question-author-inner">
          <div>
            <p className="editorial-section-eyebrow">Quién responde</p>
            <h2 id="question-author-title">Carolina Sánchez Girona</h2>
          </div>
          <div>
            <p>Psicóloga General Sanitaria y neuropsicóloga, colegiada COPC 24892. Las respuestas se basan en conocimiento profesional y tienen una finalidad exclusivamente divulgativa.</p>
            <a className="editorial-card-link" href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
          </div>
        </div>
      </section>

    </>
  );
}
