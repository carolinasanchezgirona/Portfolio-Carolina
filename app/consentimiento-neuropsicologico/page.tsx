import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Consentiment informat neuropsicològic | Carolina Sánchez Girona",
  description: "Consentiment informat per a intervenció neuropsicològica a Dememòria.",
};

export default function NeuropsychologicalConsentPage() {
  return (
    <main className="legal-page" lang="ca">
      <header className="legal-wrap legal-header">
        <a className="legal-brand" href="/">
          <strong>Carolina Sánchez</strong>
          <span>Psicòloga · Neuropsicòloga</span>
        </a>
        <a className="legal-back" href="/cita/">Tornar a la cita</a>
      </header>

      <section className="legal-hero">
        <div className="legal-wrap">
          <p className="legal-eyebrow">Dememòria · Consentiment informat</p>
          <h1>Consentiment informat per a intervenció neuropsicològica</h1>
        </div>
      </section>

      <article className="legal-wrap legal-document">
        <section>
          <div className="legal-data">
            <p><strong>Nom del pacient:</strong> __________________________</p>
            <p><strong>Data de naixement:</strong> __________________________</p>
            <p><strong>DNI/NIE:</strong> __________________________</p>
            <p><strong>Adreça:</strong> __________________________</p>
            <p><strong>Telèfon de contacte:</strong> __________________________</p>
            <p><strong>Correu electrònic:</strong> __________________________</p>
            <p><strong>Data de la signatura:</strong> __________________________</p>
            <p><strong>Nom del professional:</strong> __________________________</p>
            <p><strong>Centre:</strong> Dememòria – Neuropsicologia i Rehabilitació Neuropsicològica</p>
          </div>
        </section>

        <section>
          <h2>1. Introducció</h2>
          <p>Aquest document té com a objectiu proporcionar informació clara i detallada sobre la intervenció neuropsicològica que es durà a terme en Dememòria. La signatura d&apos;aquest consentiment indica que el pacient ha comprès la informació i accepta voluntàriament el tractament proposat.</p>
        </section>

        <section>
          <h2>2. Objectiu de la intervenció</h2>
          <p>El tractament neuropsicològic té com a finalitat:</p>
          <ul>
            <li>Avaluar, diagnosticar i/o rehabilitar alteracions cognitives, emocionals i conductuals derivades de dany cerebral, deterioració cognitiva o altres condicions neurològiques.</li>
            <li>Millorar o compensar dificultats en funcions cognitives com a memòria, atenció, llenguatge i funcions executives.</li>
            <li>Afavorir l&apos;autonomia en la vida diària a través d&apos;estratègies adaptades.</li>
            <li>Proporcionar suport emocional i psicoeducación al pacient i la seva família.</li>
          </ul>
        </section>

        <section>
          <h2>3. Naturalesa del tractament i procediments</h2>
          <p>La intervenció neuropsicològica inclourà:</p>
          <h3>Avaluació neuropsicològica inicial</h3>
          <ul>
            <li>Entrevista clínica detallada amb el pacient i, si és necessari, amb familiars.</li>
            <li>Aplicació de proves estandarditzades per a avaluar les funcions cognitives, emocionals i conductuals.</li>
            <li>Anàlisi de resultats per a dissenyar un pla d&apos;intervenció individualitzat.</li>
          </ul>
          <h3>Intervenció neuropsicològica</h3>
          <ul>
            <li>Rehabilitació cognitiva: Exercicis dirigits a millorar funcions cognitives afectades.</li>
            <li>Estimulació cognitiva: Tècniques per a mantenir i potenciar el rendiment cognitiu.</li>
            <li>Entrenament en estratègies compensatòries: Ensenyament de tècniques per a minimitzar l&apos;impacte dels dèficits en la vida diària.</li>
            <li>Psicoeducación: Informació i orientació per al pacient i el seu entorn sobre la seva condició.</li>
            <li>Suport emocional i psicològic: Gestió de l&apos;impacte emocional derivat dels dèficits cognitius.</li>
          </ul>
          <h3>Seguiment i ajust del tractament</h3>
          <ul>
            <li>Revisió periòdica de l&apos;evolució del pacient.</li>
            <li>Modificació del pla d&apos;intervenció si és necessari.</li>
            <li>Informe final amb recomanacions per a la vida diària.</li>
          </ul>
          <p>Les sessions podran ser presencials i/o telemàtiques, segons les necessitats del pacient.</p>
        </section>

        <section>
          <h2>4. Beneficis esperats</h2>
          <p>Els beneficis potencials inclouen:</p>
          <ul>
            <li>Millora en el rendiment cognitiu i funcional.</li>
            <li>Major independència en activitats diàries.</li>
            <li>Desenvolupament d&apos;estratègies per a compensar dèficits cognitius.</li>
            <li>Reducció de l&apos;impacte emocional de les dificultats cognitives.</li>
            <li>Millora en la qualitat de vida del pacient i el seu entorn.</li>
          </ul>
        </section>

        <section>
          <h2>5. Riscos i limitacions</h2>
          <p>Si bé la intervenció neuropsicològica pot ser beneficiosa, existeixen algunes consideracions:</p>
          <ul>
            <li>No es garanteix una recuperació total de les funcions cognitives afectades.</li>
            <li>La intervenció pot generar frustració o fatiga en alguns moments.</li>
            <li>L&apos;efectivitat del tractament depèn del compromís i la continuïtat del pacient.</li>
            <li>En alguns casos, es podrà recomanar la derivació a altres professionals de la salut.</li>
          </ul>
        </section>

        <section>
          <h2>6. Confidencialitat i protecció de dades</h2>
          <ul>
            <li>Tota la informació obtinguda durant el procés és confidencial i es protegeix segons la Llei de Protecció de Dades vigent a Espanya (LOPDGDD i RGPD).</li>
            <li>Les dades només podran compartir-se amb tercers (altres professionals de la salut) amb el consentiment exprés del pacient, excepte en situacions de risc per a la vida del pacient o tercers, o quan el requereixi la llei.</li>
            <li>Les sessions no podran ser gravades sense el consentiment explícit de totes dues parts.</li>
          </ul>
        </section>

        <section>
          <h2>7. Drets i responsabilitats del pacient</h2>
          <h3>Drets</h3>
          <ul>
            <li>Rebre informació clara i comprensible sobre el tractament.</li>
            <li>Expressar dubtes i preguntes en qualsevol moment.</li>
            <li>Modificar o retirar el seu consentiment en qualsevol moment sense justificació.</li>
            <li>Accedir a les seves dades personals i sol·licitar la seva eliminació segons la normativa vigent.</li>
          </ul>
          <h3>Responsabilitats</h3>
          <ul>
            <li>Assistir amb puntualitat a les sessions programades.</li>
            <li>Informar sobre canvis en el seu estat de salut o medicació que puguin afectar el tractament.</li>
            <li>Seguir les recomanacions terapèutiques per a optimitzar els resultats.</li>
          </ul>
        </section>

        <section>
          <h2>8. Consentiment</h2>
          <p>Declaro haver llegit i comprès la informació continguda en aquest document. Se m&apos;han explicat els objectius, beneficis, riscos i limitacions de la intervenció neuropsicològica. He tingut l&apos;oportunitat de formular preguntes i totes han estat respostes satisfactòriament.</p>
          <p>Autoritzo voluntàriament a Dememòria i al professional responsable a dur a terme la intervenció neuropsicològica descrita.</p>
          <p><strong>Signatura del pacient o representant legal</strong></p>
          <p>Signatura: __________________________</p>
          <p>Data: __________________________</p>
          <p><strong>Signatura del professional responsable</strong></p>
          <p>Signatura: __________________________</p>
          <p>Data: __________________________</p>
        </section>
      </article>

      <footer className="legal-footer">
        <div className="legal-wrap">© 2026 Carolina Sánchez Girona · Dememòria</div>
      </footer>
    </main>
  );
}
