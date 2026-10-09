# Videoconsulta: estado y activación

Revisión: 9 de octubre de 2026. Esta revisión técnica y contractual no equivale a una certificación general de cumplimiento.

## Implantado

- Google Meet se abre fuera del portal, mediante un enlace por cita. No se envían historiales, ejercicios ni identificadores clínicos a Google desde la integración.
- Los enlaces se guardan en una tabla sin permisos para `anon` ni `authenticated`. Solo el servidor puede leerlos.
- Gestión Clínica requiere la cuenta profesional autorizada. La consulta del paciente parte de su sesión segura, nunca de un identificador proporcionado por el navegador.
- Solo se ofrece el acceso de la próxima cita confirmada, no cancelada, de su propia ficha activa. El enlace no se entrega antes de los 15 minutos previos ni después del final previsto.
- Los enlaces se guardan como borrador por defecto. Un mismo enlace no puede estar asignado simultáneamente a dos citas.
- Se vuelve a comprobar la autorización al pulsar el botón. No se incluye información clínica en títulos, nombres de sala o parámetros.
- Retirar un enlace impide obtenerlo desde el portal, pero no invalida las copias ni cierra la sala en Google. El control de admisión y el cierre de la reunión corresponden a la anfitriona.
- Google Analytics queda excluido de `/admin`, `/mi-espacio` y `/entre-sesiones`, aunque exista consentimiento previo para la web pública. Los accesos públicos a estas áreas usan navegación completa.

## Condición pendiente de la cuenta

La cuenta actual es Gmail gratuita. No se ha acreditado un acuerdo de encargo de tratamiento aplicable a esa cuenta. El consentimiento de la paciente no sustituye el contrato que corresponda con el proveedor. No se da por autorizado el uso clínico por el hecho de que una prueba técnica funcione.

Google distingue los servicios de consumo de Workspace. Sus condiciones de Workspace Personal incluyen un DPA para usos profesionales, y Workspace dispone de un Cloud Data Processing Addendum. Debe conservarse evidencia de las condiciones que se apliquen a la cuenta contratada y de su aceptación.

### Vía sin cuota de Workspace: Essentials Starter

Google publica una edición gratuita Essentials Starter que incluye Meet. Requiere un correo existente de un dominio propio; no admite Gmail ni Yahoo. No incluye un servicio Gmail para alojar ese correo. El dominio de la web no crea por sí solo un buzón.

1. Usar un correo operativo del dominio profesional para el alta en Essentials Starter. Mantener el proveedor actual del correo y evitar cambios de DNS que interrumpan su recepción.
2. Comprobar que la edición contratada es **Essentials Starter sin coste**, no una prueba temporal de otra edición.
3. Comprobar las condiciones incorporadas y el CDPA en la consola de administración, aceptándolo si corresponde y conservando la evidencia.
4. Activar la verificación en dos pasos. Usar reuniones creadas por esa cuenta; crear nuevos enlaces para las citas, en lugar de reutilizar el enlace de prueba de Gmail.
5. Revisar subencargados, transferencias y medidas del proveedor para incorporarlos al registro de actividades y a la información de privacidad. Workspace no implica por sí solo almacenamiento exclusivamente europeo.
6. Realizar una prueba de acceso con una cuenta de prueba, incluida la admisión de una participante externa.
7. Informar a la paciente del proveedor, finalidad y condiciones de acceso antes de publicar el enlace. Mantener grabación, transcripción y toma de notas por IA sin activar; su eventual uso requiere una evaluación separada.

La edición gratuita documenta reuniones de hasta 24 horas y 100 participantes. Las reuniones mediante enlaces usan cifrado en la nube/en tránsito, no cifrado de extremo a extremo por defecto. No confundirlo con las llamadas personales de Meet que ofrecen cifrado adicional.

### Alternativa con Gmail: Workspace Individual

Google documenta un acuerdo de tratamiento para Workspace Individual usado profesionalmente. Es una suscripción distinta de Gmail gratuito: verificar precio, edición, condiciones y evidencia contractual antes de contratar. No se ha contratado ninguna suscripción ni aceptado términos en nombre de la profesional.

## Operativa de cada cita

Crear una reunión distinta sin nombres ni datos de salud en el título. En Gestión Clínica, abrir la ficha, elegir la cita y guardar el enlace. Mantenerlo como borrador hasta cerrar los requisitos de la cuenta. Después, publicar el acceso de esa cita. Admitir solo a la persona esperada y terminar la reunión para todas las participantes al finalizar. Ante cancelación o error de destinatario, retirar el enlace y no reutilizarlo.

## Información propuesta para la paciente

«La sesión online se realizará mediante Google Meet y se abrirá en otra pestaña. El enlace de tu cita aparecerá en Mi espacio poco antes de la hora prevista. Utiliza un lugar privado y, si es posible, auriculares. La sesión se realiza sin grabación, transcripción ni toma automática de notas. No compartas el enlace con otras personas. Si hay un problema técnico, contacta con la consulta por el canal habitual.»

Este texto complementa la política de privacidad; no sustituye la información sobre responsable, bases jurídicas, proveedor, transferencias, conservación y derechos.

## Fuentes oficiales verificadas

- https://support.google.com/policies/answer/9581826
- https://workspace.google.com/terms/workspace-personal-terms/
- https://support.google.com/google-workspace-individual/answer/10757067
- https://workspace.google.com/essentials/
- https://knowledge.workspace.google.com/admin/getting-started/editions/set-up-essentials-for-your-domain
- https://knowledge.workspace.google.com/admin/getting-started/editions/choose-your-google-workspace-edition
- https://knowledge.workspace.google.com/admin/compliance/privacy-compliance-and-records-for-google-workspace-and-cloud-identity
- https://cloud.google.com/terms/data-processing-addendum/
- https://support.google.com/a/users/answer/7681288?hl=es
- https://support.google.com/meet/answer/12387251
