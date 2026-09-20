import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Política de privacidad | Carolina Sánchez Girona",
  description: "Política de privacidad y protección de datos de Dememoria.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
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
            <p><strong>Correo electrónico:</strong> contact@carolinasanchezgirona.com</p>
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
          <p><strong>Minimización en la reserva web:</strong> el formulario público de cita no solicita el motivo de consulta ni otros datos de salud. La información clínica se recoge únicamente cuando es necesaria para la atención profesional y por los canales habilitados para ello.</p>
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
          <p>Los datos se conservarán durante los períodos exigidos por la normativa aplicable y, en su caso, durante el tiempo necesario para atender posibles responsabilidades derivadas de la relación profesional.</p>
          <ul>
            <li>Datos administrativos y de contacto: mientras dure la relación profesional y durante los plazos legales posteriores aplicables.</li>
            <li>Historia clínica y datos de salud: durante el período mínimo exigido por la normativa sanitaria aplicable y, cuando proceda, por los plazos adicionales legalmente exigibles.</li>
            <li>Facturación y datos fiscales: durante los plazos establecidos por la normativa fiscal y mercantil.</li>
            <li>Datos utilizados con fines de investigación: únicamente cuando exista base jurídica suficiente y, cuando sea posible, de forma anonimizada.</li>
          </ul>
        </section>

        <section>
          <h2>5. Destinatarios, proveedores tecnológicos y transferencias</h2>
          <p>Los datos personales no se comunican a terceros salvo cuando resulte necesario para prestar el servicio, exista obligación legal o se cuente con una base jurídica válida.</p>
          <ul>
            <li>Autoridades sanitarias, tributarias, judiciales o administrativas cuando exista obligación legal.</li>
            <li>Otros profesionales sanitarios cuando sea necesario y exista la correspondiente base jurídica o consentimiento.</li>
            <li>Asesoría contable y fiscal para la gestión económica de la consulta.</li>
            <li>Proveedores tecnológicos que prestan servicios de alojamiento, infraestructura web, base de datos, gestión de reservas o comunicaciones, actuando bajo las condiciones contractuales y de protección de datos que correspondan.</li>
          </ul>
          <p>
            La web utiliza servicios tecnológicos de terceros, entre ellos Cloudflare para infraestructura web y Supabase para funciones de base de datos y reservas. Cuando un proveedor pueda implicar tratamiento de datos fuera del Espacio Económico Europeo, se aplicarán los mecanismos y garantías previstos en el RGPD que resulten exigibles.
          </p>
          <p>
            Google Analytics solo se activa con consentimiento. Su uso puede implicar tratamientos internacionales de datos conforme a los mecanismos y garantías descritos por Google en su documentación de privacidad.
          </p>
        </section>

        <section>
          <h2>6. Derechos del paciente</h2>
          <p>Los pacientes pueden ejercer los siguientes derechos mediante solicitud escrita a contact@carolinasanchezgirona.com:</p>
          <ul>
            <li>Acceso: Saber qué datos tratamos.</li>
            <li>Rectificación: Corregir datos inexactos.</li>
            <li>Supresión: Solicitar la eliminación cuando proceda legalmente.</li>
            <li>Limitación del tratamiento: Restringir el uso de datos en ciertos casos.</li>
            <li>Portabilidad: Solicitar la entrega de datos cuando este derecho resulte aplicable.</li>
            <li>Oposición: Oponerse al tratamiento en los supuestos legalmente previstos.</li>
            <li>Retirada del consentimiento: En cualquier momento, sin afectar la licitud del tratamiento previo.</li>
          </ul>
          <p>Si el usuario considera que sus derechos no han sido respetados, puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) (www.aepd.es).</p>
        </section>

        <section>
          <h2>7. Medidas de seguridad</h2>
          <p>Dememoria aplica medidas técnicas y organizativas orientadas a proteger la confidencialidad, integridad y disponibilidad de la información, ajustadas al tipo de datos tratados y al riesgo asociado.</p>
          <h3>7.1. Seguridad de los datos digitales</h3>
          <ul>
            <li>Acceso restringido a los sistemas y a la información profesional.</li>
            <li>Uso de conexiones cifradas en tránsito mediante HTTPS/TLS en la web y los servicios asociados.</li>
            <li>Contraseñas seguras y mecanismos adicionales de autenticación cuando están disponibles.</li>
            <li>Copias de seguridad y controles de acceso en los sistemas que alojan información profesional.</li>
          </ul>
          <h3>7.2. Seguridad de los datos en papel</h3>
          <ul>
            <li>Almacenamiento en espacios de acceso restringido.</li>
            <li>Destrucción segura de documentación cuando procede.</li>
          </ul>
          <h3>7.3. Comunicación y formularios</h3>
          <ul>
            <li>Los formularios públicos recogen únicamente la información necesaria para la finalidad indicada.</li>
            <li>No se solicita información clínica o de salud en el formulario público de reserva.</li>
            <li>La información especialmente sensible se gestiona por los canales profesionales habilitados para ello.</li>
          </ul>
        </section>

        <section id="cookies">
          <h2>8. Uso de tecnologías y cookies</h2>
          <p>
            La web utiliza almacenamiento local estrictamente necesario para recordar durante seis meses
            si el usuario acepta o rechaza las cookies analíticas. Esta preferencia puede modificarse en
            cualquier momento mediante el botón «Cookies» disponible en la web.
          </p>
          <p>
            Google Analytics solo se carga después de una aceptación expresa. Su finalidad es obtener
            estadísticas agregadas sobre el uso de la web y sus canales de acceso para mejorar sus contenidos
            y funcionamiento. Google puede establecer cookies como <strong>_ga</strong> y
            <strong> _ga_&lt;identificador&gt;</strong> para distinguir sesiones y usuarios.
          </p>
          <ul>
            <li><strong>Proveedor:</strong> Google Ireland Limited.</li>
            <li><strong>Base jurídica:</strong> consentimiento del usuario (art. 6.1.a RGPD).</li>
            <li><strong>Conservación:</strong> según la configuración y los plazos definidos por Google Analytics.</li>
            <li><strong>Revocación:</strong> mediante el botón «Cookies», con la misma facilidad que la aceptación.</li>
          </ul>
          <p>
            Puede consultar información adicional en la
            {" "}<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad de Google</a>.
          </p>
        </section>

        <section>
          <h2>9. Modificaciones de esta política</h2>
          <p>Esta política puede actualizarse según cambios normativos, tecnológicos o mejoras en la gestión de protección de datos. La última versión estará siempre disponible en la consulta y, en su caso, en la web de Dememoria.</p>
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
