"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const PAYMENT_LINKS: Record<string, string> = {
  "salir-del-bucle": "https://buy.stripe.com/9B6cN69V2bbXbJa5Czcwg00",
};

type Resource = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  category: "psicologia" | "neuropsicologia" | "profesionales";
  audience: "general" | "pacientes" | "familias" | "profesionales";
  format_label: string;
  price_cents: number;
  featured: boolean;
  cover_url: string | null;
  cover_alt: string | null;
};

const plannedResources = [
  {
    eyebrow: "Ansiedad y rumiación",
    title: "Salir del bucle",
    description:
      "Cuaderno práctico para identificar patrones de rumiación, reducir el enganche con los pensamientos y recuperar margen de acción.",
    meta: "Cuaderno descargable",
    price: "14,90 €",
    tone: "teal",
  },
  {
    eyebrow: "Psicología",
    title: "Ansiedad: comprender y regular",
    description:
      "Psicoeducación y ejercicios para reconocer el ciclo de la ansiedad, trabajar la evitación y practicar estrategias de regulación.",
    meta: "Guía + ejercicios",
    price: "14,90 €",
    tone: "coral",
  },
  {
    eyebrow: "Neuropsicología",
    title: "Memoria y atención en casa",
    description:
      "Propuesta estructurada de actividades para estimular procesos atencionales y mnésicos en la vida cotidiana.",
    meta: "Programa descargable",
    price: "19,90 €",
    tone: "indigo",
  },
];

function euro(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function ResourcesCatalog() {
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const select = "id,title,slug,subtitle,description,category,audience,format_label,price_cents,featured,cover_url,cover_alt";
    fetch(
      `${SUPABASE_URL}/rest/v1/digital_resources?select=${encodeURIComponent(select)}&status=eq.published&order=featured.desc,created_at.desc`,
      { headers: { apikey: KEY }, cache: "no-store" },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("No se han podido cargar los recursos.");
        return response.json();
      })
      .then((rows) => setResources(Array.isArray(rows) ? rows : []))
      .catch(() => {
        setResources([]);
        setMessage("Los recursos no se han podido cargar en este momento.");
      });
  }, []);

  async function startCheckout(resource: Resource) {
    const paymentLink = PAYMENT_LINKS[resource.slug];
    if (paymentLink) {
      window.location.href = paymentLink;
      return;
    }

    setBuyingId(resource.id);
    setMessage("");
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/resource-checkout`, {
        method: "POST",
        headers: { apikey: KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: resource.id }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.url) throw new Error(body?.error || "No se ha podido iniciar el pago.");
      window.location.href = body.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se ha podido iniciar el pago.");
      setBuyingId(null);
    }
  }

  if (resources === null) {
    return <div className="resources-loading">Cargando recursos…</div>;
  }

  if (!resources.length) {
    return (
      <>
        {message ? <p className="resources-catalog-message">{message}</p> : null}
        <div className="resources-grid">
          {plannedResources.map((resource) => (
            <article key={resource.title} className={`resource-card resource-card-${resource.tone}`}>
              <div className="resource-card-accent" />
              <p className="resource-card-eyebrow">{resource.eyebrow}</p>
              <h2>{resource.title}</h2>
              <p className="resource-card-copy">{resource.description}</p>
              <div className="resource-card-meta">
                <span>{resource.meta}</span>
                <strong>{resource.price}</strong>
              </div>
              <span className="resource-card-status">Próximamente</span>
            </article>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {message ? <p className="resources-catalog-message" role="status">{message}</p> : null}
      <div className="resources-grid">
        {resources.map((resource) => (
          <article key={resource.id} className="resource-card">
            {resource.cover_url ? (
              <div className="resource-card-cover">
                <Image
                  src={resource.cover_url}
                  alt={resource.cover_alt || resource.title}
                  width={560}
                  height={700}
                  sizes="(max-width: 900px) 100vw, 33vw"
                  unoptimized
                />
              </div>
            ) : (
              <div className="resource-card-accent" />
            )}
            <p className="resource-card-eyebrow">
              {resource.category === "neuropsicologia"
                ? "Neuropsicología"
                : resource.category === "profesionales"
                  ? "Profesionales"
                  : "Psicología"}
            </p>
            <h2>{resource.title}</h2>
            {resource.subtitle ? <p className="resource-card-subtitle">{resource.subtitle}</p> : null}
            <p className="resource-card-copy">{resource.description}</p>
            <div className="resource-card-meta">
              <span>{resource.format_label}</span>
              <strong>{euro(resource.price_cents)}</strong>
            </div>
            <button
              className="editorial-btn editorial-btn-primary resource-buy-button"
              type="button"
              onClick={() => startCheckout(resource)}
              disabled={buyingId === resource.id}
            >
              {buyingId === resource.id ? "Preparando pago…" : "Comprar y descargar"}
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
