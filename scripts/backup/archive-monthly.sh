#!/usr/bin/env bash
set -Eeuo pipefail

BACKUP_TIMEZONE="${BACKUP_TIMEZONE:-Europe/Madrid}"
MONTHLY_RETENTION_DAYS="${MONTHLY_RETENTION_DAYS:-400}"
BACKUP_PREFIX="${BACKUP_PREFIX:-dememoria-backup}"

local_day="$(TZ="$BACKUP_TIMEZONE" date '+%d')"
if [[ "$local_day" != "01" ]]; then
  echo "No es el primer día del mes; no se crea copia mensual."
  exit 0
fi

year="$(TZ="$BACKUP_TIMEZONE" date '+%Y')"
month="$(TZ="$BACKUP_TIMEZONE" date '+%m')"

archive_monthly() {
  local label="$1"
  local remote="$2"
  local daily_root="$3"
  local monthly_root="$4"

  if [[ -z "$daily_root" || -z "$monthly_root" ]]; then
    echo "Ruta mensual no configurada para $label; se omite."
    return 0
  fi

  local source="$remote:$daily_root/$year/$month"
  local destination="$remote:$monthly_root/$year"

  echo "Archivando copia mensual en $label…"
  rclone copy "$source" "$destination" \
    --max-age 2d \
    --include "${BACKUP_PREFIX}-*.tar.zst.cms" \
    --include "${BACKUP_PREFIX}-*.tar.zst.cms.sha256" \
    --immutable \
    --retries 3 \
    --low-level-retries 10

  rclone delete "$remote:$monthly_root" \
    --min-age "${MONTHLY_RETENTION_DAYS}d" \
    --include "**/${BACKUP_PREFIX}-*.tar.zst.cms" \
    --include "**/${BACKUP_PREFIX}-*.tar.zst.cms.sha256" \
    --exclude "*"
  rclone rmdirs "$remote:$monthly_root" --leave-root >/dev/null 2>&1 || true
}

archive_monthly "Google Drive" "${GOOGLE_DRIVE_RCLONE_REMOTE:-gdrive}" "${GOOGLE_DRIVE_BACKUP_PATH:-}" "${GOOGLE_DRIVE_MONTHLY_BACKUP_PATH:-}"
archive_monthly "Cloudflare R2" "${R2_RCLONE_REMOTE:-r2}" "${R2_BACKUP_PATH:-}" "${R2_MONTHLY_BACKUP_PATH:-}"
archive_monthly "Backblaze B2" "${B2_RCLONE_REMOTE:-b2}" "${B2_BACKUP_PATH:-}" "${B2_MONTHLY_BACKUP_PATH:-}"
