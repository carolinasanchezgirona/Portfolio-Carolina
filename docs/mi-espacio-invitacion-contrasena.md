# Mi espacio: invitación, identificación y apertura de área privada

Estado: especificación de implementación. No desplegar hasta completar la autenticación y pruebas.

## Flujo obligatorio
1. Desde Gestión Clínica, la profesional envía a un paciente concreto una invitación personal por correo. La dirección debe estar confirmada por la profesional. No se permiten accesos a partir de una dirección suministrada públicamente sin cuenta vinculada.
2. La invitación expira y es de un solo uso. Al abrirla, se verifica la titularidad del correo y se solicita establecer una contraseña si es su primer acceso. El enlace no concede acceso a datos clínicos.
3. La persona debe identificarse con correo electrónico y contraseña. Solo tras validación del servidor se crea una sesión privada; se abre la ruta /mi-espacio/area/ en una pestaña nueva y no desde el simple envío del correo.
4. En la pantalla de entrada aparece «¿Has olvidado tu contraseña?» con restablecimiento mediante correo. No revelar si la dirección está registrada.
5. Al volver a entrar, correo y contraseña. Si el correo no está verificado, la contraseña es incorrecta o la cuenta está desactivada, no se muestran contenidos privados.
6. El acceso a Wellness público no debe dar apariencia de acceso clínico y debe presentarse por separado.

## Implementación y seguridad
- Preferir Supabase Auth para contraseñas, restablecimiento e invitación; NO almacenar contraseñas ni crear hash propios en tablas clínicas. Establecer vinculación explícita auth.users.id -> clinical_patients.id, única y sin inferencia por nombre.
- Autenticar solicitudes de materiales, citas y respuestas por la identidad validada y la vinculación activa. Aplicar autorización en servidor, nunca confiar en patient_id recibido del navegador.
- Sesiones en cookies Secure, HttpOnly y SameSite=Lax/Strict; invalidar al cerrar sesión o revocar invitación y permitir revocación por profesional.
- Rate limiting por IP y cuenta, prevención de enumeración, registros sin datos clínicos, no indexar rutas privadas y evitar cache de respuestas.
- No redireccionar automáticamente al área clínica tras leer la URL del correo: el enlace es exclusivamente de verificación/alta.
- La nueva pestaña se abrirá al pulsar «Entrar» tras validar las credenciales. Considerar bloqueadores de ventanas emergentes y ofrecer el botón «Abrir Mi espacio» como alternativa accesible.
- La invitación y la recuperación de contraseña deben distinguirse; expiración y un solo uso.
- No fusionar ni publicar hasta prueba integral con cuenta ficticia, sesión inválida, contraseña incorrecta, enlace repetido o caducado, recuperación, acceso cruzado entre pacientes y comprobación de dispositivos.
- No habilitar en la interfaz el antiguo acceso por códigos como alternativa para entrar sin contraseña.

## Estado existente
La rama feature/mi-espacio-enlace-seguro implementó un acceso sin contraseña mediante enlace de un solo uso. Esa implementación se conserva como punto de partida de esta rama, pero debe reemplazarse antes de desplegar y NO satisface esta especificación.
