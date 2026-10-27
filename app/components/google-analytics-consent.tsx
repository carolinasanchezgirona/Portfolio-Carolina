"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsPage, BOOKING_SOURCE_KEY, CONSENT_MAX_AGE, CONSENT_VERSION, consentFromRecord, cookieDomains, GA_ID, LEGACY_STORAGE_KEY, STORAGE_KEY, type ConsentChoice } from "./analytics-privacy";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    carolinaAnalyticsLoaded?: boolean;
  }
}
function setDisabled(value: boolean) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = value;
}
function readConsent() {
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const result = consentFromRecord(window.localStorage.getItem(STORAGE_KEY));
    if (result === null) window.localStorage.removeItem(STORAGE_KEY);
    return result;
  } catch { return null; }
}
function writeConsent(choice: ConsentChoice) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, updatedAt: Date.now(), version: CONSENT_VERSION })); }
  catch { /* An unavailable preference store never blocks a rejection or enables Analytics. */ }
}
function clearAnalytics() {
  setDisabled(true);
  const names = document.cookie.split(";").map(c => c.split("=")[0]?.trim()).filter(name => name && /^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name));
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    for (const domain of cookieDomains(window.location.hostname)) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    }
  }
  try { window.sessionStorage.removeItem(BOOKING_SOURCE_KEY); } catch { /* Storage may be blocked. */ }
}
function startAnalytics(path: string) {
  const page = analyticsPage(path);
  if (!page) return;
  setDisabled(false);
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer!.push(arguments); };
  }
  const gtag = window.gtag;
  if (!window.carolinaAnalyticsLoaded) {
    gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("js", new Date());
  }
  gtag("config", GA_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: CONSENT_MAX_AGE / 1000,
    cookie_update: false,
    page_location: window.location.origin + page.path,
    page_referrer: "",
    page_title: page.title,
    ignore_referrer: true,
  });
  gtag("event", "page_view", { page_location: window.location.origin + page.path, page_referrer: "", page_title: page.title });
  if (!window.carolinaAnalyticsLoaded) {
    const script = document.createElement("script");
    script.id = "carolina-google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.referrerPolicy = "no-referrer";
    window.carolinaAnalyticsLoaded = true;
    document.head.appendChild(script);
  }
}

export default function GoogleAnalyticsConsent() {
  const pathname = usePathname() || "/";
  const privateArea = ["/admin", "/mi-espacio", "/entre-sesiones"].some(prefix => pathname === prefix || pathname.startsWith(prefix + "/"));
  // A client-side transition must also stop any SDK loaded by a previous public page.
  useEffect(() => {
    if (!analyticsPage(pathname) && window.carolinaAnalyticsLoaded) { clearAnalytics(); window.location.reload(); }
  }, [pathname]);
  return privateArea ? null : <PublicAnalyticsConsent pathname={pathname} />;
}
function PublicAnalyticsConsent({ pathname }: { pathname: string }) {
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [isReady, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);
  const lastPage = useRef("");

  useEffect(() => {
    const stored = readConsent();
    if (stored !== "accepted") clearAnalytics();
    setConsent(stored);
    setPanelOpen(stored === null);
    setReady(true);
    const open = () => setPanelOpen(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const next = readConsent();
      if (next !== "accepted") {
        clearAnalytics();
        if (window.carolinaAnalyticsLoaded) { window.location.reload(); return; }
      }
      setConsent(next); setPanelOpen(next === null);
    };
    window.addEventListener("carolina:cookie-preferences", open);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("carolina:cookie-preferences", open); window.removeEventListener("storage", sync); };
  }, []);
  useEffect(() => {
    if (panelOpen) panelRef.current?.focus();
  }, [panelOpen]);
  useEffect(() => {
    const analyticsAllowed = consent === "accepted" && isReady && analyticsPage(pathname);
    if (!analyticsAllowed) return;
    if (lastPage.current !== pathname) {
      lastPage.current = pathname;
      startAnalytics(pathname);
    }
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href") || "";
      const eventName = href.startsWith("tel:") ? "contact_phone_click" : href.startsWith("mailto:") ? "contact_email_click" : /^\/cita\/?(?:\?|$)/.test(href) ? "booking_click" : null;
      if (eventName) window.gtag?.("event", eventName);
    };
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); };
  }, [consent, isReady, pathname]);
  useEffect(() => {
    if (consent === null) return;
    // Re-evaluate a persisted choice if the tab remains open for months.
    const timer = window.setInterval(() => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY) && readConsent() === null) {
          clearAnalytics(); setConsent(null); setPanelOpen(true);
          if (window.carolinaAnalyticsLoaded) window.location.reload();
        }
      } catch { /* Current in-memory choice still applies. */ }
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [consent]);
  function chooseConsent(choice: ConsentChoice) {
    const reload = choice === "rejected" && window.carolinaAnalyticsLoaded;
    if (choice === "rejected") { clearAnalytics(); lastPage.current = ""; }
    writeConsent(choice); setConsent(choice); setPanelOpen(false);
    if (reload) window.location.reload();
    else window.setTimeout(() => settingsRef.current?.focus(), 0);
  }
  if (!isReady) return null;
  return <>
    {panelOpen ? <section ref={panelRef} tabIndex={-1} className="analytics-consent" role="dialog" aria-labelledby="cookie-panel-title" aria-describedby="cookie-panel-copy" onKeyDown={event => { if (event.key === "Escape" && consent !== null) setPanelOpen(false); }}>
      <div className="analytics-consent-copy">
        <strong id="cookie-panel-title">Cookies analíticas opcionales</strong>
        <p id="cookie-panel-copy">Carolina Sánchez Girona utiliza cookies propias de preferencia y cookies de Google Analytics para medir visitas a determinadas páginas públicas. Solo activamos la analítica si aceptas. Puedes rechazarla y cambiar tu decisión cuando quieras.</p>
        <a href="/cookies/">Finalidades, duración, proveedores y transferencias</a>
      </div>
      <div className="analytics-consent-actions">
        <button type="button" onClick={() => chooseConsent("rejected")}>Rechazar</button>
        <button type="button" onClick={() => chooseConsent("accepted")}>Aceptar analíticas</button>
      </div>
    </section> : <button ref={settingsRef} type="button" className="analytics-consent-settings" onClick={() => setPanelOpen(true)} aria-label="Configurar cookies">Cookies</button>}
  </>;
}
