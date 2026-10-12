"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const GA_ID = "G-DMEDMEHMCJ";
const STORAGE_KEY = "carolina_analytics_consent_v1";
const BOOKING_SOURCE_KEY = "carolina_booking_source_v2";
const CONSENT_MAX_AGE = 1000 * 60 * 60 * 24 * 180;

type ConsentChoice = "accepted" | "rejected";
type StoredConsent = {
  choice: ConsentChoice;
  updatedAt: number;
};

type BookingSource = {
  // Categoría amplia: nunca se almacenan motivos de consulta, rutas clínicas ni títulos.
  sourceSection: "inicio" | "servicios" | "contenidos" | "recursos" | "otras";
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readStoredConsent(): ConsentChoice | null {
  try {
    const rawConsent = window.localStorage.getItem(STORAGE_KEY);
    if (!rawConsent) return null;

    const storedConsent = JSON.parse(rawConsent) as StoredConsent;
    const isValidChoice = storedConsent.choice === "accepted" || storedConsent.choice === "rejected";
    const isCurrent = Date.now() - storedConsent.updatedAt < CONSENT_MAX_AGE;

    if (!isValidChoice || !isCurrent) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return storedConsent.choice;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function storeConsent(choice: ConsentChoice) {
  const storedConsent: StoredConsent = { choice, updatedAt: Date.now() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedConsent));
}

function removeAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name) && /^(_ga|_gid|_gat)/.test(name));

  const domains = [window.location.hostname, `.${window.location.hostname}`];

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    }
  }
}

function denyAnalyticsConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  removeAnalyticsCookies();
}

function sendEvent(name: string, parameters: Record<string, string | number> = {}) {
  window.gtag?.("event", name, parameters);
}

function sectionForPath(path: string): BookingSource["sourceSection"] {
  if (path === "/") return "inicio";
  if (["/psicologia/", "/neuropsicologia/", "/psicologa-arenys-de-mar/", "/evaluacion-neuropsicologica/"].includes(path)) return "servicios";
  if (path.startsWith("/articulos/") || path.startsWith("/podcast/") || path.startsWith("/pregunta-a-carolina/")) return "contenidos";
  if (path.startsWith("/recursos/")) return "recursos";
  return "otras";
}

function saveBookingSource(source: BookingSource) {
  try {
    window.sessionStorage.setItem(BOOKING_SOURCE_KEY, JSON.stringify(source));
  } catch {
    // La atribución es opcional y nunca debe bloquear la reserva.
  }
}

function readBookingSource(): BookingSource | null {
  try {
    const raw = window.sessionStorage.getItem(BOOKING_SOURCE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BookingSource>;
    const allowed = ["inicio", "servicios", "contenidos", "recursos", "otras"];
    return parsed.sourceSection && allowed.includes(parsed.sourceSection)
      ? { sourceSection: parsed.sourceSection }
      : null;
  } catch {
    return null;
  }
}

export default function GoogleAnalyticsConsent() {
  const pathname = usePathname() || "";
  const privateArea = ["/admin", "/mi-espacio", "/entre-sesiones"].some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
  // These areas must never mount Analytics, even if marketing consent exists.
  return privateArea ? null : <PublicAnalyticsConsent />;
}

function PublicAnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const storedConsent = readStoredConsent();
    setConsent(storedConsent);
    setIsPanelOpen(storedConsent === null);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a,button") : null;
      if (!target) return;

      if (target instanceof HTMLAnchorElement) {
        const href = target.getAttribute("href") || "";
        if (href.startsWith("tel:")) {
          sendEvent("contact_phone_click");
        } else if (href.startsWith("mailto:")) {
          sendEvent("contact_email_click");
        } else if (href === "/cita" || href === "/cita/" || href.startsWith("/cita/?")) {
          const sourceSection = sectionForPath(window.location.pathname);
          saveBookingSource({ sourceSection });
          sendEvent("booking_click", { source_section: sourceSection });
        } else if (href.startsWith("/") && window.location.pathname.startsWith("/articulos/")) {
          sendEvent("article_internal_click");
        }
      }
    };

    document.addEventListener("click", onClick, true);

    let bookingTracked = false;
    const observer = new MutationObserver(() => {
      const message = document.querySelector("#form-message");
      if (!bookingTracked && message?.classList.contains("form-message-success")) {
        bookingTracked = true;
        const source = readBookingSource();
        sendEvent("booking_complete", {
          source_section: source?.sourceSection || "otras",
        });
        try {
          window.sessionStorage.removeItem(BOOKING_SOURCE_KEY);
        } catch {
          // El seguimiento nunca debe interferir con la reserva.
        }
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true });

    return () => {
      document.removeEventListener("click", onClick, true);
      observer.disconnect();
    };
  }, [consent]);

  function chooseConsent(choice: ConsentChoice) {
    if (choice === "rejected") denyAnalyticsConsent();
    storeConsent(choice);
    setConsent(choice);
    setIsPanelOpen(false);
  }

  if (!isReady) return null;

  return (
    <>
      {consent === "accepted" ? <GoogleAnalytics gaId={GA_ID} /> : null}

      {isPanelOpen ? (
        <section className="analytics-consent" role="dialog" aria-label="Preferencias de cookies" aria-live="polite">
          <div className="analytics-consent-copy">
            <strong>Cookies analíticas</strong>
            <p>
              Usamos Google Analytics para conocer el uso general de la web y mejorarla.
              Solo se activará si aceptas. Puedes cambiar tu decisión cuando quieras.
            </p>
            <a href="/privacidad/#cookies">Más información sobre las cookies</a>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => chooseConsent("rejected")}>Rechazar</button>
            <button className="analytics-consent-accept" type="button" onClick={() => chooseConsent("accepted")}>
              Aceptar analíticas
            </button>
          </div>
        </section>
      ) : (
        <button className="analytics-consent-settings" type="button" onClick={() => setIsPanelOpen(true)} aria-label="Configurar cookies">
          Cookies
        </button>
      )}
    </>
  );
}
