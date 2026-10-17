# Entre Sesiones · control de calidad y publicación

Actualizado: 17 de octubre de 2026.

## Aplicado y sometido a pruebas de regresión
- App web instalable con navegación dentro de su ámbito, pestañas, botón Atrás y protección de acceso.
- Wellness: 21 herramientas y 7 actividades táctiles; progreso local separado por cuenta.
- Inicio: selección informativa de hasta dos materiales clínicos asignados, con prioridad para borradores y fecha de revisión.
- Preparación voluntaria de la siguiente sesión: notas efímeras y transferencia consciente a un formulario clínico ya asignado. El guardado y el compartir siguen siendo acciones explícitas distintas.
- Ficha profesional: programación de fechas de revisión en asignaciones existentes; indicador descriptivo de respuestas expresamente compartidas, sin mostrar borradores.
- Accesibilidad local: tamaño de lectura normal/grande/muy grande, lectura despejada y reducción voluntaria de movimiento.
- Borrado de datos locales de Wellness y registro de ánimo, sin tocar el expediente ni las preferencias de avatar guardadas en servidor.
- Endurecimiento del cierre de sesión: retirada del DOM de información clínica y estado de Wellness, protección ante restauración desde historial del navegador y aviso si falla la revocación en servidor.
- Fallos de base de datos: se devuelve error temporal, no un falso resultado de «sin ejercicios».
- Conectividad: aviso sin conexión y confirmación del cierre de sesión antes de informar de éxito.

## Límites clínicos y de privacidad
- Los registros de bienestar, favoritos y preferencias de lectura permanecen en el dispositivo. No se sincronizan ni se envían automáticamente.
- Las respuestas clínicas en borrador se almacenan por el mecanismo existente del portal; la profesional solo debe mostrar como compartidos los registros con el estado `shared`.
- Una fecha de revisión es un dato establecido por la profesional, no una garantía de nueva cita ni una exigencia de completar la tarea.
- Ningún tablero o gráfico de Wellness realiza diagnóstico, pronóstico o interpretación automática.

## Verificaciones pendientes antes de una apertura amplia
1. Probar con una cuenta de **paciente ficticio autenticado**: iniciar sesión, asignar un ejercicio ficticio, establecer fecha de revisión, guardar un borrador, compartir voluntariamente y cerrar sesión.
2. Revisar visualmente en Android físico y iOS, con lector de pantalla y fuentes ampliadas; las pruebas de navegador simulado no son equivalentes.
3. Auditoría de seguridad independiente: caducidad de sesiones, CSRF en rutas de escritura, reglas RLS por paciente, accesos de administrador, copia y restauración de información clínica, registros y control de errores.
4. Revisión RGPD / LOPDGDD: registro de actividades de tratamiento, información al interesado, base jurídica, contratos con encargados, plazo de conservación, ejercicio de derechos y necesidad de evaluación de impacto.
5. Planificar sincronización **voluntaria** entre dispositivos solo tras acordar modelo de consentimiento, cifrado, conservación, borrado y pruebas de aislamiento; por ahora no está habilitada.
6. Recordatorios o notificaciones de pacientes: mantener deshabilitados hasta disponer de permiso granular, mensajes neutros, posibilidad de revocación y gestión de errores.
7. No habilitar análisis automatizado de respuestas clínicas sin revisión de riesgos, garantías y supervisión profesional.

## Pruebas automáticas
- `tests/entre-sesiones-spa-mobile.py`
- `tests/wellness-mobile-browser.py`
- `tests/session-prep-mobile.py`
- `tests/entre-sesiones-hardening.test.mjs`
- `tests/entre-sesiones-app-integration.test.mjs`
- `tests/wellness-interactive.test.mjs`
- `tests/session-prep.test.mjs`

Regla de publicación: compilación, test de acceso no autenticado, pruebas de integración y comprobación de despliegue deben terminar en verde antes de comunicar la versión como publicada.
