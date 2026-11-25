type Area = "agenda" | "economia" | "articulos" | "recursos" | "preguntas" | "tareas" | "residencia" | "mensajes" | "notificaciones" | "marketing" | "seo" | "biblioteca" | "protocolos" | "informes" | "seguridad" | "logs" | "otra";

type Icon = "messages" | "bell" | "today" | "agenda" | "patients" | "pending" | "more";

function NavIcon({ name }: { name: Icon }) {
  return (
    <svg className="workspace-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "today" && <><path d="m3 10 9-7 9 7v10H3V10Z" /><path d="M9 21v-8h6v8" /></>}
      {name === "agenda" && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h3" /></>}
      {name === "patients" && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></>}
      {name === "pending" && <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4.5h6M9 11h6M9 15h6M9 19h4" /></>}
      {name === "messages" && <path d="M4 4h16v13H8l-4 4V4Z M8 8h8M8 12h6" />}
      {name === "bell" && <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9M10 21h4" />}
      {name === "more" && <path d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  );
}

/** Navegación transversal de la zona profesional: solo renderizar tras autenticar. */
export default function AdminWorkspaceNav({ active }: { active: Area }) {
  const options = [
    { key: "today", icon: "today", label: "Inicio", href: "/admin/" },
    { key: "agenda", icon: "agenda", label: "Agenda", href: "/admin/agenda/" },
    { key: "mensajes", icon: "messages", label: "Mensajes de pacientes", href: "/admin/mensajes/" },
    { key: "notificaciones", icon: "bell", label: "Centro de avisos", href: "/admin/notificaciones/" },
    { key: "patients", icon: "patients", label: "Pacientes", href: "/admin/clinica/?panel=1&view=patients" },
  ] as const;
  return (
    <nav className="admin-workspace-nav" aria-label="Navegación principal de Dememoria">
      {options.map(item => <a key={item.key} href={item.href} className={active === item.key ? "is-active" : undefined}
        aria-current={active === item.key ? "page" : undefined}>
        <NavIcon name={item.icon} /><span>{item.label}</span>
      </a>)}
      <details className="admin-workspace-more">
        <summary className={!["agenda", "otra", "mensajes", "notificaciones"].includes(active) ? "is-active" : undefined}><NavIcon name="more" /><span>Más</span></summary>
        <div className="admin-workspace-more-panel">
          <p className="admin-workspace-more-label">Clínica y evaluación</p>
          <a href="/admin/clinica/?panel=1">Gestión clínica</a>
          <a href="/admin/clinica/protocolos/" aria-current={active === "protocolos" ? "page" : undefined}>Protocolos clínicos</a>
          <a href="/admin/clinica/informes/" aria-current={active === "informes" ? "page" : undefined}>Informes y valoraciones</a>
          <a href="/admin/clinica/materiales-externos/">Biblioteca clínica</a>
          <a href="/admin/clinica/documentacion/" aria-current={active === "biblioteca" ? "page" : undefined}>Documentación</a>
          <p className="admin-workspace-more-label">Organización y seguimiento</p>
          <a href="/admin/tareas/" aria-current={active === "tareas" ? "page" : undefined}>Tareas y notas</a>
          <a href="/admin/residencia/" aria-current={active === "residencia" ? "page" : undefined}>Residencia</a>
          <p className="admin-workspace-more-label">Gestión y difusión</p>
          <a href="/admin/economia/" aria-current={active === "economia" ? "page" : undefined}>Contabilidad</a>
          <a href="/admin/articulos/" aria-current={active === "articulos" ? "page" : undefined}>Centro editorial</a>
          <a href="/admin/recursos/" aria-current={active === "recursos" ? "page" : undefined}>Recursos</a>
          <a href="/admin/seo/" aria-current={active === "seo" ? "page" : undefined}>SEO y captación</a>
          <a href="/admin/marketing/" aria-current={active === "marketing" ? "page" : undefined}>Marketing</a>
          <p className="admin-workspace-more-label">Seguridad y privacidad</p>
          <a href="/admin/proteccion-datos/" aria-current={active === "seguridad" ? "page" : undefined}>Protección de datos e incidencias</a>
          <a href="/admin/logs/" aria-current={active === "logs" ? "page" : undefined}>Logs y auditoría</a>
          <a href="/admin/">Panel general</a>
        </div>
      </details>
    </nav>
  );
}
