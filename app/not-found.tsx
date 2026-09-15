export default function NotFound() {
  return (
    <main className="editorial-site">
      <section
        className="editorial-section"
        style={{ minHeight: "62vh", display: "grid", placeItems: "center" }}
      >
        <div className="editorial-wrap" style={{ maxWidth: 760, textAlign: "center" }}>
          <p className="editorial-section-eyebrow">Error 404 · Página no encontrada</p>
          <h1
            style={{
              margin: "0 auto",
              maxWidth: "13ch",
              fontFamily: "Newsreader, Georgia, serif",
              fontSize: "clamp(2.6rem, 6vw, 4.7rem)",
              fontWeight: 500,
              lineHeight: 1.03,
              letterSpacing: "-.035em",
            }}
          >
            Esta página no está aquí.
          </h1>
          <p
            style={{
              maxWidth: "54ch",
              margin: "22px auto 30px",
              color: "#52605A",
              fontSize: "1.02rem",
              lineHeight: 1.7,
            }}
          >
            Puede que el enlace haya cambiado o que la dirección no sea correcta. Puedes volver al inicio,
            reservar una visita o contactar conmigo si necesitas localizar una información concreta.
          </p>
          <div className="editorial-actions" style={{ justifyContent: "center", marginBottom: 14 }}>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="/">Volver al inicio</a>
          </div>
          <p style={{ margin: 0, color: "#52605A", fontSize: ".88rem" }}>
            <a href="mailto:contact@carolinasanchezgirona.com" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
              contact@carolinasanchezgirona.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
