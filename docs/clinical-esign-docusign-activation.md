# Firma electrónica clínica sin papel · Docusign (integración en revisión)

**Estado:** preparada en rama de desarrollo, **NO activada ni autorizada para pacientes**. No usar hasta completar la lista de verificación.

## Operación prevista
1. Desde la ficha clínica, preparar el consentimiento informado y explicar al paciente finalidad, riesgos, alternativas, límites y dudas.
2. Elegir Psicología, Evaluación neuropsicológica o Intervención neuropsicológica. Verificar datos del paciente, mayoría de edad y que firma por sí mismo.
3. Pulsar **Enviar solicitud de firma verificada** y confirmar el correo guardado. Nunca se envía con la reserva ni con recordatorios.
4. El servidor crea el PDF personalizado, lo conserva en Storage privado y guarda su SHA-256 y su versión.
5. Docusign valida el flujo IDV contratado (documento oficial de identidad, según configuración), crea un sobre borrador, se registra en Supabase y se envía sin duplicarlo.
6. Docusign Connect notifica la finalización usando HMAC. El servidor consulta el estado remoto (no basta el evento recibido), descarga el PDF firmado y el Certificate of Completion, comprueba ambos y los guarda en el mismo expediente. Solo entonces muestra **Firmado y archivado**. Se puede forzar una sincronización manual si el webhook no llegó.
7. La política RGPD se entrega informativamente; no pedir una falsa autorización universal para la asistencia sanitaria.

## Antes de activar, obligatorio
- [ ] Validar con asesoría RGPD y jurídica el contrato de encargado de tratamiento con Docusign: subencargados, ubicación, transferencias internacionales, retención, exportación y eliminación de documentos, control de acceso, disponibilidad y continuidad. Evaluar si procede EIPD por tratamiento de datos de salud.
- [ ] Comprobar producto y tarifa que incluyen **eSignature REST API**, **Docusign ID Verification**, **Docusign Connect** y certificado de finalización; no asumir que la simple firma de un plan de consumo equivale a una firma electrónica avanzada eIDAS.
- [ ] Crear cuenta de desarrollo (sandbox), Integration Key, clave RSA PKCS#8, usuario de servicio (OAuth JWT) y autorizar los ámbitos `signature impersonation`.
- [ ] Obtener Account ID y workflow IDV desde `GET /restapi/v2.1/accounts/{accountId}/identity_verification`; probar que coincide con el verificador contratado. El código bloquea envíos sin esa comprobación.
- [ ] Configurar webhook Docusign Connect JSON SIM para `envelope-completed`, `envelope-declined`, `envelope-voided` a `https://carolinasanchezgirona.com/api/docusign/connect` y habilitar la clave HMAC correspondiente.
- [ ] Aplicar la migración `supabase/migrations/20261109220000_clinical_signature_requests.sql`, verificar RLS y acceso solo mediante service_role; comprobar que `clinical-documents` sigue privado.
- [ ] Guardar **solo como secretos de Cloudflare**, nunca variables públicas ni archivos versionados:
  - `DOCUSIGN_INTEGRATION_KEY`
  - `DOCUSIGN_IMPERSONATED_USER_ID`
  - `DOCUSIGN_RSA_PRIVATE_KEY` (PEM PKCS#8)
  - `DOCUSIGN_ACCOUNT_ID`
  - `DOCUSIGN_IDV_WORKFLOW_ID`
  - `DOCUSIGN_CONNECT_HMAC_KEY`
  - `DOCUSIGN_ENVIRONMENT` (valor `demo` en pruebas; `production` en producción)
  - `DOCUSIGN_DPA_APPROVED=yes` **solo** tras la aprobación legal
  - `DOCUSIGN_PRODUCTION_APPROVED=yes` **solo** al validar la puesta en producción
- [ ] Probar con pacientes e identidades ficticias: rechazo sin sesión y MFA, cambios de destinatario, IDV no configurado, envío duplicado, redes inestables, rechazo y anulación, múltiples llamadas del webhook, hash SHA-256 y lectura del PDF/certificado únicamente en admin.
- [ ] Confirmar que el proveedor garantiza el tipo de firma contratado (simple, avanzada o cualificada); **no etiquetar la firma como avanzada o cualificada solo por disponer de IDV**.
- [ ] Revisar acceso de menores y personas representadas, contenido y versión del documento, tiempo y forma de conservación, derecho de retirada y límites del consentimiento clínico conforme Ley 41/2002 y normativa catalana.

## Límites actuales
- El envío automático de la solicitud de firma **no está activado** hasta contratar, conectar y verificar el prestador.
- Los casos con representante deben tramitarse individualmente; el flujo en desarrollo no permite representar a un adulto ni a un menor.
- La tabla actual `clinical_patient_consents` permite registrar estados manuales: eso no equivale a la evidencia de una firma. La evidencia auténtica se verifica con `clinical_signature_requests.status='archived'` y el PDF y certificado custodiados.
- Una impresión digital dibujada, un clic o un correo enviado no sustituyen por sí solos la evidencia documental ni acreditan un tipo concreto de firma eIDAS.

## Referencias oficiales
- https://developers.docusign.com/docs/esign-rest-api/how-to/id-verification/
- https://developers.docusign.com/docs/esign-rest-api/how-to/download-envelope-documents/
- https://developers.docusign.com/platform/webhooks/connect/hmac
- https://www.aepd.es/preguntas-frecuentes/16-salud/2-profesionales-sanitarios/FAQ-1635-es-necesario-que-el-medico-o-el-centro-sanitario-solicite-el-consentimiento-a-los-pacientes-para-tratar-sus-datos-personales
