"use client";
import { useEffect, useState } from "react";
import "./portal-access-notice.css";

type Access = {
  mode: "therapy_included" | "subscription" | "ended" | "pending" | "temporarily_unavailable";
  can_access: boolean;
  enforcement_enabled: boolean;
  current_period_end: string | null;
};

export default function PortalAccessNotice() {
  const [access, setAccess] = useState<Access | null>(null);
  useEffect(() => {
    let active = true;
    let revision = 0;
    const refresh = async () => {
      const thisRequest = ++revision;
      try {
        const response = await fetch("/api/patient-portal/access", { cache: "no-store", credentials: "include" });
        if (!response.ok) { if (active && thisRequest === revision) setAccess(null); return; }
        const result = await response.json() as { entitlement?: Access };
        if (active && thisRequest === revision) setAccess(result.entitlement || null);
      } catch { if (active && thisRequest === revision) setAccess(null); }
    };
    void refresh();
    window.addEventListener("patient-portal-session-ready", refresh);
    return () => { active = false; window.removeEventListener("patient-portal-session-ready", refresh); };
  }, []);

  if (!access || access.mode === "therapy_included") return null;
  const validUntil = access.current_period_end && !Number.isNaN(Date.parse(access.current_period_end))
    ? new Intl.DateTimeFormat("es-ES",{day:"numeric",month:"long",year:"numeric"}).format(new Date(access.current_period_end))
    : null;
  const subscribed = access.mode === "subscription";
  return (
    <aside className="space-entitlement-notice" aria-label="Información sobre el acceso a Wellness">
      <strong>{subscribed ? "Tu suscripción está activa" : access.mode === "ended" ? "Tu etapa terapéutica ha finalizado" : "Acceso a Wellness"}</strong>
      <p>
        {subscribed ? `Tienes acceso al servicio digital${validUntil ? ` hasta el ${validUntil}` : ""}. Esto es independiente de la historia clínica.`
          : access.enforcement_enabled && !access.can_access
          ? "El acceso a las actividades digitales ha finalizado. La contratación online todavía no está disponible. Contacta con la consulta para conocer las alternativas."
          : "Durante la terapia, Wellness y los materiales están incluidos. La continuidad tras el alta será voluntaria mediante suscripción cuando se habilite; todavía no se realizan cargos automáticos."}
      </p>
      <small>Los derechos de acceso a tu documentación clínica no dependen de una suscripción.</small>
    </aside>
  );
}
