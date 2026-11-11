import Script from "next/script";
import type { Metadata } from "next";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Panel de administración | Carolina Sánchez Girona",
  description: "Acceso privado a las herramientas de gestión de la consulta Dememoria.",
  robots: { index: false, follow: false, nocache: true },
};

type IconName = "clinical" | "calendar" | "economy" | "editorial" | "resources" | "questions" | "arrow" | "shield" | "bell" | "home" | "patients" | "more";
function AdminIcon({ name }: { name: IconName }) {
  return (
    <svg className="admin-hub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "home" && <><path d="m3 10 9-7 9 7v10H3V10Z" /><path d="M9 21v-8h6v8" /></>}
      {name === "patients" && <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87" /></>}
      {name === "more" && <path d="M4 6h16M4 12h16M4 18h16" />}
      {name === "clinical" && <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M9 3v3h6V3M12 10v7M8.5 13.5h7" /></>}
      {name === "calendar" && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h3" /></>}
      {name === "economy" && <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" /></>}
      {name === "editorial" && <><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" /></>}
      {name === "resources" && <><path d="M4 4h16v16H4zM8 4v16M12 8h5M12 12h5M12 16h4" /></>}
      {name === "questions" && <><path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 20l1.2-4.1a8.5 8.5 0 1 1 15.8-4.4Z" /><path d="M9.5 9a2.5 2.5 0 1 1 4.1 1.9c-.9.7-1.6 1.1-1.6 2.1M12 16h.01" /></>}
      {name === "arrow" && <><path d="M5 12h14M13 6l6 6-6 6" /></>}
      {name === "shield" && <><path d="m12 22-8-4V6l8-4 8 4v12l-8 4Z" /><path d="m9 12 2 2 4-4" /></>}
      {name === "bell" && <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9M10 21h4" /></>}
    </svg>
  );
}


type AdminMenuLink = { href: string; icon: IconName; label: string; keywords?: string };
type AdminMenuGroup = { id: string; title: string; links: AdminMenuLink[] };

// Mismo orden funcional que las barras de navegación del resto del admin.
const quickLinks: AdminMenuLink[] = [
  { href: "/admin/", icon: "home", label: "Inicio" },
  { href: "/admin/agenda/", icon: "calendar", label: "Agenda" },
  { href: "/admin/clinica/?panel=1&view=patients", icon: "patients", label: "Pacientes", keywords: "historiales fichas pacientes" },
];

const adminMenuGroups: AdminMenuGroup[] = [
  {
    id: "clinical", title: "Clínica y evaluación", links: [
      { href: "/admin/clinica/?panel=1", icon: "clinical", label: "Gestión clínica", keywords: "historia consulta terapia seguimiento informes" },
      { href: "/admin/clinica/protocolos/", icon: "clinical", label: "Protocolos clínicos", keywords: "evaluación neuropsicología adultos infantil pruebas batería" },
      { href: "/admin/clinica/materiales-externos/", icon: "resources", label: "Biblioteca clínica", keywords: "cuadernos ejercicios material pacientes" },
      { href: "/admin/clinica/documentacion/", icon: "resources", label: "Documentación", keywords: "consentimientos documentos entrevistas informes" },
    ]
  },
  {
    id: "organization", title: "Organización y seguimiento", links: [
      { href: "/admin/tareas/", icon: "editorial", label: "Tareas y notas" },
      { href: "/admin/residencia/", icon: "clinical", label: "Residencia" },
      { href: "/admin/mensajes/", icon: "questions", label: "Mensajes de pacientes" },
      { href: "/admin/notificaciones/", icon: "bell", label: "Centro de avisos", keywords: "notificaciones" },
    ]
  },
  {
    id: "business", title: "Gestión y difusión", links: [
      { href: "/admin/economia/", icon: "economy", label: "Contabilidad", keywords: "facturas cobros ingresos gastos" },
      { href: "/admin/articulos/", icon: "editorial", label: "Centro editorial", keywords: "blog publicaciones artículos" },
      { href: "/admin/recursos/", icon: "resources", label: "Recursos", keywords: "catálogo venta tienda mineuri" },
      { href: "/admin/marketing/", icon: "editorial", label: "Marketing", keywords: "seo promoción" },
    ]
  },
  {
    id: "tools", title: "Acceso y herramientas", links: [
      { href: "/admin-authenticator.html", icon: "shield", label: "Authenticator", keywords: "seguridad doble factor 2fa totp" },
      { href: "/downloads/mi-clinica-1.0.0.apk", icon: "more", label: "App Android", keywords: "aplicación instalar descargar" },
    ]
  }
];

function AdminMenuAnchor({ item }: { item: AdminMenuLink }) {
  const download = item.href.endsWith(".apk");
  return (
    <a href={item.href} data-search-text={[item.label, item.keywords || ""].join(" ")}
      aria-current={item.href === "/admin/" ? "page" : undefined}
      download={download || undefined} data-android-download={download || undefined}>
      <AdminIcon name={item.icon} /><span>{item.label}</span>
    </a>
  );
}

function AdminSidebarLinks() {
  return (
    <div className="admin-sidebar-navigation">
      <label className="admin-nav-search-label">
        <span>Buscar sección</span>
        <input type="search" className="admin-nav-search" placeholder="Ej. protocolos, facturas…" aria-label="Buscar sección del menú" autoComplete="off" />
      </label>
      <div className="admin-nav-quick" aria-label="Accesos frecuentes">
        {quickLinks.map(item => <AdminMenuAnchor key={item.href} item={item} />)}
      </div>
      <div className="admin-nav-groups">
        {adminMenuGroups.map(group => (
          <details key={group.id} className="admin-nav-group" data-group={group.id} open={group.id === "clinical"}>
            <summary><span>{group.title}</span><span className="admin-nav-chevron" aria-hidden="true">⌄</span></summary>
            <div className="admin-nav-group-links">
              {group.links.map(item => <AdminMenuAnchor key={item.href} item={item} />)}
            </div>
          </details>
        ))}
      </div>
      <p className="admin-nav-no-results" role="status" hidden>No se han encontrado secciones.</p>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <main className="admin-hub-page" id="admin-main-content">
      <div id="admin-home-loading" className="admin-hub-access" role="status">Comprobando acceso a la administración…</div>
      <section id="admin-home" className="admin-home" hidden>
        <aside className="admin-hub-sidebar" aria-label="Menú del área profesional">
          <a href="/admin/" className="admin-hub-sidebar-brand"><strong>Carolina Sánchez</strong><span>Psicología · Neuropsicología</span></a>
          <nav aria-label="Navegación lateral del panel" className="admin-hub-desktop-navigation">
            <AdminSidebarLinks />
          </nav>
          <details className="admin-hub-mobile-menu">
            <summary><AdminIcon name="more" /> Menú de administración</summary>
            <nav aria-label="Secciones de administración"><AdminSidebarLinks /></nav>
          </details>
          <p className="admin-hub-sidebar-footer"><AdminIcon name="shield" />Área profesional</p>
        </aside>
        <div className="admin-hub-workspace">
          <header className="admin-hub-topbar">
            <a href="/admin/" className="admin-hub-brand" aria-label="Panel de administración de Carolina Sánchez">
              <span className="admin-hub-mark" aria-hidden="true"><img src="/clinic-pwa-icon-192.png" alt="" width={47} height={47} /></span>
              <span><strong>Carolina Sánchez</strong><small>Psicología · Neuropsicología</small></span>
            </a>
            <div className="admin-hub-top-actions">
              <span className="admin-hub-private"><AdminIcon name="shield" /> Acceso privado</span>
              <button id="admin-home-refresh" className="admin-hub-outline" type="button">Actualizar</button>
              <button id="admin-home-logout" className="admin-hub-outline" type="button">Cerrar sesión</button>
            </div>
          </header>

          <section className="admin-hub-priority-section" aria-labelledby="admin-hub-daily-title">
            <div className="admin-hub-intro">
              <div>
                <p className="admin-home-eyebrow">Mi consulta</p>
                <h1 id="admin-hub-daily-title">Tu consulta hoy</h1>
                <p id="admin-home-date" className="admin-hub-date">Cargando fecha…</p>
              </div>
            </div>
            <p id="admin-home-status" className="admin-home-status" role="status" aria-live="polite" />
            <div className="admin-home-panel admin-hub-appointments">
              <div className="admin-home-panel-heading">
                <h2 id="admin-hub-appointments-title">Citas de hoy</h2>
                <a href="/admin/agenda/">Ver agenda</a>
              </div>
              <div id="admin-home-today" className="admin-home-list"><p className="admin-home-empty">Cargando…</p></div>
            </div>
          </section>
        </div>
      </section>
      <Script src="/clinic-pwa.js?v=20261020-android-native-1" strategy="afterInteractive" />
      <Script src="/admin-dashboard.js?v=20261109-today-only-2" strategy="afterInteractive" />
      <Script src="/admin-sidebar-navigation.js?v=20261111-menu-1" strategy="afterInteractive" />
    </main>
  );
}
