import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { checkPsychologyDigestToken } from '../github-actions-digest-auth.ts';

const endpoint = 'https://carolinasanchezgirona.com/api/automation/psychology-digest';
const madridDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' });
const madridTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Madrid', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit',
});
const groups = [
  ['noticia', 'Noticias internacionales', 'Hoy no hay novedades con fuente primaria verificable.'],
  ['formación', 'Formación online en español e inglés', 'Hoy no hay nuevas convocatorias verificadas.'],
];

function previousDate(day, days) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export function millisecondsUntilDelivery(now) {
  const [hour, minute, second] = madridTime.format(now).split(':').map(Number);
  const secondsUntilNine = (9 - hour) * 3600 - minute * 60 - second;
  return Math.max(0, secondsUntilNine * 1000 - now.getMilliseconds());
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function renderDigest(day, items) {
  const heading = `<b>Psicología y neuropsicología · ${day.split('-').reverse().join('/')}</b>`;
  const sections = groups.map(([kind, title, empty]) => {
    const lines = items.filter(item => item.kind === kind).map(item =>
      `• ${escapeHtml(item.sentence)} <a href="${escapeHtml(item.url)}">${escapeHtml(item.source)}</a>`);
    return [`<b>${title}</b>`, ...(lines.length ? lines : [empty])].join('\n');
  });
  return [heading, ...sections].join('\n\n');
}

async function waitForDeployment() {
  const deadline = Date.now() + 15 * 60_000;
  while (Date.now() < deadline) {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(10_000), redirect: 'error' }).catch(() => null);
    if (response?.status === 405 && response.headers.get('X-Psychology-Digest') === '2') return;
    await setTimeout(25_000);
  }
  throw new Error('El servicio del boletín aún no está desplegado.');
}

async function research(recentUrls) {
  const tokenUrl = new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
  tokenUrl.searchParams.set('audience', endpoint);
  const tokenResponse = await fetch(tokenUrl, {
    headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` },
    signal: AbortSignal.timeout(10_000), redirect: 'error',
  });
  if (!tokenResponse.ok) throw new Error(`GitHub no pudo autorizar la búsqueda (HTTP ${tokenResponse.status}).`);
  const { value } = await tokenResponse.json();
  if (!value) throw new Error('GitHub no emitió la credencial temporal.');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'X-Psychology-Digest-Token': value, 'Content-Type': 'application/json' },
    body: JSON.stringify({ recentUrls }),
    signal: AbortSignal.timeout(320_000), redirect: 'error',
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !Array.isArray(result.items)) {
    const authStage = response.headers.get('X-Digest-Auth-Stage');
    if (authStage) console.log(`Validación de credencial: Worker ${authStage}, GitHub ${await checkPsychologyDigestToken(value)}.`);
    throw new Error(result.error || `El servicio no pudo preparar el boletín (HTTP ${response.status}).`);
  }
  return result.items;
}

async function telegram(token, method, body) {
  // A send timeout can occur after Telegram accepts the message. Avoid an automatic retry.
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(30_000),
    body: JSON.stringify(body),
    redirect: 'error',
  }).catch(() => { throw new Error(`Telegram no respondió a ${method}.`); });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok !== true || !result.result) {
    throw new Error(`Telegram no confirmó ${method} (HTTP ${response.status}).`);
  }
  return result.result;
}

async function main() {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SEND_DIGEST, DIGEST_STATE_PATH, GITHUB_OUTPUT } = process.env;
  const send = SEND_DIGEST === 'true';
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) throw new Error('No están configurados los secretos del bot de Telegram.');

  const day = madridDate.format(new Date());
  const history = await readFile(DIGEST_STATE_PATH, 'utf8').then(JSON.parse).catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return [];
  });
  if (send && history.some(entry => entry.day === day)) {
    console.log('El boletín de hoy ya se envió.');
    return;
  }

  const recent = history.filter(entry => entry.day >= previousDate(day, 14));
  if (process.env.GITHUB_EVENT_NAME === 'push') await waitForDeployment();
  const items = await research(recent.flatMap(entry => entry.urls));
  const message = renderDigest(day, items);
  if (!send) {
    const chat = await telegram(TELEGRAM_BOT_TOKEN, 'getChat', { chat_id: TELEGRAM_CHAT_ID });
    if (!Number.isSafeInteger(chat.id)) throw new Error('Telegram no confirmó el chat habitual.');
    console.log(`Vista previa validada. Ítems verificados: ${items.length}. Chat de Telegram confirmado sin enviar mensaje.`);
    return;
  }

  if (process.env.WAIT_FOR_DELIVERY_TIME === 'true') await setTimeout(millisecondsUntilDelivery(new Date()));
  const result = await telegram(TELEGRAM_BOT_TOKEN, 'sendMessage', {
    chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML', link_preview_options: { is_disabled: true },
  });
  if (!result.message_id) throw new Error('Telegram no confirmó el mensaje.');
  await writeFile(DIGEST_STATE_PATH, JSON.stringify([...recent, { day, urls: items.map(item => item.url) }]));
  await appendFile(GITHUB_OUTPUT, 'sent=true\n');
  console.log('Telegram confirmó el envío del boletín.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(`Boletín: ${error.message}`);
    process.exitCode = 1;
  });
}
