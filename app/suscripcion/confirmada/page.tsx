import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suscripción confirmada | Carolina Sánchez",
  description: "Gracias por confirmar tu suscripción a los recursos de psicología y neuropsicología.",
  robots: { index: false, follow: false },
};

export default function SuscripcionConfirmada() {
  return (
    <main style={{ minHeight: "75vh", display: "grid", placeItems: "center", padding: "72px 20px", background: "#ffffff" }}>
      <section style={{ maxWidth: 680, width: "100%", textAlign: "center" }} aria-labelledby="confirmed-title">
        <p style={{ color: "#08A6A0", fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", fontSize: 13 }}>Recursos gratuitos</p>
        <div aria-hidden="true" style={{ fontSize: 48, margin: "18px 0", color: "#08A6A0" }}>✓</div>
        <h1 id="confirmed-title" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px,5vw,56px)", lineHeight: 1.12, color: "#173A5E", margin: "12px 0 24px" }}>¡Suscripción confirmada!</h1>
        <p style={{ fontSize: 19, lineHeight: 1.7, color: "#35516C" }}>Gracias por unirte. A partir de ahora podrás recibir nuevos cuadernos, herramientas prácticas y novedades de psicología y neuropsicología de Carolina Sánchez Girona.</p>
        <p style={{ color: "#587087", lineHeight: 1.6 }}>Puedes darte de baja en cualquier momento desde el enlace incluido en nuestros correos.</p>
        <a href="/recursos/" style={{ display: "inline-block", background: "#173A5E", color: "#fff", borderRadius: 100, padding: "15px 25px", marginTop: 20, fontWeight: 700, textDecoration: "none" }}>Explorar recursos gratuitos →</a>
      </section>
    </main>
  );
}
