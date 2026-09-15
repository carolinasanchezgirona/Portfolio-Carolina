"use client";

import { usePathname } from "next/navigation";

const hiddenPrefixes = ["/admin", "/privacidad", "/consentimiento-psicologico", "/consentimiento-neuropsicologico"];

export default function CrisisNotice() {
  const pathname = usePathname() || "/";
  if (hiddenPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null;

  return (
    <aside className="site-crisis-note" aria-label="Información para situaciones de urgencia">
      <div className="site-crisis-note-inner">
        <p>
          Esta web y esta consulta no prestan atención de urgencias. Ante una emergencia, llama al{" "}
          <a href="tel:112">112</a>. Si existe riesgo o ideación suicida, puedes contactar con la línea{" "}
          <a href="tel:024">024</a>.
        </p>
      </div>
    </aside>
  );
}
