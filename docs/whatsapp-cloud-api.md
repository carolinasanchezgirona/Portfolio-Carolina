# Activación de WhatsApp para reservas

El Worker puede responder con el enlace de reservas cuando recibe exactamente el mensaje administrativo que rellenan los botones de WhatsApp de la web. El webhook verifica la firma de Meta. La aplicación descarta los demás mensajes y no guarda textos ni teléfonos. Conserva solo huellas de identificadores de mensaje para evitar duplicados y limitar envíos.

## Primera prueba

1. Abre la aplicación de WhatsApp en Meta for Developers y localiza el número de prueba, su ID y la versión de Graph API que indica **API Setup**. Añade tu móvil como destinatario de prueba en Meta.
2. En **Workers & Pages → portfolio-carolina → Settings → Variables and Secrets**, introduce `WHATSAPP_APP_SECRET` (el App Secret de Meta), `WHATSAPP_ACCESS_TOKEN` (token de la API) y `WHATSAPP_VERIFY_TOKEN` (valor aleatorio de 32 bytes que eliges para verificar el webhook) como secretos. Añade las variables `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_GRAPH_VERSION`, `WHATSAPP_TEST_RECIPIENT` (tu número con prefijo y sin `+`) y `WHATSAPP_MODE=test`.
3. En Meta configura la URL `https://carolinasanchezgirona.com/api/whatsapp/webhook`, usa el valor de `WHATSAPP_VERIFY_TOKEN` y suscribe el campo `messages` de la cuenta de WhatsApp Business correspondiente.
4. Desde tu móvil, envía al número de prueba el texto «Hola, quisiera información administrativa sobre una primera visita.». Comprueba que recibes el enlace de reservas una vez.

## Activación con el número profesional

Comprueba en Meta si el número de los botones de la web está disponible para la API y, si ya se usa en la app WhatsApp Business, si es elegible para coexistencia antes de registrarlo. Configura el identificador de ese número, un token de usuario del sistema autorizado para enviar mensajes y la suscripción de esa cuenta al webhook. Repite la prueba con tu número autorizado antes de cambiar `WHATSAPP_MODE` a `live`. Para parar las respuestas, elimina `WHATSAPP_MODE`.

El límite del Worker es de 900 intentos por número en 32 días. Cuenta también intentos fallidos para evitar cargos por reintentos de resultado incierto. Meta calcula el tramo gratuito sobre mensajes de servicio entregados por todos los servicios que usen ese número y según su propio período de facturación. Comprueba el consumo total en Meta si el número también lo utiliza otra integración. Los avisos de agenda por WhatsApp y las plantillas de pago quedan fuera de esta integración.
