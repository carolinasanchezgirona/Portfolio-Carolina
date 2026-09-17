# Copias clínicas cifradas

El sistema crea cada día un único paquete cifrado y lo replica en tres proveedores independientes:

1. Google Drive, utilizando el espacio de Google One.
2. Cloudflare R2.
3. Backblaze B2.

El flujo queda desactivado hasta que todas las credenciales estén guardadas como secretos y la variable `CLINICAL_BACKUP_ENABLED` tenga el valor `true`. Nunca se sube una copia sin cifrar ni se guardan copias clínicas como artefactos de GitHub Actions.

## Contenido de cada copia

- Exportación lógica de roles, esquema y datos mediante Supabase CLI.
- Exportación completa adicional de Postgres en formato `custom` para recuperación especializada, incluidos los esquemas gestionados.
- Todos los objetos de todos los buckets de Supabase Storage.
- Migraciones SQL y commit de Git asociado a la copia.
- Manifiesto y sumas SHA-256 internas.

Las contraseñas, claves API y tokens OAuth no se incluyen: deben regenerarse o conservarse separadamente en un gestor de contraseñas.

## Horario y conservación

- Ejecución diaria: 03:17, zona `Europe/Madrid`.
- Conservación diaria: 30 días en cada destino.
- Conservación mensual: 400 días en cada destino configurado.
- La doble expresión cron compensa automáticamente CET/CEST; solo continúa la ejecución cuyo horario local sea las 03:00.
- Cada subida se vuelve a leer y se compara con el archivo cifrado local antes de considerarse correcta.

## Credenciales necesarias

### Supabase

- `CLINICAL_BACKUP_SUPABASE_DB_URL`: cadena del *Session pooler* con contraseña codificada para URL.
- `CLINICAL_BACKUP_SUPABASE_S3_ACCESS_KEY_ID`.
- `CLINICAL_BACKUP_SUPABASE_S3_SECRET_ACCESS_KEY`.
- Variable `CLINICAL_BACKUP_SUPABASE_S3_REGION`.

El protocolo S3 se habilita en **Storage → Configuration → S3**. Las claves se muestran una sola vez.

### Cifrado con certificado público

- `CLINICAL_BACKUP_ENCRYPTION_CERTIFICATE_B64`: certificado X.509 público dedicado, en Base64.
- `CLINICAL_BACKUP_ENCRYPTION_CERTIFICATE_SHA256`: huella SHA-256 completa del certificado.

El paquete se cifra con AES-256-GCM y la clave de contenido se protege mediante RSA-OAEP. La clave privada no debe introducirse en GitHub, Supabase, Drive, R2 ni B2. Se conserva fuera de línea, protegida por contraseña y con una segunda copia física sellada. Perderla impide recuperar todas las copias.

### Google Drive

- `CLINICAL_BACKUP_GOOGLE_DRIVE_CLIENT_ID`: Client ID del cliente OAuth propio de tipo aplicación de escritorio.
- `CLINICAL_BACKUP_GOOGLE_DRIVE_CLIENT_SECRET`: Client Secret del mismo cliente OAuth.
- `CLINICAL_BACKUP_GOOGLE_DRIVE_TOKEN`: token OAuth generado por rclone con ese mismo cliente.
- Variable `CLINICAL_BACKUP_GOOGLE_DRIVE_PATH`: ruta de copias diarias.
- Variable `CLINICAL_BACKUP_GOOGLE_DRIVE_MONTHLY_PATH`: ruta de copias mensuales.

El cliente OAuth debe tener Google Drive API habilitada y rclone se autoriza con alcance `drive`. El Client ID, Client Secret y token deben pertenecer a la misma configuración OAuth. No se necesita la contraseña de Google.

### Cloudflare R2

- Bucket privado, preferentemente con jurisdicción europea.
- `CLINICAL_BACKUP_R2_ACCESS_KEY_ID`.
- `CLINICAL_BACKUP_R2_SECRET_ACCESS_KEY`.
- `CLINICAL_BACKUP_R2_ENDPOINT`.
- Variable `CLINICAL_BACKUP_R2_PATH`.
- Variable `CLINICAL_BACKUP_R2_MONTHLY_PATH`.

El token debe limitarse al bucket de copias y a lectura/escritura de objetos.

### Backblaze B2

- Bucket privado creado en la región europea.
- `CLINICAL_BACKUP_B2_KEY_ID`.
- `CLINICAL_BACKUP_B2_APPLICATION_KEY`.
- Variable `CLINICAL_BACKUP_B2_PATH`.
- Variable `CLINICAL_BACKUP_B2_MONTHLY_PATH`.

La *application key* debe limitarse al bucket. La eliminación permanente se usa únicamente para los archivos con prefijo `dememoria-backup-` que superen la retención configurada.

### Avisos

Telegram utiliza:

- `CLINICAL_BACKUP_TELEGRAM_BOT_TOKEN`.
- `CLINICAL_BACKUP_TELEGRAM_CHAT_ID`.

El aviso de éxito comprueba además el espacio de los destinos configurados. Google Drive usa por defecto avisos al 20 % y 10 % de espacio libre; estos valores pueden ajustarse con `CLINICAL_BACKUP_GOOGLE_DRIVE_WARN_FREE_PERCENT` y `CLINICAL_BACKUP_GOOGLE_DRIVE_CRITICAL_FREE_PERCENT`. R2 y B2 admiten límites operativos configurables mediante `CLINICAL_BACKUP_R2_SOFT_LIMIT_GB` y `CLINICAL_BACKUP_B2_SOFT_LIMIT_GB`.

Opcionalmente, el aviso de error por Brevo utiliza:

- `CLINICAL_BACKUP_BREVO_API_KEY`.
- `CLINICAL_BACKUP_ALERT_EMAIL`.
- `CLINICAL_BACKUP_SENDER_EMAIL`.

Los avisos no contienen información clínica.

## Activación

1. Crear los dos buckets privados y aceptar los acuerdos de tratamiento aplicables.
2. Generar el certificado y su clave privada; guardar la clave privada fuera de línea.
3. Añadir los secretos y variables anteriores en **GitHub → Settings → Secrets and variables → Actions**.
4. Ejecutar manualmente `Copia clínica cifrada` y comprobar los tres destinos.
5. Descargar una copia, verificarla y realizar una restauración de prueba.
6. Solo después, establecer `CLINICAL_BACKUP_ENABLED=true`.

## Recuperación

La suma externa se comprueba antes de descifrar:

```bash
sha256sum --check dememoria-backup-AAAAMMDDTHHMMSSZ.tar.zst.cms.sha256
```

Con la clave privada disponible:

```bash
openssl cms -decrypt -binary -inform DER \
  -in dememoria-backup-AAAAMMDDTHHMMSSZ.tar.zst.cms \
  -recip certificado-publico.pem \
  -inkey clave-privada.pem \
  -keyopt rsa_padding_mode:oaep \
  | zstd --decompress --stdout \
  | tar --extract
```

El directorio recuperado contiene la base de datos, los objetos de Storage, las migraciones y el manifiesto. La restauración sobre producción nunca debe iniciarse sin verificar antes la copia en un entorno aislado.
