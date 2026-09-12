export default function NotFound() {
  return (
    <main className="editorial-site">
      <section
        className="editorial-section"
        style={{ minHeight: "62vh", display: "grid", placeItems: "center" }}
      >
        <div className="editorial-wrap" style={{ maxWidth: 760, textAlign: "center" }}>
          <p className="editorial-section-eyebrow">Página no encontrada</p>
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
            Puede que el enlace haya cambiado o que la dirección no sea correcta. Puedes volver al inicio o consultar directamente las áreas de Psicología y Neuropsicología.
          </p>
          <div className="editorial-actions" style={{ justifyContent: "center", marginBottom: 0 }}>
            <a className="editorial-btn editorial-btn-primary" href="/">Volver al inicio</a>
            <a className="editorial-btn editorial-btn-secondary" href="/cita/">Pedir cita</a>
          </div>
        </div>
      </section>
    </main>
  );
}
