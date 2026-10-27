# Revisión de privacidad de la web · 27/10/2026

## Cambios aplicados

- Identidad coherente de Carolina Sánchez Girona y nombre comercial Dememoria.
- Privacidad por finalidad, asistencia sanitaria, reservas, compras, suscripción, buzón y portal.
- Conservación diferenciada, incluida Ley catalana 21/2000 (art. 12), y ejercicio de derechos.
- Aviso legal, cookies y enlaces permanentes en las pantallas de recogida de datos.
- Analítica restringida a una lista cerrada de páginas generales; exclusión de áreas privadas, formularios, confirmaciones y páginas de temas clínicos. Se omiten query, fragment y referrer, se limita la duración de cookies a 180 días y se desactivan señales publicitarias.
- Consentimiento versionado. Rechazo y aceptación equivalentes; retirada elimina cookies accesibles, bloquea GA y recarga si el SDK ya se había cargado. Sincronización de retirada entre pestañas y tolerancia a almacenamiento bloqueado.
- Formulario propio de suscripción con consentimiento explícito no premarcado, información básica y política enlazada. Sustituye los enlaces públicos al formulario externo con reCAPTCHA.
- Confirmación mediante Brevo DOI; alta no directa, atributos de evidencia del texto/versión/fecha/origen, plantilla específica con privacidad y baja. Solo se añade a la lista exacta existente.
- Edge Function newsletter-subscribe requiere JWT y credencial de servicio, detrás del Worker con validación de origen. La credencial nunca llega al cliente. No se leen contactos existentes.
- Límite persistente de solicitudes mediante HMAC de IP y correo; no se guardan IP ni correo en los contadores. Tabla sin permisos para anon/authenticated y RLS sin políticas de usuario. RPC security invoker exclusiva de service_role. Caducidad y eliminación con pg_cron.

## Validación

- Compilación Next.js y TypeScript.
- Pruebas funcionales de rutas excluidas, consentimiento caducado/manipulado, dominios de cookies, autorización de suscripción, validación, honeypot, límites y solicitud DOI con proveedores simulados; no se envían correos de prueba reales.
- Comprobación SQL: RLS habilitado, acceso anon/authenticated denegado y limitación efectiva. Sin consultas a historias clínicas ni datos de pacientes.
- Los avisos del asesor de Supabase sobre funciones públicas y RLS sin políticas requieren interpretar el modelo de acceso: no se revocan RPC de reserva o publicación por aparecer en un aviso genérico. La nueva tabla deliberadamente carece de políticas de usuario.

## Límites que no deben presentarse como resueltos por cambiar el código

- Verificar documentación contractual realmente aceptada de encargados/subencargados y garantías de transferencias; los enlaces a DPA no prueban su aceptación por la titular.
- Completar datos de autorización sanitaria y país de expedición de títulos cuando se acrediten. No se han inventado números de registro ni universidades.
- Revisar registro de actividades, protocolo de derechos/brechas, análisis de riesgos y necesidad de EIPD conforme a tratamientos reales.
- La ubicación de la base de datos en eu-west-1 (Irlanda), verificada en el proyecto, no garantiza por sí sola que todos los servicios, soporte o subencargados permanezcan en la UE.
- No se cambia la conservación de eventos de la propiedad Google Analytics desde el panel de Google. No confundirla con la caducidad de cookies configurada en el código.
- El formulario original alojado en Brevo no se edita desde este repositorio. Los enlaces de esta web pasan al formulario propio; enlaces directos anteriores distribuidos fuera de la web pueden seguir abriendo el formulario antiguo.
- No se certifica cumplimiento integral ni inexistencia de vulnerabilidades. No se prueba el acceso autenticado a expedientes de pacientes con cuentas reales.
