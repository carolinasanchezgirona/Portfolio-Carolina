#!/usr/bin/env bash
set -Eeuo pipefail

umask 077

BACKUP_PREFIX="${BACKUP_PREFIX:-dememoria-backup}"
BACKUP_TIMEZONE="${BACKUP_TIMEZONE:-Europe/Madrid}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
BACKUP_SKIP_UPLOAD="${BACKUP_SKIP_UPLOAD:-0}"
REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf 'Falta el comando requerido: %s\n' "$1" >&2
    exit 1
  fi
}

require_variable() {
  local variable_name="$1"
  if [[ -z "${!variable_name:-}" ]]; then
    printf 'Falta la variable requerida: %s\n' "$variable_name" >&2
    exit 1
  fi
}

if [[ ! "$BACKUP_RETENTION_DAYS" =~ ^[1-9][0-9]*$ ]]; then
  printf 'BACKUP_RETENTION_DAYS debe ser un número entero positivo.\n' >&2
  exit 1
fi

require_command base64
require_command find
require_command jq
require_command openssl
require_command sha256sum
require_command tar
require_command zstd
require_variable BACKUP_ENCRYPTION_CERTIFICATE_B64
require_variable BACKUP_ENCRYPTION_CERTIFICATE_SHA256

task_temp_root="${RUNNER_TEMP:-${TMPDIR:-/tmp}}"
work_dir="$(mktemp -d "${task_temp_root%/}/dememoria-clinical-backup.XXXXXX")"
payload_dir="$work_dir/payload"
database_dir="$payload_dir/database"
storage_dir="$payload_dir/storage"
metadata_dir="$payload_dir/metadata"
configuration_dir="$payload_dir/configuration"
output_dir="${BACKUP_OUTPUT_DIR:-$work_dir/output}"

cleanup() {
  if [[ -n "${work_dir:-}" && -d "$work_dir" ]]; then
    rm -rf -- "$work_dir"
  fi
}
trap cleanup EXIT

mkdir -p "$database_dir" "$storage_dir" "$metadata_dir" "$configuration_dir" "$output_dir"

backup_started_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
backup_timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_local_date="$(TZ="$BACKUP_TIMEZONE" date +%Y-%m-%d)"

if [[ -n "${BACKUP_FIXTURE_DIR:-}" ]]; then
  if [[ ! -d "$BACKUP_FIXTURE_DIR" ]]; then
    printf 'No existe el directorio de prueba: %s\n' "$BACKUP_FIXTURE_DIR" >&2
    exit 1
  fi
  cp -a "$BACKUP_FIXTURE_DIR/." "$payload_dir/"
  supabase_project_ref="fixture"
else
  require_command docker
  require_command rclone
  require_command supabase
  require_variable SUPABASE_DB_URL
  require_variable SUPABASE_PROJECT_REF
  require_variable SUPABASE_S3_ACCESS_KEY_ID
  require_variable SUPABASE_S3_SECRET_ACCESS_KEY
  require_variable SUPABASE_S3_ENDPOINT
  require_variable SUPABASE_S3_REGION

  supabase_project_ref="$SUPABASE_PROJECT_REF"

  printf 'Exportando la base de datos mediante el método lógico de Supabase…\n'
  supabase db dump \
    --db-url "$SUPABASE_DB_URL" \
    --file "$database_dir/roles.sql" \
    --role-only
  supabase db dump \
    --db-url "$SUPABASE_DB_URL" \
    --file "$database_dir/schema.sql"
  supabase db dump \
    --db-url "$SUPABASE_DB_URL" \
    --file "$database_dir/data.sql" \
    --data-only \
    --use-copy \
    -x "storage.buckets_vectors" \
    -x "storage.vector_indexes"

  printf 'Creando una copia completa adicional de Postgres…\n'
  docker run --rm \
    --env SUPABASE_DB_URL \
    --volume "$database_dir:/backup" \
    "${POSTGRES_DOCKER_IMAGE:-postgres:17-alpine}" \
    sh -ceu 'pg_dump "$SUPABASE_DB_URL" --format=custom --no-owner --no-privileges --file=/backup/full-database.dump'

  printf 'Descargando los objetos de Supabase Storage…\n'
  bucket_list="$metadata_dir/storage-buckets.txt"
  rclone lsf "${SUPABASE_RCLONE_REMOTE:-supabasesource}:" \
    --dirs-only \
    --format p > "$bucket_list"

  while IFS= read -r bucket_entry; do
    bucket_name="${bucket_entry%/}"
    [[ -z "$bucket_name" ]] && continue
    if [[ "$bucket_name" == "." || "$bucket_name" == ".." || "$bucket_name" == *"/"* ]]; then
      printf 'Nombre de bucket no válido recibido de Supabase: %s\n' "$bucket_name" >&2
      exit 1
    fi
    mkdir -p "$storage_dir/$bucket_name"
    rclone copy \
      "${SUPABASE_RCLONE_REMOTE:-supabasesource}:$bucket_name" \
      "$storage_dir/$bucket_name" \
      --checkers 8 \
      --transfers 4 \
      --retries 3 \
      --low-level-retries 10
  done < "$bucket_list"

  if [[ -d "$REPO_ROOT/supabase/migrations" ]]; then
    cp -a "$REPO_ROOT/supabase/migrations" "$configuration_dir/"
  fi
fi

if command -v git >/dev/null 2>&1 && git -C "$REPO_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git -C "$REPO_ROOT" rev-parse HEAD > "$configuration_dir/git-commit.txt"
fi

database_bytes="$(du -sb "$database_dir" | awk '{print $1}')"
storage_bytes="$(du -sb "$storage_dir" | awk '{print $1}')"
storage_files="$(find "$storage_dir" -type f | wc -l | tr -d '[:space:]')"

jq -n \
  --arg format_version "1" \
  --arg created_utc "$backup_started_utc" \
  --arg local_date "$backup_local_date" \
  --arg timezone "$BACKUP_TIMEZONE" \
  --arg project_ref "$supabase_project_ref" \
  --arg encryption "CMS EnvelopedData with AES-256-GCM and RSA-OAEP" \
  --argjson retention_days "$BACKUP_RETENTION_DAYS" \
  --argjson database_bytes "$database_bytes" \
  --argjson storage_bytes "$storage_bytes" \
  --argjson storage_files "$storage_files" \
  '{
    format_version: $format_version,
    created_utc: $created_utc,
    local_date: $local_date,
    timezone: $timezone,
    supabase_project_ref: $project_ref,
    encryption: $encryption,
    retention_days: $retention_days,
    contents: {
      database_bytes: $database_bytes,
      storage_bytes: $storage_bytes,
      storage_files: $storage_files
    }
  }' > "$metadata_dir/manifest.json"

(
  cd "$payload_dir"
  find . -type f ! -path './metadata/files.sha256' -print0 \
    | LC_ALL=C sort -z \
    | xargs -0 -r sha256sum > metadata/files.sha256
)

certificate_file="$work_dir/backup-encryption-certificate.pem"
printf '%s' "$BACKUP_ENCRYPTION_CERTIFICATE_B64" | base64 --decode > "$certificate_file"

if ! openssl x509 -in "$certificate_file" -noout -checkend 86400 >/dev/null 2>&1; then
  printf 'El certificado público de cifrado no es válido o caduca en menos de 24 horas.\n' >&2
  exit 1
fi

expected_certificate_sha256="$(
  printf '%s' "$BACKUP_ENCRYPTION_CERTIFICATE_SHA256" \
    | tr -d '[:space:]:' \
    | tr '[:lower:]' '[:upper:]'
)"
actual_certificate_sha256="$(
  openssl x509 -in "$certificate_file" -noout -fingerprint -sha256 \
    | sed 's/^[^=]*=//' \
    | tr -d ':' \
    | tr '[:lower:]' '[:upper:]'
)"

if [[ -z "$actual_certificate_sha256" || "$actual_certificate_sha256" != "$expected_certificate_sha256" ]]; then
  printf 'La huella del certificado público de cifrado no coincide.\n' >&2
  exit 1
fi

archive_name="${BACKUP_PREFIX}-${backup_timestamp}.tar.zst.cms"
archive_path="$output_dir/$archive_name"

printf 'Cifrando el paquete de copia…\n'
tar --create --file - --directory "$payload_dir" . \
  | zstd --quiet --threads=0 -10 \
  | openssl cms \
      -encrypt \
      -binary \
      -stream \
      -outform DER \
      -aes-256-gcm \
      -recip "$certificate_file" \
      -keyopt rsa_padding_mode:oaep \
      -out "$archive_path"

(
  cd "$output_dir"
  sha256sum "$archive_name" > "$archive_name.sha256"
)

if [[ ! -s "$archive_path" || ! -s "$archive_path.sha256" ]]; then
  printf 'El archivo cifrado o su suma de comprobación están vacíos.\n' >&2
  exit 1
fi

upload_and_verify() {
  local label="$1"
  local destination_root="$2"
  local destination_month="$destination_root/$(date -u +%Y)/$(date -u +%m)"

  printf 'Subiendo y verificando la copia en %s…\n' "$label"
  rclone copy "$output_dir" "$destination_month" \
    --include "$archive_name" \
    --include "$archive_name.sha256" \
    --immutable \
    --retries 3 \
    --low-level-retries 10
  rclone check "$output_dir" "$destination_month" \
    --include "$archive_name" \
    --include "$archive_name.sha256" \
    --one-way \
    --download

  rclone delete "$destination_root" \
    --min-age "${BACKUP_RETENTION_DAYS}d" \
    --include "**/${BACKUP_PREFIX}-*.tar.zst.cms" \
    --include "**/${BACKUP_PREFIX}-*.tar.zst.cms.sha256" \
    --exclude "*"
  rclone rmdirs "$destination_root" --leave-root >/dev/null 2>&1 || true
}

if [[ "$BACKUP_SKIP_UPLOAD" != "1" ]]; then
  require_command rclone
  require_variable GOOGLE_DRIVE_BACKUP_PATH
  require_variable R2_BACKUP_PATH
  require_variable B2_BACKUP_PATH

  upload_and_verify "Google Drive" "${GOOGLE_DRIVE_RCLONE_REMOTE:-gdrive}:$GOOGLE_DRIVE_BACKUP_PATH"
  upload_and_verify "Cloudflare R2" "${R2_RCLONE_REMOTE:-r2}:$R2_BACKUP_PATH"
  upload_and_verify "Backblaze B2" "${B2_RCLONE_REMOTE:-b2}:$B2_BACKUP_PATH"

  status_file="$work_dir/last-success.json"
  archive_sha256="$(cut -d ' ' -f 1 "$archive_path.sha256")"
  jq -n \
    --arg created_utc "$backup_started_utc" \
    --arg archive "$archive_name" \
    --arg sha256 "$archive_sha256" \
    '{status: "ok", created_utc: $created_utc, archive: $archive, sha256: $sha256}' > "$status_file"

  rclone copyto "$status_file" "${GOOGLE_DRIVE_RCLONE_REMOTE:-gdrive}:$GOOGLE_DRIVE_BACKUP_PATH/status/last-success.json"
  rclone copyto "$status_file" "${R2_RCLONE_REMOTE:-r2}:$R2_BACKUP_PATH/status/last-success.json"
  rclone copyto "$status_file" "${B2_RCLONE_REMOTE:-b2}:$B2_BACKUP_PATH/status/last-success.json"
fi

printf 'Copia clínica cifrada creada y verificada: %s\n' "$archive_name"
