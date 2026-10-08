import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Política de privacidad | Carolina Sánchez Girona",
  description: "Información sobre el tratamiento de datos personales y de salud en la consulta de Carolina Sánchez Girona.",
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
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
        <a className="legal-back" href="/">Volver a la web</a>
      </header>

      <section className="legal-hero">
        <div className="legal-wrap">
          <p className="legal-eyebrow">Dememòria · Información legal</p>
          <h1>Política de privacidad y protección de datos</h1>
        </div>
      </section>

      <article className="legal-wrap legal-document">
        <section>
          <h2>1. Responsable del tratamiento</h2>
          <div className="legal-data">
            <p><strong>Responsable:</strong> Carolina Sánchez Girona, profesional sanitaria que ejerce a título individual.</p>
            <p><strong>Nombre comercial:</strong> Dememòria</p>
            <p><strong>NIF:</strong> 53067189W</p>
            <p><strong>Consulta:</strong> Carrer Barcelona 8, escalera 1, local 4B, 08350 Arenys de Mar (Barcelona), España.</p>
            <p><strong>Correo de privacidad:</strong> <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a></p>
            <p><strong>Teléfono:</strong> <a href="tel:+34604974857">604 974 857</a></p>
            <p><strong>Registro sanitario:</strong> E08768201</p>
          </div>
          <p>Este correo es el canal para consultas sobre privacidad y para ejercer derechos de protección de datos. La responsabilidad del tratamiento corresponde a la titular, no al nombre comercial de la consulta.</p>
        </section>

        <section>
          <h2>2. Qué datos se recogen y con qué finalidad</h2>
          <h3>2.1. Reserva y gestión de citas</h3>
          <p>En la reserva web se solicitan nombre y apellidos, correo electrónico y teléfono, así como el tipo de servicio, la fecha y el horario seleccionados. En primeras visitas se puede registrar la constancia de lectura de documentos, la aceptación de condiciones y la firma electrónica introducida en el formulario. Es posible conservar la información necesaria para gestionar confirmaciones, cambios, cancelaciones y comunicaciones vinculadas a la cita. El formulario público no solicita el motivo clínico de consulta ni documentos sanitarios.</p>

          <h3>2.2. Atención psicológica y neuropsicológica</h3>
          <p>Cuando existe una relación asistencial, pueden tratarse datos identificativos y de contacto, antecedentes personales y clínicos, información de salud, resultados de pruebas psicológicas y neuropsicológicas, informes, consentimientos informados, notas de seguimiento, planes de intervención y otros datos necesarios para la historia clínica y la continuidad asistencial. La información puede proceder de la persona atendida o de documentación que facilite legítimamente, y, cuando corresponda, de familiares, representantes o profesionales sanitarios.</p>
          <p>Los datos de salud son categorías especiales de datos y están sujetos al deber de secreto profesional y a garantías reforzadas. No se utilizan para publicidad dirigida.</p>

          <h3>2.3. Mi espacio, ejercicios y Wellness</h3>
          <p>El área «Mi espacio» permite, según las funciones habilitadas, acceder a materiales, actividades, ejercicios y herramientas de seguimiento. Para autenticar a la persona usuaria pueden tratarse su correo electrónico, códigos de acceso de un solo uso y datos técnicos de sesión. Las respuestas a ejercicios o herramientas que se guarden y estén asociadas a una persona deben gestionarse conforme a su finalidad, ya sea asistencial o de bienestar.</p>
          <p>La utilización libre de Wellness no implica por sí sola que cada registro pase a formar parte de la historia clínica. Si se solicita un ejercicio como parte de la intervención, se informará de qué información se incorpora al seguimiento clínico. Las funcionalidades específicas, los permisos y la conservación técnica de los registros deben corresponderse con la configuración real del servicio.</p>

          <h3>2.4. Buzón «Tu Consulta»</h3>
          <p>Para gestionar preguntas divulgativas se trata el texto original, la categoría temática, la constancia de las autorizaciones y, cuando se facilita voluntariamente, el correo electrónico para comunicaciones sobre la pregunta. No deben incluirse datos identificativos ni información clínica propia o de terceras personas.</p>
          <p>Si una pregunta contiene información sobre salud, el tratamiento de esa información se basa en el consentimiento explícito específico mostrado en el formulario. La publicación de una versión revisada y anonimizada requiere otra autorización diferenciada. La pregunta original y el correo no están destinados a publicarse. El buzón no presta asistencia sanitaria ni atención de urgencias.</p>

          <h3>2.5. Facturación, documentación administrativa y recursos</h3>
          <p>Se tratan los datos necesarios para elaborar facturas, registrar pagos, cumplir obligaciones contables y fiscales y, si se adquieren recursos digitales, gestionar la transacción y entregar el contenido. No se incluyen datos de salud en una factura salvo que resulten indispensables y exista fundamento legal.</p>

          <h3>2.6. Navegación y analítica</h3>
          <p>Al navegar se pueden tratar datos técnicos necesarios para prestar la web, mantener su seguridad y atender incidencias (por ejemplo, dirección IP y registros técnicos de acceso). Las herramientas analíticas no esenciales se encuentran sujetas a consentimiento previo. Se facilita más información en el <a href="#cookies">apartado de cookies</a>.</p>
        </section>

        <section>
          <h2>3. Bases jurídicas del tratamiento</h2>
          <p>La legitimación depende de la finalidad. El consentimiento informado para una actuación psicológica o neuropsicológica no debe confundirse con la base jurídica para tratar los datos necesarios para prestarla.</p>
          <ul>
            <li><strong>Reservas, relación profesional y servicios contratados:</strong> ejecución de un contrato o actuaciones precontractuales solicitadas por la persona interesada (art. 6.1.b del RGPD).</li>
            <li><strong>Atención sanitaria, evaluación y seguimiento clínico:</strong> ejecución de la relación asistencial y, en lo que corresponda, cumplimiento de obligaciones legales (arts. 6.1.b y 6.1.c del RGPD). Para los datos de salud, concurre la excepción del art. 9.2.h del RGPD, con las garantías de su art. 9.3, en el marco de la asistencia sanitaria y el secreto profesional.</li>
            <li><strong>Historia clínica, custodia, facturación y requerimientos legalmente procedentes:</strong> cumplimiento de obligaciones legales (art. 6.1.c del RGPD), sin perjuicio de otras bases aplicables a situaciones concretas.</li>
            <li><strong>Preguntas divulgativas:</strong> consentimiento de la persona que participa (art. 6.1.a del RGPD); si decide incorporar datos de salud propios, consentimiento explícito adicional (art. 9.2.a del RGPD). La autorización para publicar una versión revisada se recoge por separado.</li>
            <li><strong>Analítica no necesaria:</strong> consentimiento (art. 6.1.a del RGPD), de acuerdo con las normas sobre cookies y tecnologías similares.</li>
            <li><strong>Seguridad de la web:</strong> interés legítimo en proteger sistemas y prevenir abusos, cuando sea aplicable (art. 6.1.f del RGPD), sin perjuicio de obligaciones legales de seguridad (art. 6.1.c).</li>
          </ul>
          <p>Para tratamientos nuevos ajenos a estas finalidades se facilitará información específica y se recabará consentimiento cuando resulte legalmente necesario. La atención sanitaria necesaria no se hace depender de un consentimiento de protección de datos que el RGPD no exige para ese fin.</p>
        </section>

        <section>
          <h2>4. Qué datos son necesarios</h2>
          <p>Los campos identificados como obligatorios en un formulario se necesitan para tramitar la solicitud correspondiente. No facilitarlos puede impedir completar una reserva o acceder a determinadas funciones. El correo del buzón «Tu Consulta» es opcional; el motivo clínico no se solicita en la reserva pública. Los datos clínicos se solicitan solo cuando resultan pertinentes para la atención y se recogen por los canales asistenciales previstos.</p>
        </section>

        <section>
          <h2>5. Conservación</h2>
          <p>Los datos no se conservarán más tiempo del necesario para su finalidad, salvo que exista una obligación de conservación o sea preciso atender responsabilidades legalmente exigibles.</p>
          <ul>
            <li><strong>Historia clínica:</strong> se aplica la Ley catalana 21/2000, de 29 de diciembre, en su redacción vigente. El artículo 12 prevé la conservación mínima durante 15 años desde el alta de cada proceso asistencial para determinados documentos clínicos, incluidos los consentimientos informados y los informes de exploraciones complementarias. El resto de documentación clínica puede destruirse transcurridos cinco años desde el alta del proceso asistencial, cuando proceda, sin perjuicio de la información que deba preservarse durante más tiempo por relevancia clínica, obligaciones legales, motivos judiciales o de otro tipo previstos normativamente.</li>
            <li><strong>Facturación y documentación fiscal:</strong> durante los plazos de conservación y prescripción que exija la normativa aplicable.</li>
            <li><strong>Reservas y comunicaciones administrativas:</strong> durante el tiempo necesario para gestionar las citas, atender incidencias y cumplir las obligaciones y responsabilidades vinculadas a la relación profesional.</li>
            <li><strong>Preguntas divulgativas:</strong> mientras sean necesarias para revisarlas y responder, gestionar las autorizaciones y atender posibles incidencias; después deberán eliminarse o anonimizarse cuando ya no exista una finalidad legítima para conservar datos personales. Los textos efectivamente anonimizados no contienen datos personales en el sentido del RGPD.</li>
            <li><strong>Preferencias de analítica:</strong> la decisión de aceptar o rechazar se guarda en el navegador por un máximo de 180 días, salvo que se cambie antes.</li>
          </ul>
          <p>La solicitud de supresión de una historia clínica no implica su eliminación cuando deba conservarse por una obligación legal.</p>
        </section>

        <section>
          <h2>6. Destinatarios y proveedores tecnológicos</h2>
          <p>Los datos pueden comunicarse a organismos públicos, órganos judiciales y autoridades competentes cuando corresponda legalmente; a profesionales sanitarios cuando la asistencia, la normativa o una autorización válida lo permitan; y a asesores administrativos o fiscales dentro de su cometido.</p>
          <p>Para prestar determinados servicios pueden intervenir proveedores tecnológicos que tratan información por cuenta de la responsable, dentro de su respectivo servicio:</p>
          <ul>
            <li><strong>Cloudflare:</strong> infraestructura y protección de la web.</li>
            <li><strong>Supabase:</strong> servicios tecnológicos y bases de datos utilizados por las funciones web, de reservas y otras áreas habilitadas.</li>
            <li><strong>Brevo:</strong> envío de correos asociados a comunicaciones transaccionales, como las vinculadas a la cita.</li>
            <li><strong>Google Analytics:</strong> medición de uso de la web solo después de aceptar las cookies analíticas.</li>
          </ul>
          <p>Los proveedores de medios de pago y entrega de recursos digitales, cuando se utilicen, pueden tratar los datos imprescindibles para tramitar la operación conforme a sus condiciones y al papel que legalmente les corresponda. El acceso de un prestador a información clínica debe limitarse a lo necesario y requiere garantías contractuales y de seguridad adecuadas.</p>

          <h3>Transferencias internacionales</h3>
          <p>Algunos proveedores tecnológicos pueden implicar accesos o transferencias de datos personales fuera del Espacio Económico Europeo. Cuando exista una transferencia internacional, debe basarse en una decisión de adecuación de la Comisión Europea u otra garantía válida de los artículos 44 y siguientes del RGPD, como las cláusulas contractuales tipo cuando resulten aplicables. Puede solicitar información sobre las garantías relativas al tratamiento de sus datos en el correo de privacidad indicado al inicio.</p>
          {/* ANTES DE PUBLICAR: verificar regiones reales de alojamiento, contratos de encargo del tratamiento (DPA), subencargados y transferencias de Cloudflare, Supabase, Brevo, Google y cualquier proveedor de pagos o portal. Ajustar esta información conforme a ese inventario. */}
        </section>

        <section>
          <h2>7. Derechos de las personas interesadas</h2>
          <p>Puedes solicitar, cuando corresponda, el acceso, la rectificación, la supresión, la oposición, la limitación del tratamiento y la portabilidad de tus datos personales, así como retirar el consentimiento otorgado sin afectar a la licitud de los tratamientos previos. Para ello, escribe a <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a> e indica qué derecho deseas ejercer. Solo se solicitará información adicional de identidad cuando sea necesaria para verificar la solicitud.</p>
          <p>El ejercicio de estos derechos está sujeto a los requisitos y límites legales aplicables, especialmente en materia de documentación clínica, deber de secreto, derechos de terceras personas y conservación obligatoria. También puedes solicitar acceso a tu documentación clínica de acuerdo con la normativa sanitaria.</p>
          <p>Si consideras que se ha vulnerado la normativa de protección de datos, puedes presentar una reclamación ante la <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos (AEPD)</a>.</p>
        </section>

        <section>
          <h2>8. Confidencialidad y medidas de seguridad</h2>
          <p>La responsable debe aplicar medidas técnicas y organizativas apropiadas al riesgo para garantizar la confidencialidad, integridad y disponibilidad de los datos personales, prestando especial atención a la información sanitaria. Esto incluye la restricción de accesos por funciones, la protección de las comunicaciones y la custodia de la documentación clínica, sin perjuicio de las medidas que correspondan a cada sistema y proveedor.</p>
          <p>Las personas con acceso legítimo a información sanitaria están sujetas a deberes de confidencialidad. Por seguridad, no deben enviarse diagnósticos, informes ni otros datos clínicos mediante los formularios públicos de cita o de preguntas divulgativas.</p>
        </section>

        <section>
          <h2>9. Decisiones automatizadas</h2>
          <p>La reserva electrónica puede mostrar horarios disponibles y enviar confirmaciones automáticas. Estas funciones administrativas no equivalen a un diagnóstico ni a una decisión clínica automatizada. Las valoraciones psicológicas y neuropsicológicas deben realizarse bajo responsabilidad profesional. Si en el futuro se implantasen decisiones exclusivamente automatizadas con efectos jurídicos o significativamente similares, se facilitaría la información exigida por la normativa antes de su utilización.</p>
        </section>

        <section id="cookies">
          <h2>10. Información sobre cookies y tecnologías similares</h2>
          <p>Para recordar durante un máximo de 180 días si has aceptado o rechazado la analítica, el navegador almacena una preferencia local. También se pueden utilizar mecanismos técnicos necesarios para acceder a funciones privadas, mantener la sesión y garantizar la seguridad; no se emplean para publicidad comportamental.</p>
          <p>Google Analytics 4 se carga en esta web tras la aceptación de cookies analíticas. Su finalidad es conocer las visitas y el uso general de los contenidos. Puede emplear cookies como <strong>_ga</strong> y <strong>_ga_&lt;identificador&gt;</strong>; su duración y características dependen de la configuración del servicio. El proveedor es Google Ireland Limited y su <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">información de privacidad</a> puede consultarse en su web.</p>
          <p>Puedes aceptar o rechazar la analítica y cambiar tu elección utilizando el control «Cookies» de la web. Rechazar las cookies analíticas no impide la navegación normal. Los detalles técnicos y las cookies efectivamente instaladas deben coincidir con la configuración real del sitio.</p>
        </section>

        <section>
          <h2>11. Cambios en esta política</h2>
          <p>Esta política puede actualizarse para reflejar cambios legales, funcionales o de proveedores. Se publicará en esta página la versión aplicable y la información necesaria sobre cambios relevantes.</p>
          <p><strong>Revisión del texto:</strong> octubre de 2026.</p>
        </section>
      </article>

      <footer className="legal-footer">
        <div className="legal-wrap">
          <a href="/aviso-legal/">Aviso legal</a>
          {" · "}
          <a href="#cookies">Información sobre cookies</a>
          <p>© 2026 Carolina Sánchez Girona · Dememòria</p>
        </div>
      </footer>
    </main>
  );
}
