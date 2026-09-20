"use client";

import { useEffect, useState } from "react";

const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";

export default function CompraCompletadaPage() {
  const [state, setState] = useState<"checking" | "ready" | "error">("checking");
  const [message, setMessage] = useState("Estamos verificando tu compra…");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("Compra completada");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setState("error");
      setMessage("No hemos podido localizar una sesión de pago válida.");
      return;
    }

    fetch(`${SUPABASE_URL}/functions/v1/resource-download`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !body?.url) throw new Error(body?.error || "No se ha podido preparar la descarga.");
        return body;
      })
      .then((body) => {
        setTitle(body.title || "Compra completada");
        setMessage("El pago está confirmado. El enlace de descarga es temporal y caduca en 10 minutos.");
        setDownloadUrl(body.url);
        setState("ready");
      })
      .catch((error) => {
        setState("error");
        setMessage(error instanceof Error ? error.message : "No se ha podido verificar la compra.");
      });
  }, []);

  return (
    <main className="resources-success-page">
      <section className="resources-success-card">
        <p className="editorial-eyebrow">Recursos digitales</p>
        <h1>{title}</h1>
        <p>{message}</p>
        {state === "checking" ? <div className="resources-success-progress">Verificando pago…</div> : null}
        {downloadUrl ? (
          <a className="editorial-btn editorial-btn-primary" href={downloadUrl}>
            Descargar recurso
          </a>
        ) : null}
        <a className="resources-success-back" href="/recursos/">
          Volver a recursos
        </a>
      </section>
    </main>
  );
}
