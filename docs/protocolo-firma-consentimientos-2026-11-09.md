# Protocolo de firma electrónica y archivo digital de consentimientos clínicos

Estado: preparación técnica. No existe por ahora integración de firma con tercero activada ni proveedor contratado por esta implementación.

## Procedimiento asistencial
1. Explicar personalmente finalidad, naturaleza, riesgos, límites, alternativas y derecho de retirada; el correo no sustituye la información clínica.
2. Seleccionar el consentimiento específico: atención psicológica, evaluación neuropsicológica o intervención neuropsicológica.
3. Verificar capacidad para decidir y, si corresponde, representación acreditada del firmante. La firma de un familiar no equivale automáticamente al consentimiento.
4. En la ficha clínica generar el PDF individualizado bajo acceso profesional con MFA. Revisarlo y guardar la versión original sin firmar.
5. Enviar manualmente el PDF mediante un prestador de firma contratado, con verificación de identidad adecuada (p. ej., segundo factor por SMS).
6. Recibir PDF firmado y certificado probatorio completo, revisar correspondencia de identidad, alcance, fecha y versión.
7. Archivar ambos archivos por separado en la categoría Consentimiento de la ficha clínica y sin compartirlos automáticamente en Mi espacio.
8. Solo después de la comprobación actualizar el estado clínico pertinente. El envío nunca equivale a consentimiento firmado.

## Criterios de contratación
- Verificar que la modalidad de firma cumpla el nivel anunciado de eIDAS, artículo 26 si se contrata firma avanzada. La simple firma manuscrita dibujada no garantiza este nivel.
- Firmar acuerdo de encargado de tratamiento (art. 28 RGPD) y comprobar residencia, subencargados, seguridad y transferencias internacionales.
- Exigir documento probatorio con sellado temporal, datos de autenticación, integridad documental y opción de exportación a largo plazo.
- Confirmar expresamente si la API está incluida en el plan: la tabla de precios de Signaturit sitúa API en Enterprise.
- Actualizar la política de privacidad respecto al proveedor antes de transmitir datos reales de pacientes.

## Conservación
La Ley catalana 21/2000, artículo 12.4 vigente, obliga a conservar las hojas de consentimiento informado al menos 15 años desde el alta del proceso asistencial, sin perjuicio de extensiones legales. Mantener PDF firmado y prueba probatoria protegidos, con backups y restauración verificada. El archivo de historia clínica requiere autenticidad, integridad, confidencialidad y reproducibilidad.

## Limitaciones vigentes
- El PDF generado por el admin es un original para firmar y se entrega bajo MFA. Tiene versión y código SHA-256, pero NO es un documento firmado.
- La firma se realiza fuera de la web, manualmente, en el proveedor seleccionado. No hay API, webhooks, certificado validado automáticamente ni confirmación de la identidad electrónica integrados.
- El admin permite cargar documentos al bucket privado ya existente. El registro del consentimiento debe actualizarse solo tras la revisión de los originales y de la prueba.
- El aviso RGPD y el consentimiento clínico son distintos. El tratamiento sanitario ordinario no requiere necesariamente consentimiento RGPD (AEPD FAQ-1635).

## Referencias
- Reglamento (UE) 910/2014 arts. 25 y 26; Ley 41/2002 arts. 4 y 8; Ley 21/2000 Cataluña arts. 6, 9 y 12.4; AEPD FAQ-1635.