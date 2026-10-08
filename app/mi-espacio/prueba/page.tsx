import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi espacio | Acceso actualizado",
  robots: { index: false, follow: false, nocache: true },
};

export default function MiEspacioPruebaRedirect() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6fbfd", padding: 24 }}>
      <meta httpEquiv="refresh" content="0;url=/mi-espacio/" />
      <div style={{ maxWidth: 540, borderRadius: 18, background: "#fff", padding: 28, color: "#173a5e" }}>
        <h1 style={{ fontFamily: "Georgia, serif" }}>Mi espacio se ha actualizado</h1>
        <p>Ya no es necesario utilizar la versión de pruebas. Accede a la plataforma actualizada con tu correo y contraseña.</p>
        <a href="/mi-espacio/" style={{ color: "#087f85", fontWeight: 700 }}>Abrir Mi espacio</a>
      </div>
    </main>
  );
}
