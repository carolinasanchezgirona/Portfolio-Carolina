# SEO y captación

Panel privado /admin/seo/ y API GET /api/admin/seo, protegida por la verificación del propietario y el gate profesional existente. No consulta registros clínicos. Auditoría manual de hasta 50 páginas públicas y hasta 20 históricos en el navegador. No se han instalado nuevos rastreadores ni cron jobs.

## Activación de Search Console
1. En Google Cloud Console habilitar Search Console API y crear una cuenta de servicio dedicada, sin roles de proyecto innecesarios.
2. En Search Console, añadir el correo de dicha cuenta como usuario restringido de la propiedad carolinasanchezgirona.com (comprobar acceso de lectura).
3. Guardar el JSON de la cuenta de servicio como secreto de Cloudflare Workers GSC_SERVICE_ACCOUNT_JSON, nunca en GitHub ni en el cliente. Opcional GSC_SITE_URL=https://carolinasanchezgirona.com/ para propiedad de prefijo; por defecto sc-domain:carolinasanchezgirona.com. Rotar o revocar la clave si fuera necesario.
4. Abrir el panel, iniciar sesión y pulsar Actualizar Google. Consulta web de solo lectura, 28 días finales contra los 28 anteriores; consultas y páginas top 100, no todas las filas.

Pendiente: comprobación real con credenciales, inspección de URLs en Google, automatización técnica centralizada, integración con GBP/GA4, atribución de reservas y seguimiento de competencia. Las posiciones medias no son rankings locales.