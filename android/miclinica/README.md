# Mi clínica · Android

Aplicación Android privada de Carolina Sánchez Girona. Paquete: `com.carolinasanchezgirona.miclinica`.
Requiere Android 10 o posterior y conexión. Abre el área profesional actual en un WebView propio, sin pestaña de Chrome.
No incorpora cuentas ni datos de pacientes al APK.

## Compilación
Java 17, Gradle 8.13, Android SDK 35, Build Tools 35.0.0.
`gradle :app:testReleaseUnitTest :app:lintRelease :app:assembleRelease`

La firma usa exclusivamente las variables MICLINICA_KEYSTORE y MICLINICA_STORE_PASSWORD.
La clave privada no pertenece al repositorio. Conservar la misma clave para futuras actualizaciones.

## Funciones nativas
Navegación interna en el origen HTTPS de la consulta; enlaces externos en aplicaciones del sistema.
Selector de documentos sin permisos generales de almacenamiento.
Descargas HTTPS autenticadas con cookies y exportaciones Blob en Descargas.
Impresión del documento actual mediante Android.
Pantalla de reintento ante fallo de red.

## Límites de esta versión
La aplicación usa el servicio web existente: no permite trabajar sin conexión.
La sesión del navegador no se transfiere: iniciar sesión en la aplicación.
No añade notificaciones push nativas ni reconocimiento de voz nativo.
La videollamada se abre en la aplicación externa correspondiente.
La compilación, firma y pruebas unitarias no sustituyen una prueba en un dispositivo con la sesión privada.

## Seguridad de integración
Sin navegación HTTP interna ni orígenes comodín en el canal de documentos.
El canal recibe mensajes solo del marco principal y del origen HTTPS exacto de la consulta.
Sin interfaz JavaScript genérica, acceso local de WebView ni depuración de producción.
Sin copia de seguridad de los datos de la aplicación.

## Entrega 1.0.0 verificada
APK: [descarga desde la web](https://carolinasanchezgirona.com/downloads/mi-clinica-1.0.0.apk).
Abrir el archivo en Android 10 o posterior, permitir la instalación desde el navegador si el sistema lo solicita y pulsar Instalar.
Se inicia sesión dentro de Mi clínica. La aplicación requiere conexión.

SHA-256 del APK: `09a09e36af7652adafdd0d2f2f822971717a52b921da0069735c9bbec882bebf`.
Certificado SHA-256: `772fb88a1da081328f1994b4cb3cbc2de7f4d08a107cf5b43427b8c61e623c3b`.
Verificación: compilación release, cuatro pruebas de navegación, lint, firma APK v2, identidad del paquete y permiso exclusivo INTERNET.
El icono adaptativo y los iconos web comparten el diseño renovado en ciruela, turquesa y petróleo.
Las barras del sistema usan texto oscuro sobre fondo claro para mantener el contraste en Android 10–16.
