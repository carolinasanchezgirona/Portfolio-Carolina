import type { Metadata } from "next";
import LegalDocument from "../components/legal-document";

export const metadata: Metadata = {
  title: "Política de privacidad | Carolina Sánchez Girona",
  description: "Información sobre el tratamiento de datos de visitantes, suscriptores y pacientes.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <LegalDocument title="Política de privacidad y protección de datos">
    <nav aria-label="Contenido de la política"><a href="#responsable">Responsable</a> · <a href="#tratamientos">Tratamientos</a> · <a href="#conservacion">Conservación</a> · <a href="#proveedores">Proveedores</a> · <a href="#derechos">Tus derechos</a> · <a href="/cookies/">Cookies</a></nav>
    <section id="responsable">
      <h2>1. Responsable del tratamiento</h2>
      <div className="legal-data">
        <p><strong>Responsable:</strong> Carolina Sánchez Girona, que ejerce bajo el nombre comercial Dememoria.</p>
        <p><strong>NIF:</strong> 53067189W.</p>
        <p><strong>Domicilio profesional:</strong> Carrer Barcelona 8, Local, 08350 Arenys de Mar, Barcelona, España.</p>
        <p><strong>Contacto y derechos:</strong> <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a>.</p>
        <p><strong>Teléfono:</strong> <a href="tel:+34604974857">604 974 857</a>.</p>
        <p><strong>Profesional:</strong> Psicóloga General Sanitaria y neuropsicóloga. Colegiada COPC núm. 24892.</p>
      </div>
      <p>Esta información se dirige a visitantes, personas que solicitan cita, pacientes, compradores de recursos y suscriptores. Dememoria es el nombre de la consulta; no identifica a un responsable distinto.</p>
    </section>
    <section id="tratamientos">
      <h2>2. Qué datos se tratan y para qué</h2>
      <div className="legal-table-wrap"><table><caption>Finalidades y bases jurídicas por tratamiento</caption><thead><tr><th scope="col">Tratamiento y datos</th><th scope="col">Finalidad y base jurídica</th></tr></thead><tbody>
        <tr><td>Solicitudes de cita: nombre, correo, teléfono, servicio y horario.</td><td>Gestionar la solicitud, confirmar la reserva y enviar avisos relativos a ella: art. 6.1.b RGPD. No se solicita el motivo de consulta, diagnósticos ni informes en el formulario público. Si la información permite inferir una atención sanitaria, se aplica también la habilitación del art. 9.2.h RGPD y el deber de secreto.</td></tr>
        <tr><td>Asistencia sanitaria e historia clínica: identificación, antecedentes pertinentes, datos de salud, evaluaciones, intervenciones y evolución.</td><td>Prestar asistencia psicológica o neuropsicológica y cumplir los deberes de documentación sanitaria: arts. 6.1.b y 6.1.c, junto con el art. 9.2.h RGPD y la normativa sanitaria aplicable.</td></tr>
        <tr><td>Mi espacio: correo de acceso, credenciales protegidas, sesión y materiales o respuestas que decidas guardar o compartir.</td><td>Facilitar el acceso al servicio y al trabajo terapéutico: art. 6.1.b RGPD; art. 9.2.h cuando forme parte de la asistencia sanitaria. Las notas clínicas internas no se muestran en el portal.</td></tr>
        <tr><td>Facturación y compras de recursos: identificación fiscal cuando corresponda, correo, compra, importe y referencia de pago.</td><td>Gestionar la compra y entregar el recurso: art. 6.1.b. Cumplir obligaciones fiscales y contables: art. 6.1.c RGPD. El pago con tarjeta se tramita a través de Stripe; la consulta no recibe el número completo de tu tarjeta.</td></tr>
        <tr><td>Consultas generales por correo: dirección de contacto y contenido del mensaje.</td><td>Responder a tu solicitud: art. 6.1.b cuando se refiera a servicios solicitados; en otras consultas generales, interés legítimo en atender comunicaciones, art. 6.1.f. Puedes oponerte cuando proceda. Evita enviar información clínica por canales generales.</td></tr>
        <tr><td>Buzón «Tu Consulta»: tema, pregunta, declaraciones de consentimiento y correo opcional.</td><td>Revisar la pregunta y preparar una respuesta divulgativa: consentimiento, art. 6.1.a. Si incluyes datos de salud, consentimiento explícito del art. 9.2.a. La posible publicación requiere una autorización separada y una revisión que evite la identificación.</td></tr>
        <tr><td>Suscripción voluntaria: correo y evidencias de la solicitud y del consentimiento.</td><td>Enviar recursos, contenidos, novedades y comunicaciones comerciales de los servicios de Carolina Sánchez Girona: consentimiento, art. 6.1.a RGPD y art. 21 LSSI. Se requiere confirmar el correo antes del alta en la lista. No se incorporan pacientes a esta lista por el hecho de pedir cita o recibir tratamiento.</td></tr>
        <tr><td>Analítica de las páginas públicas habilitadas: identificadores de cookies y datos técnicos de navegación.</td><td>Medir el uso general de la web mediante Google Analytics solo con consentimiento, art. 6.1.a RGPD y art. 22.2 LSSI. La analítica se excluye del área clínica, del acceso de pacientes y de los formularios. Más información en la <a href="/cookies/">política de cookies</a>.</td></tr>
        <tr><td>Seguridad: datos técnicos necesarios, como dirección IP y registros de acceso; huellas criptográficas para limitar abusos de formularios.</td><td>Prevenir abuso y proteger la confidencialidad y disponibilidad del servicio: interés legítimo, art. 6.1.f, y obligaciones de seguridad, arts. 6.1.c y 32 RGPD. No se utilizan para publicidad.</td></tr>
      </tbody></table></div>
      <p>Los campos obligatorios se identifican en cada formulario. Sin los datos necesarios no se puede tramitar la petición correspondiente; los datos opcionales no condicionan la asistencia. Puedes descargar los materiales gratuitos sin suscribirte.</p>
      <p>El consentimiento informado clínico es distinto del consentimiento de protección de datos. La asistencia sanitaria amparada por la ley no depende de aceptar publicidad, cookies analíticas o publicaciones divulgativas.</p>
    </section>
    <section id="conservacion">
      <h2>3. Conservación y supresión</h2>
      <ul>
        <li><strong>Citas y comunicaciones administrativas:</strong> durante la gestión de la solicitud y, si existe relación asistencial, mientras sea necesario para esa relación. Después, únicamente durante los plazos de responsabilidad aplicables, con acceso restringido o bloqueo cuando proceda. Las solicitudes que no den lugar a atención se revisan para eliminar lo que haya dejado de ser necesario.</li>
        <li><strong>Historia clínica en Cataluña:</strong> al menos 15 años desde el alta de cada proceso asistencial para los documentos del art. 12.4 de la Ley 21/2000, incluidas hojas de consentimiento informado, informes de alta y de exploraciones complementarias. El resto de documentación puede expurgarse transcurridos 5 años desde el alta, salvo que su relevancia asistencial, judicial u otra obligación justifique conservarla más tiempo. Estos plazos no implican una destrucción automática.</li>
        <li><strong>Facturación:</strong> durante los plazos fiscales y contables exigibles; con carácter general, 4 años en materia tributaria y 6 años cuando resulte aplicable el deber mercantil de conservación, sin perjuicio de interrupciones, comprobaciones o responsabilidades pendientes.</li>
        <li><strong>Suscripción:</strong> mientras no retires el consentimiento o solicites la baja. Tras la baja, los datos necesarios para acreditar el consentimiento o atender responsabilidades se mantienen restringidos durante los plazos legales aplicables; puede conservarse una referencia mínima de exclusión para evitar nuevos envíos. Los envíos de confirmación no autorizan por sí solos comunicaciones comerciales.</li>
        <li><strong>Tu Consulta:</strong> durante la revisión, respuesta y eventual gestión de la publicación. Las preguntas descartadas y los correos se eliminan cuando dejan de ser necesarios, salvo conservación justificada para acreditar consentimientos o atender responsabilidades. El contenido efectivamente anonimizado puede conservarse como divulgación.</li>
        <li><strong>Datos locales de Wellness:</strong> permanecen en el navegador hasta que los borres mediante los controles de Mi espacio o del dispositivo. Están separados por cuenta, lo que no equivale a cifrado ni protege frente a una persona con acceso al mismo perfil de navegador.</li>
        <li><strong>Cookies y preferencias:</strong> los plazos concretos se describen en la <a href="/cookies/">política de cookies</a>. Los contadores de protección del formulario de suscripción caducan al terminar su ventana de limitación, como máximo en una hora.</li>
      </ul>
      <p>La retirada del consentimiento o una petición de supresión no elimina la documentación que deba conservarse por obligación legal. En esos casos se limita su uso a los fines que justifican conservarla.</p>
    </section>
    <section id="proveedores">
      <h2>4. Destinatarios y proveedores</h2>
      <p>Pueden acceder a datos los proveedores necesarios para el servicio, la asesoría fiscal y contable, otros profesionales sanitarios cuando exista habilitación suficiente y las autoridades cuando lo exija la ley. No se venden datos de pacientes ni listas de suscriptores.</p>
      <ul>
        <li><strong>Cloudflare:</strong> alojamiento, distribución de la web y seguridad. Opera con infraestructura internacional. <a href="https://www.cloudflare.com/cloudflare-customer-dpa/" target="_blank" rel="noopener noreferrer">Condiciones de tratamiento y transferencias</a>.</li>
        <li><strong>Supabase:</strong> base de datos, autenticación y archivos. El proyecto de la consulta tiene su base de datos en la región eu-west-1, Irlanda. La entidad proveedora y sus subencargados pueden implicar accesos internacionales. <a href="https://supabase.com/legal/dpa" target="_blank" rel="noopener noreferrer">Acuerdo de tratamiento</a>.</li>
        <li><strong>Brevo:</strong> comunicaciones de servicio y gestión de la suscripción voluntaria y su confirmación. <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">Información de privacidad y subencargados</a>.</li>
        <li><strong>Stripe:</strong> tramitación de pagos cuando compras recursos digitales. <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer">Privacidad de Stripe</a>.</li>
        <li><strong>Google Ireland Limited:</strong> analítica opcional de páginas públicas habilitadas. Solo se activa con consentimiento. <a href="https://business.safety.google/adsprocessorterms/" target="_blank" rel="noopener noreferrer">Condiciones de tratamiento de Google</a>.</li>
        <li><strong>OpenAI:</strong> apoyo tecnológico a la elaboración de materiales y a tareas profesionales cuando se utilizan estas funciones. Se debe limitar la información a la necesaria y excluir identificadores directos. La seudonimización no convierte por sí sola los datos en anónimos. <a href="https://openai.com/policies/data-processing-addendum/" target="_blank" rel="noopener noreferrer">Condiciones de tratamiento</a>.</li>
        <li><strong>Daily:</strong> conexión de videoconsulta cuando se habilita este servicio. <a href="https://www.daily.co/legal/privacy/" target="_blank" rel="noopener noreferrer">Privacidad del proveedor</a>.</li>
      </ul>
      <h3>Transferencias fuera del Espacio Económico Europeo</h3>
      <p>La infraestructura global, determinados subencargados y el acceso de soporte de estos proveedores pueden implicar tratamiento en Estados Unidos u otros países, aunque la base de datos principal esté en Irlanda. El mecanismo debe corresponder al proveedor y servicio contratados: una decisión de adecuación vigente cuando cubra al destinatario o las cláusulas contractuales tipo de la Comisión Europea, con la evaluación y medidas adicionales que correspondan. Los enlaces anteriores permiten consultar los instrumentos ofrecidos por cada proveedor; no significan que todos los servicios utilicen el mismo mecanismo.</p>
      <p>Puedes solicitar a <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a> información sobre los destinatarios concretos y una copia de las garantías aplicables, con las limitaciones necesarias para proteger información confidencial.</p>
    </section>
    <section id="derechos">
      <h2>5. Tus derechos</h2>
      <p>Puedes solicitar acceso, rectificación, supresión, limitación, portabilidad cuando corresponda y oposición, o retirar un consentimiento, escribiendo a <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a>. Indica el derecho y los datos necesarios para localizar tu solicitud. Solo se pedirá información adicional de identificación cuando exista una duda razonable sobre tu identidad.</p>
      <p>Se responderá, con carácter general, en un mes. Si la complejidad o el número de solicitudes justifica ampliar el plazo hasta dos meses más, se te informará dentro del primer mes. La retirada del consentimiento no afecta a la licitud del tratamiento anterior ni a la asistencia que no dependa de ese consentimiento.</p>
      <p>Puedes reclamar ante la <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a>. El acceso y la supresión de documentación clínica están sujetos a los límites legales, incluidos los derechos de terceros y las obligaciones de conservación.</p>
    </section>
    <section id="seguridad">
      <h2>6. Seguridad, portal y decisiones profesionales</h2>
      <p>El acceso a documentación personal requiere identificación y autorización. Las comunicaciones utilizan HTTPS. No compartas tus credenciales; utiliza un dispositivo de confianza y cierra sesión al terminar. En un dispositivo compartido, borra los registros locales de Wellness cuando corresponda.</p>
      <p>Guardar un borrador terapéutico y compartirlo con la profesional son acciones diferentes. Las herramientas libres de Wellness no se incorporan automáticamente a la historia clínica. Consulta en Mi espacio qué información se guarda en el dispositivo y cuál decides compartir.</p>
      <p>No se adoptan decisiones diagnósticas o terapéuticas basadas únicamente en procesos automatizados con efectos jurídicos o similares. Las propuestas tecnológicas requieren revisión profesional. Un uso para investigación o una publicación identificable necesitan su propia habilitación e información; no se autorizan por utilizar esta web.</p>
    </section>
    <section id="cookies"><h2>7. Cookies y cambios de esta información</h2><p>Consulta la <a href="/cookies/">política de cookies y almacenamiento local</a> y utiliza el botón «Cookies» para modificar la analítica. Esta política se revisa cuando cambian los tratamientos; la fecha de actualización figura al inicio.</p></section>
  </LegalDocument>;
}
