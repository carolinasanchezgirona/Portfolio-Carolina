import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Consentiment informat psicològic | Carolina Sánchez Girona",
  description: "Consentiment informat per a la intervenció psicològica a Dememoria.",
};

export default function PsychologicalConsentPage() {
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
          <p className="legal-eyebrow">Dememoria · Consentiment informat</p>
          <h1>Consentiment informat per a la intervenció psicològica</h1>
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
            <p><strong>Nom de la professional:</strong> Carolina Sánchez Girona</p>
            <p><strong>Centre:</strong> Dememoria – Neuropsicologia i Psicologia</p>
          </div>
        </section>

        <section>
          <h2>1. Introducció</h2>
          <p>Aquest document té com a objectiu proporcionar informació clara i detallada sobre la intervenció psicològica que es durà a terme a Dememoria. La signatura d’aquest consentiment indica que la persona ha entès la informació i accepta voluntàriament el tractament proposat.</p>
        </section>

        <section>
          <h2>2. Objectiu de la intervenció</h2>
          <p>El tractament psicològic té com a finalitat:</p>
          <ul>
            <li>Oferir suport psicològic per millorar el benestar emocional i la qualitat de vida.</li>
            <li>Identificar i abordar dificultats emocionals, cognitives i conductuals.</li>
            <li>Proporcionar estratègies per a la gestió de l’estrès, l’ansietat, la depressió, el dol o altres dificultats psicològiques.</li>
            <li>Facilitar eines per millorar l’autoestima, les habilitats socials i la regulació emocional.</li>
            <li>Acompanyar en processos de canvi i adaptació a noves situacions vitals.</li>
          </ul>
        </section>

        <section>
          <h2>3. Naturalesa del tractament i procediments</h2>
          <p>La intervenció psicològica inclourà:</p>
          <ul>
            <li>Avaluació inicial: entrevistes i qüestionaris per comprendre la situació de la persona.</li>
            <li>Teràpia psicològica: sessions individuals amb tècniques basades en evidència científica (ex. teràpia cognitivoconductual, teràpia d’acceptació i compromís, etc.).</li>
            <li>Estratègies d’afrontament: tècniques per millorar la gestió emocional i la presa de decisions.</li>
            <li>Seguiment i ajust del tractament segons l’evolució de la persona.</li>
            <li>Sessions presencials i/o telemàtiques, segons disponibilitat i necessitats.</li>
          </ul>
          <p>La durada del tractament dependrà de la problemàtica i de la valoració professional.</p>
        </section>

        <section>
          <h2>4. Beneficis esperats</h2>
          <p>Els beneficis potencials inclouen:</p>
          <ul>
            <li>Reducció del malestar emocional.</li>
            <li>Millora en la capacitat d’afrontar situacions difícils.</li>
            <li>Increment de l’autoestima i la confiança.</li>
            <li>Desenvolupament d’estratègies per gestionar emocions i pensaments.</li>
            <li>Millora de les relacions interpersonals.</li>
          </ul>
        </section>

        <section>
          <h2>5. Riscos i limitacions</h2>
          <p>Tot i que la intervenció psicològica pot ser beneficiosa, cal tenir en compte:</p>
          <ul>
            <li>Els canvis poden requerir temps i esforç.</li>
            <li>Algunes sessions poden generar malestar emocional temporal en abordar experiències difícils.</li>
            <li>La teràpia no garanteix resultats específics, ja que l’èxit depèn de múltiples factors.</li>
            <li>En casos greus, es pot recomanar la derivació a un altre professional o tractament complementari.</li>
          </ul>
        </section>

        <section>
          <h2>6. Confidencialitat i protecció de dades</h2>
          <p>Tota la informació obtinguda durant la teràpia és confidencial i es protegeix segons la Llei de Protecció de Dades vigent a Espanya (LOPDGDD i RGPD).</p>
          <p>Les dades només es podran compartir amb tercers (altres professionals de la salut) amb el consentiment exprés de la persona, excepte en situacions de risc per a la vida del pacient o de tercers, o quan ho requereixi la llei.</p>
          <p>Les sessions no podran ser enregistrades sense el consentiment explícit de totes dues parts.</p>
        </section>

        <section>
          <h2>7. Drets i responsabilitats de la persona</h2>
          <h3>Drets</h3>
          <ul>
            <li>Rebre informació clara i comprensible sobre el tractament.</li>
            <li>Expressar dubtes i preguntes en qualsevol moment.</li>
            <li>Modificar o retirar el consentiment en qualsevol moment sense justificació.</li>
            <li>Accedir a les seves dades personals i sol·licitar-ne l’eliminació segons la normativa vigent.</li>
          </ul>
          <h3>Responsabilitats</h3>
          <ul>
            <li>Assistir amb puntualitat a les sessions programades.</li>
            <li>Informar sobre canvis en l’estat de salut o la medicació que puguin afectar el tractament.</li>
            <li>Seguir les recomanacions terapèutiques per optimitzar els resultats.</li>
          </ul>
        </section>

        <section>
          <h2>8. Consentiment</h2>
          <p>Declaro haver llegit i entès la informació continguda en aquest document. Se m’han explicat els objectius, beneficis, riscos i limitacions de la intervenció psicològica. He tingut l’oportunitat de formular preguntes i totes han estat respostes satisfactòriament.</p>
          <p>Autoritzo voluntàriament Dememoria i la professional responsable a dur a terme la intervenció psicològica descrita.</p>
          <p><strong>Signatura de la persona atesa o representant legal</strong></p>
          <p>Signatura: __________________________</p>
          <p>Data: __________________________</p>
          <p><strong>Signatura de la professional responsable</strong></p>
          <p>Signatura: __________________________</p>
          <p>Data: __________________________</p>
        </section>
      </article>

      <footer className="legal-footer">
        <div className="legal-wrap">© 2026 Carolina Sánchez Girona · Dememoria</div>
      </footer>
    </main>
  );
}
