#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
test_root="$(mktemp -d "${TMPDIR:-/tmp}/dememoria-backup-test.XXXXXX")"

cleanup() {
  if [[ -n "${test_root:-}" && -d "$test_root" ]]; then
    rm -rf -- "$test_root"
  fi
}
trap cleanup EXIT

mkdir -p "$test_root/fixture/database" "$test_root/fixture/storage/test-bucket" "$test_root/output" "$test_root/restored"

printf 'create table example(id bigint primary key);\n' > "$test_root/fixture/database/schema.sql"
printf 'clinical-backup-fixture\n' > "$test_root/fixture/storage/test-bucket/example.txt"

openssl req \
  -x509 \
  -newkey rsa:2048 \
  -nodes \
  -keyout "$test_root/private-key.pem" \
  -out "$test_root/certificate.pem" \
  -days 2 \
  -subj '/CN=Dememoria Backup Test' >/dev/null 2>&1

certificate_sha256="$(
  openssl x509 -in "$test_root/certificate.pem" -noout -fingerprint -sha256 \
    | sed 's/^[^=]*=//' \
    | tr -d ':'
)"
certificate_b64="$(base64 -w 0 "$test_root/certificate.pem")"

BACKUP_FIXTURE_DIR="$test_root/fixture" \
BACKUP_OUTPUT_DIR="$test_root/output" \
BACKUP_SKIP_UPLOAD=1 \
BACKUP_ENCRYPTION_CERTIFICATE_B64="$certificate_b64" \
BACKUP_ENCRYPTION_CERTIFICATE_SHA256="$certificate_sha256" \
REPO_ROOT="$repo_root" \
  "$repo_root/scripts/backup/clinical-backup.sh"

archive_path="$(find "$test_root/output" -maxdepth 1 -type f -name '*.tar.zst.cms' -print -quit)"
if [[ -z "$archive_path" ]]; then
  printf 'No se creó el archivo cifrado de prueba.\n' >&2
  exit 1
fi

(
  cd "$test_root/output"
  sha256sum --check "$(basename "$archive_path").sha256"
)

openssl cms \
  -decrypt \
  -binary \
  -inform DER \
  -in "$archive_path" \
  -recip "$test_root/certificate.pem" \
  -inkey "$test_root/private-key.pem" \
  -keyopt rsa_padding_mode:oaep \
  | zstd --quiet --decompress --stdout \
  | tar --extract --directory "$test_root/restored"

cmp "$test_root/fixture/storage/test-bucket/example.txt" "$test_root/restored/storage/test-bucket/example.txt"
test -s "$test_root/restored/metadata/manifest.json"
test -s "$test_root/restored/metadata/files.sha256"

(
  cd "$test_root/restored"
  sha256sum --check metadata/files.sha256 >/dev/null
)

if strings "$archive_path" | grep -Fq 'clinical-backup-fixture'; then
  printf 'El archivo cifrado contiene texto clínico legible.\n' >&2
  exit 1
fi

printf 'Prueba de copia, cifrado, integridad y recuperación completada.\n'
