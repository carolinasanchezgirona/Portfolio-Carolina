import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Política de privacidad | Carolina Sánchez Girona",
  description: "Política de privacidad y protección de datos de Dememoria.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page" lang="es">
      <header className="legal-wrap legal-header">
        <a className="legal-brand" href="/">
          <strong>Carolina Sánchez</strong>
          <span>Psicóloga · Neuropsicóloga</span>
        </a>
        <a className="legal-back" href="/cita/">Volver a la cita</a>
      </header>

      <section className="legal-hero">
        <div className="legal-wrap">
          <p className="legal-eyebrow">Dememoria · Información legal</p>
          <h1>Política de privacidad y protección de datos</h1>
        </div>
      </section>

      <article className="legal-wrap legal-document">
        <section>
          <h2>1. Identificación del responsable del tratamiento</h2>
          <div className="legal-data">
            <p><strong>Responsable del tratamiento:</strong> Dememoria (Consulta de Neuropsicología y Psicología)</p>
            <p><strong>CIF/NIF:</strong> 53067189W</p>
            <p><strong>Dirección:</strong> Carrer Barcelona 8 Local Arenys de Mar</p>
            <p><strong>Correo electrónico:</strong> dememoria.arenys@gmail.com</p>
            <p><strong>Teléfono:</strong> 604974857</p>
            <p><strong>Delegado de Protección de Datos (si aplica):</strong> Carolina Sánchez</p>
          </div>
        </section>

        <section>
          <h2>2. Finalidad del tratamiento de datos</h2>
          <p>En Dememoria recogemos y tratamos datos personales con las siguientes finalidades específicas:</p>
          <h3>2.1. Prestación de servicios neuropsicológicos y psicológicos</h3>
          <ul>
            <li>Gestión de citas y agenda: Nombre, apellidos, DNI/NIE, teléfono, correo electrónico.</li>
            <li>Historia clínica y evaluación neuropsicológica: Antecedentes médicos, datos de salud, resultados de pruebas y evaluaciones.</li>
            <li>Planes de tratamiento y seguimiento: Notas clínicas, evolución terapéutica, registros de intervenciones.</li>
          </ul>
          <h3>2.2. Facturación y gestión administrativa</h3>
          <ul>
            <li>Emisión de facturas y justificantes de pago.</li>
            <li>Cumplimiento de obligaciones fiscales y contables.</li>
            <li>Cumplimiento con mínimos para facturación de Campaña Social.</li>
          </ul>
          <h3>2.3. Comunicación con el paciente</h3>
          <ul>
            <li>Envío de recordatorios de citas.</li>
            <li>Información sobre cambios en los servicios o recomendaciones profesionales.</li>
          </ul>
          <h3>2.4. Cumplimiento de obligaciones legales</h3>
          <ul>
            <li>Cumplimiento de normativas sanitarias y de protección de datos.</li>
            <li>Atención a requerimientos judiciales o administrativos.</li>
          </ul>
          <h3>2.5. Investigación y mejora de la práctica clínica (solo con consentimiento expreso)</h3>
          <p>Uso de datos anonimizados para estudios científicos o publicaciones.</p>
        </section>

        <section>
          <h2>3. Legitimación del tratamiento</h2>
          <p>El tratamiento de datos en Dememoria se basa en:</p>
          <ul>
            <li>Ejecución de un contrato de prestación de servicios (art. 6.1.b RGPD).</li>
            <li>Cumplimiento de obligaciones legales en materia sanitaria y fiscal (art. 6.1.c RGPD).</li>
            <li>Consentimiento expreso del paciente para el tratamiento de datos de salud (art. 9.2.a RGPD).</li>
          </ul>
          <p>Para cualquier uso adicional, se solicitará un consentimiento específico, informado y revocable.</p>
        </section>

        <section>
          <h2>4. Plazos de conservación de los datos</h2>
          <p>Los datos se conservarán durante los siguientes períodos:</p>
          <ul>
            <li>Datos administrativos y de contacto: Mientras dure la relación profesional y hasta 5 años después (por prescripción de posibles responsabilidades legales).</li>
            <li>Historia clínica y datos de salud: Mínimo 5 años desde la última consulta, conforme a la normativa sanitaria española.</li>
            <li>Facturación y datos fiscales: Mínimo 6 años, según el Código de Comercio y la normativa tributaria.</li>
            <li>Datos utilizados con fines de investigación: Se conservarán de forma anonimizada indefinidamente.</li>
          </ul>
        </section>

        <section>
          <h2>5. Destinatarios de los datos</h2>
          <p>Los datos personales NO serán cedidos a terceros salvo en las siguientes excepciones:</p>
          <ul>
            <li>Cumplimiento de obligaciones legales: Autoridades sanitarias, Hacienda, Seguridad Social, tribunales o fuerzas de seguridad.</li>
            <li>Colaboraciones con otros profesionales de la salud: Solo con consentimiento expreso del paciente.</li>
            <li>Asesoría contable y fiscal: Para la gestión económica de la consulta.</li>
            <li>Plataformas de gestión de citas o mensajería segura: Si se usan herramientas externas, se garantizará su cumplimiento con el RGPD</li>
          </ul>
          <p>No se realizan transferencias internacionales de datos.</p>
        </section>

        <section>
          <h2>6. Derechos del paciente</h2>
          <p>Los pacientes pueden ejercer los siguientes derechos mediante solicitud escrita a dememoria.arenys@gmail.com:</p>
          <ul>
            <li>Acceso: Saber qué datos tratamos.</li>
            <li>Rectificación: Corregir datos inexactos.</li>
            <li>Supresión (&quot;derecho al olvido&quot;): Eliminar datos cuando no sean necesarios.</li>
            <li>Limitación del tratamiento: Restringir el uso de datos en ciertos casos.</li>
            <li>Portabilidad: Solicitar la entrega de datos en formato digital estructurado.</li>
            <li>Oposición: Impedir el uso de datos para ciertos fines.</li>
            <li>Retirada del consentimiento: En cualquier momento, sin afectar la licitud del tratamiento previo.</li>
          </ul>
          <p>Si el usuario considera que sus derechos no han sido respetados, puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) (www.aepd.es).</p>
        </section>

        <section>
          <h2>7. Medidas de seguridad</h2>
          <p>Para proteger los datos personales, Dememoria aplica las siguientes medidas técnicas y organizativas:</p>
          <h3>7.1. Seguridad de los datos digitales</h3>
          <ul>
            <li>Acceso restringido: Solo profesionales autorizados pueden acceder a la información.</li>
            <li>Cifrado y copias de seguridad: Datos sensibles protegidos con medidas de encriptación.</li>
            <li>Uso de contraseñas seguras y autenticación en dos pasos en los sistemas informáticos.</li>
            <li>Registro de accesos y modificaciones en la historia clínica.</li>
          </ul>
          <h3>7.2. Seguridad de los datos en papel</h3>
          <ul>
            <li>Almacenamiento en archivadores cerrados con llave.</li>
            <li>Destrucción segura de documentos mediante trituradora o empresa certificada.</li>
          </ul>
          <h3>7.3. Seguridad en la comunicación</h3>
          <ul>
            <li>Correo electrónico cifrado para información sensible.</li>
            <li>No se usan aplicaciones de mensajería no seguras (WhatsApp, Telegram) para datos clínicos.</li>
          </ul>
        </section>

        <section>
          <h2>8. Uso de tecnologías y cookies</h2>
          <p>Si Dememoria tiene página web, se incluirá una política de cookies detallando:</p>
          <ul>
            <li>Tipos de cookies utilizadas.</li>
            <li>Finalidad de cada cookie.</li>
            <li>Posibilidad de configurar o rechazar cookies.</li>
          </ul>
        </section>

        <section>
          <h2>9. Modificaciones de esta política</h2>
          <p>Esta política puede actualizarse según cambios normativos o mejoras en la gestión de protección de datos. La última versión estará siempre disponible en la consulta y, en su caso, en la web de Dememoria.</p>
        </section>

        <section>
          <h2>Anexo: formulario de consentimiento para el tratamiento de datos de salud</h2>
          <p>Yo, [__________________________], con DNI/NIE [______________], declaro haber sido informado/a sobre la política de protección de datos de Dememoria y otorgo mi consentimiento expreso para el tratamiento de mis datos de salud con la finalidad de recibir atención psicológica/neuropsicológica.</p>
          <p>Entiendo que mis datos serán tratados con estricta confidencialidad.</p>
          <p>Soy consciente de mis derechos sobre mis datos personales.</p>
          <p>Doy o no doy mi consentimiento para recibir comunicaciones sobre mi tratamiento y recordatorios de citas por [correo electrónico/SMS].</p>
          <p>Fecha: _____________</p>
          <p>Firma del paciente: ____________________________</p>
        </section>
      </article>

      <footer className="legal-footer">
        <div className="legal-wrap">© 2026 Carolina Sánchez Girona · Dememoria</div>
      </footer>
    </main>
  );
}
