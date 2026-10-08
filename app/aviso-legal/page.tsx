import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Aviso legal | Carolina Sánchez Girona",
  description: "Información legal y datos profesionales de Carolina Sánchez Girona, psicóloga sanitaria y neuropsicóloga en Arenys de Mar.",
  robots: { index: false, follow: true },
};

export default function LegalNoticePage() {
  return (
    <main className="legal-page" lang="es">
      <header className="legal-wrap legal-header">
        <a className="legal-brand" href="/">
          <strong>Carolina Sánchez</strong>
          <span>Psicóloga · Neuropsicóloga</span>
        </a>
        <a className="legal-back" href="/">Volver a la web</a>
      </header>

      <section className="legal-hero">
        <div className="legal-wrap">
          <p className="legal-eyebrow">Información legal</p>
          <h1>Aviso legal</h1>
        </div>
      </section>

      <article className="legal-wrap legal-document">
        <section>
          <h2>1. Titular e identificación</h2>
          <p>En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico, se facilita la siguiente información sobre la titular de esta web:</p>
          <div className="legal-data">
            <p><strong>Titular:</strong> Carolina Sánchez Girona</p>
            <p><strong>Nombre comercial utilizado en esta web:</strong> Dememòria</p>
            <p><strong>Denominación de la consulta autorizada:</strong> Consulta de psicologia general sanitària Carolina Sánchez Girona</p>
            <p><strong>NIF:</strong> 53067189W</p>
            <p><strong>Consulta:</strong> Carrer Barcelona 8, escalera 1, local 4B, 08350 Arenys de Mar (Barcelona), España</p>
            <p><strong>Correo electrónico:</strong> <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a></p>
            <p><strong>Teléfono:</strong> <a href="tel:+34604974857">604 974 857</a></p>
            <p><strong>Dominio:</strong> carolinasanchezgirona.com</p>
          </div>
        </section>

        <section>
          <h2>2. Información profesional y sanitaria</h2>
          <p>La atención profesional está a cargo de Carolina Sánchez Girona, psicóloga general sanitaria y neuropsicóloga, colegiada número 24892 en el Col·legi Oficial de Psicologia de Catalunya (COPC).</p>
          <p><strong>Formación habilitante para el ejercicio de la Psicología General Sanitaria:</strong> Máster Universitario en Psicología General Sanitaria, cursado en España.</p>
          <p>Las normas profesionales y deontológicas aplicables pueden consultarse a través del <a href="https://www.copc.cat/" target="_blank" rel="noopener noreferrer">Col·legi Oficial de Psicologia de Catalunya</a>, sin perjuicio de la legislación sanitaria y de protección de datos vigente.</p>
          <p>La consulta dispone de autorización administrativa de funcionamiento otorgada por el Departament de Salut de la Generalitat de Catalunya, mediante resolución de 23 de mayo de 2025 de la Direcció General d’Ordenació i Regulació Sanitària.</p>
          <div className="legal-data">
            <p><strong>Registro de Centros, Servicios y Establecimientos Sanitarios:</strong> E08768201</p>
            <p><strong>Expediente de autorización:</strong> 147500</p>
            <p><strong>Cartera de servicios autorizada:</strong> Consulta de otros profesionales sanitarios · Psicología General Sanitaria</p>
            <p><strong>Autoridad sanitaria:</strong> Generalitat de Catalunya · Departament de Salut</p>
          </div>
          {/* PENDIENTE ANTES DE PUBLICAR: verificar documentalmente la denominación oficial del título de acceso a Psicología y el Estado de expedición de los títulos, que no se deduce necesariamente del lugar donde fueron cursados. No atribuir una autorización independiente de Neuropsicología a la resolución sanitaria. */}
        </section>

        <section>
          <h2>3. Objeto y uso de la web</h2>
          <p>Esta web ofrece información sobre los servicios profesionales de psicología general sanitaria y neuropsicología, publicaciones divulgativas y medios para solicitar cita.</p>
          <p>Los contenidos divulgativos no sustituyen una evaluación sanitaria individual ni constituyen un diagnóstico o una indicación terapéutica personalizada. La web y la consulta no prestan servicios de urgencias. En caso de emergencia, llama al 112.</p>
          <p>Las características, duración y tarifas de los servicios se indican en la <a href="/cita/">página de reserva</a>. Las evaluaciones que requieran sesiones adicionales o informes específicos se presupuestan conforme al alcance acordado previamente.</p>
        </section>

        <section>
          <h2>4. Propiedad intelectual</h2>
          <p>Salvo indicación expresa en contrario, los contenidos originales de esta web, incluidos textos, materiales propios, imágenes y elementos de diseño, pertenecen a su titular o se utilizan con la autorización o licencia correspondiente. La reproducción, distribución o comunicación pública de contenidos protegidos requiere autorización previa, salvo los usos permitidos por la legislación aplicable.</p>
        </section>

        <section>
          <h2>5. Enlaces a terceros y funcionamiento</h2>
          <p>La web puede incluir enlaces a plataformas externas para facilitar información, consultar reseñas o gestionar determinados servicios. Sus respectivas condiciones y políticas son responsabilidad de cada proveedor. Se adoptan medidas razonables para mantener la información actualizada y los servicios disponibles, sin que ello implique garantizar la ausencia absoluta de errores o interrupciones.</p>
        </section>

        <section>
          <h2>6. Protección de datos y cookies</h2>
          <p>El tratamiento de datos personales se describe en la <a href="/privacidad/">Política de privacidad</a>. La información disponible sobre tecnologías de seguimiento y la modificación de preferencias de cookies se encuentra en el <a href="/privacidad/#cookies">apartado de cookies</a>.</p>
        </section>

        <section>
          <h2>7. Normativa aplicable</h2>
          <p>Esta web se rige por la normativa española y de la Unión Europea que resulte aplicable. Los posibles conflictos se resolverán de conformidad con las normas imperativas de competencia y protección de consumidores y usuarios, cuando correspondan.</p>
        </section>
      </article>

      <footer className="legal-footer">
        <div className="legal-wrap">
          <a href="/privacidad/">Política de privacidad</a>
          {" · "}
          <a href="/privacidad/#cookies">Información sobre cookies</a>
          <p>© 2026 Carolina Sánchez Girona · Dememòria</p>
        </div>
      </footer>
    </main>
  );
}
