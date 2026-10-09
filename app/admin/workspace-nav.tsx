type Area = "agenda" | "economia" | "otra";

type Icon = "today" | "agenda" | "patients" | "pending" | "more";

function NavIcon({ name }: { name: Icon }) {
  return (
    <svg className="workspace-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "today" && <><path d="m3 10 9-7 9 7v10H3V10Z" /><path d="M9 21v-8h6v8" /></>}
      {name === "agenda" && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h3" /></>}
      {name === "patients" && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></>}
      {name === "pending" && <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4.5h6M9 11h6M9 15h6M9 19h4" /></>}
      {name === "more" && <path d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  );
}

/** Navegación transversal de la zona profesional: solo renderizar tras autenticar. */
export default function AdminWorkspaceNav({ active }: { active: Area }) {
  const options = [
    { key: "today", icon: "today", label: "Hoy", href: "/admin/clinica/?panel=1&view=today" },
    { key: "agenda", icon: "agenda", label: "Agenda", href: "/admin/agenda/" },
    { key: "patients", icon: "patients", label: "Pacientes", href: "/admin/clinica/?panel=1&view=patients" },
    { key: "pending", icon: "pending", label: "Pendientes", href: "/admin/clinica/?panel=1&view=pending" },
  ] as const;
  return (
    <nav className="admin-workspace-nav" aria-label="Navegación principal de Dememoria">
      {options.map(item => <a key={item.key} href={item.href} className={active === "agenda" && item.key === "agenda" ? "is-active" : undefined}
        aria-current={active === "agenda" && item.key === "agenda" ? "page" : undefined}>
        <NavIcon name={item.icon} /><span>{item.label}</span>
      </a>)}
      <details className="admin-workspace-more">
        <summary className={active === "economia" ? "is-active" : undefined}><NavIcon name="more" /><span>Más</span></summary>
        <div className="admin-workspace-more-panel">
          <p className="admin-workspace-more-label">Atención clínica</p>
          <a href="/admin/clinica/?panel=1">Gestión clínica</a>
          <a href="/admin/agenda/">Agenda de pacientes</a>
          <p className="admin-workspace-more-label">Administración</p>
          <a href="/admin/economia/" aria-current={active === "economia" ? "page" : undefined}>Gestión económica</a>
          <a href="/admin/notificaciones/">Centro de avisos</a>
          <a href="/admin/articulos/">Artículos</a>
          <a href="/admin/recursos/">Recursos</a>
          <a href="/admin/preguntas/">Preguntas</a>
          <a href="/admin/">Panel general</a>
        </div>
      </details>
    </nav>
  );
}
