import type { CSSProperties } from "react";

/* La app usa las fuentes de la web pública, ya cargadas por el layout raíz. */
const typography = {
  "--esapp-font-interfaz": "var(--font-inter)",
  "--esapp-font-editorial": "var(--font-newsreader)",
} as CSSProperties;

export default function MiEspacioLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <div style={typography}>{children}</div>;
}
