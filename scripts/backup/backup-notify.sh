#!/usr/bin/env bash
set -Eeuo pipefail

mode="${1:-success}"
BACKUP_TIMEZONE="${BACKUP_TIMEZONE:-Europe/Madrid}"
GOOGLE_DRIVE_WARN_FREE_PERCENT="${GOOGLE_DRIVE_WARN_FREE_PERCENT:-20}"
GOOGLE_DRIVE_CRITICAL_FREE_PERCENT="${GOOGLE_DRIVE_CRITICAL_FREE_PERCENT:-10}"
R2_SOFT_LIMIT_GB="${R2_SOFT_LIMIT_GB:-0}"
B2_SOFT_LIMIT_GB="${B2_SOFT_LIMIT_GB:-0}"

send_telegram() {
  local text="$1"
  if [[ -z "${TELEGRAM_BOT_TOKEN:-}" || -z "${TELEGRAM_CHAT_ID:-}" ]]; then
    echo "Telegram no configurado; se omite el aviso."
    return 0
  fi

  curl --fail --silent --show-error \
    --request POST \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${text}" \
    --data-urlencode "disable_web_page_preview=true" \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" >/dev/null
}

local_now="$(TZ="$BACKUP_TIMEZONE" date '+%Y-%m-%d %H:%M %Z')"
local_day="$(TZ="$BACKUP_TIMEZONE" date '+%d')"

if [[ "$mode" == "failure" ]]; then
  message="❌ Dememoria · Ha fallado la copia clínica diaria (${local_now}). Revisa GitHub Actions."
  if [[ -n "${RUN_URL:-}" ]]; then
    message+="\n${RUN_URL}"
  fi
  send_telegram "$message"
  exit 0
fi

if [[ "$mode" != "success" ]]; then
  echo "Modo no válido: $mode" >&2
  exit 2
fi

message="✅ Dememoria · Copia clínica cifrada completada y verificada en los tres destinos (${local_now})."

# Google Drive sí dispone de una cuota real; rclone devuelve total, usado y libre.
if drive_json="$(rclone about "${GOOGLE_DRIVE_RCLONE_REMOTE:-gdrive}:" --json 2>/dev/null)"; then
  total="$(jq -r '.total // 0' <<<"$drive_json")"
  free="$(jq -r '.free // 0' <<<"$drive_json")"
  if [[ "$total" =~ ^[0-9]+$ && "$free" =~ ^[0-9]+$ && "$total" -gt 0 ]]; then
    free_percent=$(( free * 100 / total ))
    free_gb="$(awk -v b="$free" 'BEGIN {printf "%.1f", b/1024/1024/1024}')"
    message+="\nGoogle Drive: ${free_percent}% libre (${free_gb} GB)."
    if (( free_percent <= GOOGLE_DRIVE_CRITICAL_FREE_PERCENT )); then
      message+="\n🚨 Espacio crítico en Google Drive."
    elif (( free_percent <= GOOGLE_DRIVE_WARN_FREE_PERCENT )); then
      message+="\n⚠️ Google Drive se acerca al límite."
    fi
  fi
fi

check_soft_limit() {
  local label="$1"
  local remote="$2"
  local path="$3"
  local soft_limit_gb="$4"

  [[ -z "$path" ]] && return 0
  [[ ! "$soft_limit_gb" =~ ^[0-9]+([.][0-9]+)?$ ]] && return 0
  awk -v n="$soft_limit_gb" 'BEGIN {exit !(n > 0)}' || return 0

  local size_json bytes used_gb percent
  if ! size_json="$(rclone size "$remote:$path" --json 2>/dev/null)"; then
    return 0
  fi
  bytes="$(jq -r '.bytes // 0' <<<"$size_json")"
  [[ "$bytes" =~ ^[0-9]+$ ]] || return 0
  used_gb="$(awk -v b="$bytes" 'BEGIN {printf "%.2f", b/1024/1024/1024}')"
  percent="$(awk -v used="$used_gb" -v cap="$soft_limit_gb" 'BEGIN {printf "%d", (used/cap)*100}')"
  message+="\n${label}: ${used_gb} GB de límite operativo ${soft_limit_gb} GB (${percent}%)."
  if (( percent >= 90 )); then
    message+="\n🚨 ${label} ha alcanzado el 90% del límite operativo configurado."
  elif (( percent >= 80 )); then
    message+="\n⚠️ ${label} ha alcanzado el 80% del límite operativo configurado."
  fi
}

check_soft_limit "Cloudflare R2" "${R2_RCLONE_REMOTE:-r2}" "${R2_BACKUP_PATH:-}" "$R2_SOFT_LIMIT_GB"
check_soft_limit "Backblaze B2" "${B2_RCLONE_REMOTE:-b2}" "${B2_BACKUP_PATH:-}" "$B2_SOFT_LIMIT_GB"

if [[ "$local_day" == "01" ]]; then
  if [[ -n "${GOOGLE_DRIVE_MONTHLY_BACKUP_PATH:-}" && -n "${R2_MONTHLY_BACKUP_PATH:-}" && -n "${B2_MONTHLY_BACKUP_PATH:-}" ]]; then
    message+="\n📦 La copia mensual ha quedado archivada con conservación prolongada. Conviene descargar una copia mensual y conservarla fuera de línea."
  else
    message+="\n📦 Recordatorio mensual: descarga una copia cifrada y consérvala fuera de línea."
  fi
fi

send_telegram "$message"
