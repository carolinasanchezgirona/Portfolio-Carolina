#!/usr/bin/env python3
"""Radar editorial gratuito para Telegram: fuentes públicas, sin API de pago."""
import argparse
import hashlib
import html
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from zoneinfo import ZoneInfo

MADRID = ZoneInfo("Europe/Madrid")
NEWS_BASE = "https://news.google.com/rss/search"
TRENDS_RSS = "https://trends.google.com/trending/rss?geo=ES"
STATE_DEFAULT = "/tmp/trend-radar-telegram.json"
MAX_MESSAGE = 3900

# Propuestas editoriales estables. El radar NO afirma que cada propuesta sea
# un descubrimiento; muestra titulares recientes que justifican el interés.
THEMES = [
    {
        "name": "Memoria y Alzheimer",
        "query": '"Alzheimer" OR "demencia" OR "deterioro cognitivo"',
        "terms": ("alzheimer", "demencia", "memoria", "deterioro cognitivo"),
        "title": "¿Estamos entendiendo bien los primeros signos de deterioro cognitivo?",
        "hook": "No todo olvido es una demencia. ¿Qué señales justifican una valoración?",
        "angle": "Diferenciar envejecimiento, DCL y trastorno neurocognitivo; evitar autodiagnósticos.",
        "format": "Carrusel + artículo SEO",
        "caution": "Un titular sobre biomarcadores no equivale a una prueba diagnóstica disponible.",
        "priority": 4,
    },
    {
        "name": "TDAH en adultos",
        "query": '"TDAH" OR "ADHD" OR "diagnóstico TDAH"',
        "terms": ("tdah", "déficit de atención", "deficit de atencion", "adhd"),
        "title": "TDAH en adultos: qué explica una evaluación clínica completa",
        "hook": "Reconocerte en un vídeo no confirma un TDAH. ¿Qué debe evaluarse?",
        "angle": "Historia evolutiva, diagnóstico diferencial y valoración funcional.",
        "format": "Reel + artículo SEO",
        "caution": "Evitar equiparar cribados online con diagnóstico.",
        "priority": 4,
    },
    {
        "name": "Cerebro, sueño y atención",
        "query": '"sueño" "memoria" OR "cerebro" "atención" OR "insomnio" "cerebro"',
        "terms": ("sueno", "dormir", "insomnio", "cerebro", "atencion"),
        "title": "Sueño y memoria: qué sabemos y qué se exagera",
        "hook": "Dormir mal afecta a la atención, pero ¿qué ocurre realmente en el cerebro?",
        "angle": "Atención, codificación mnésica y diferencias entre correlación y causalidad.",
        "format": "Carrusel + artículo SEO",
        "caution": "No extrapolar hallazgos de laboratorio a diagnósticos individuales.",
        "priority": 3,
    },
    {
        "name": "Ansiedad y estrés",
        "query": '"ansiedad" OR "estrés" OR "burnout"',
        "terms": ("ansiedad", "estres", "burnout", "agotamiento", "salud mental"),
        "title": "Ansiedad o sobrecarga: cuándo hablamos de un problema clínico",
        "hook": "Sentirse desbordado no siempre significa tener un trastorno de ansiedad.",
        "angle": "Delimitar síntomas, deterioro funcional y factores contextuales.",
        "format": "Reel + carrusel",
        "caution": "No medicalizar reacciones habituales al estrés.",
        "priority": 2,
    },
    {
        "name": "Psicología y redes sociales",
        "query": '"TikTok" "salud mental" OR "autodiagnóstico" OR "psicología en redes"',
        "terms": ("tiktok", "instagram", "redes sociales", "autodiagnostico", "viral"),
        "title": "Autodiagnóstico en redes: por qué un vídeo puede convencernos",
        "hook": "¿Por qué tantos síntomas de TikTok parecen describirnos?",
        "angle": "Sesgos de confirmación, prevalencia, falsos positivos y validez clínica.",
        "format": "Reel + carrusel",
        "caution": "No atribuir causalidad ni prevalencia a impresiones en redes.",
        "priority": 4,
    },
    {
        "name": "Depresión y psicoterapia",
        "query": '"depresión" "psicoterapia" OR "terapia psicológica" "depresión"',
        "terms": ("depresion", "psicoterapia", "terapia psicologica", "tratamiento"),
        "title": "Psicoterapia y depresión: qué tratamientos tienen evidencia",
        "hook": "Que una terapia suene convincente no significa que tenga evidencia.",
        "angle": "Diferenciar eficacia, efectividad y elección individual del tratamiento.",
        "format": "Artículo SEO + carrusel",
        "caution": "Las novedades no sustituyen guías clínicas ni evaluación individual.",
        "priority": 3,
    },
    {
        "name": "Envejecimiento y cognición",
        "query": '"envejecimiento cognitivo" OR "memoria mayores" OR "longevidad cerebral"',
        "terms": ("envejecimiento", "mayores", "cognicion", "memoria", "longevidad"),
        "title": "Envejecer no es perder la memoria: qué cambios son esperables",
        "hook": "¿Qué cambia con la edad y qué merece una consulta de memoria?",
        "angle": "Reserva cognitiva, cambios normativos y signos de alarma.",
        "format": "Carrusel educativo",
        "caution": "No prometer prevención o reversión de demencias.",
        "priority": 3,
    },
    {
        "name": "Autismo en adultos",
        "query": '"autismo" "adultos" OR "diagnóstico autismo"',
        "terms": ("autismo", "autista", "tea adultos", "espectro autista"),
        "title": "Autismo en la edad adulta: claves para una evaluación rigurosa",
        "hook": "Identificarse con un rasgo no equivale a cumplir criterios de TEA.",
        "angle": "Historia del desarrollo, enmascaramiento y diagnóstico diferencial.",
        "format": "Carrusel + artículo SEO",
        "caution": "Evitar estereotipos y generalizaciones diagnósticas.",
        "priority": 3,
    },
    {
        "name": "Cine, series y psicología",
        "query": '"cine" "psicología" OR "salud mental" "serie" OR "película" "psicología"',
        "terms": ("pelicula", "cine", "serie", "salud mental", "psicologia"),
        "title": "Lo que el cine nos enseña y nos confunde sobre la salud mental",
        "hook": "¿La pantalla retrata un trastorno o está alimentando un mito?",
        "angle": "Representaciones de psicopatología, empatía y límites de la ficción.",
        "format": "Carrusel + artículo cultural",
        "caution": "No diagnosticar personajes como personas reales.",
        "priority": 2,
    },
]


def normalize(text):
    value = unicodedata.normalize("NFKD", text or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", value).strip().casefold()


def clean_text(text):
    value = html.unescape(text or "")
    value = re.sub(r"<[^>]+>", "", value)
    return re.sub(r"\s+", " ", value).strip()


def safe_url(value):
    try:
        parsed = urllib.parse.urlsplit(value)
    except (TypeError, ValueError):
        return None
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        return None
    if len(value) > 1000:
        return None
    return value


def http_get(url, timeout=18):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; CarolEditorialRadar/1.0)",
            "Accept": "application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.5",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        content = response.read(1_500_001)
        if len(content) > 1_500_000:
            raise ValueError("Fuente RSS demasiado extensa")
        return content


def parse_news(xml_bytes, now):
    root = ET.fromstring(xml_bytes)
    cutoff = now.astimezone(timezone.utc) - timedelta(days=7)
    result = []
    for item in root.findall("./channel/item"):
        title = clean_text(item.findtext("title"))
        link = safe_url(clean_text(item.findtext("link")))
        source = clean_text(item.findtext("source")) or "Medio no identificado"
        raw_date = item.findtext("pubDate") or ""
        try:
            date = parsedate_to_datetime(raw_date).astimezone(timezone.utc)
        except (ValueError, TypeError, IndexError):
            continue
        if not link or not title or date < cutoff or date > now.astimezone(timezone.utc) + timedelta(hours=3):
            continue
        # RSS de Google Noticias añade a menudo el medio al final del título.
        if title.endswith(" - " + source):
            title = title[: -len(" - " + source)]
        ident = hashlib.sha256(normalize(title).encode()).hexdigest()[:18]
        result.append({"title": title, "url": link, "source": source, "date": date, "id": ident})
    return result


def parse_trends(xml_bytes):
    root = ET.fromstring(xml_bytes)
    return [clean_text(item.findtext("title")) for item in root.findall("./channel/item") if item.findtext("title")]


def score_themes(news_by_theme, trends, already_sent):
    candidates = []
    norm_trends = [normalize(item) for item in trends]
    for theme in THEMES:
        stories = []
        unique = set()
        publishers = set()
        for item in news_by_theme.get(theme["name"], []):
            headline = normalize(item["title"])
            if not any(normalize(term) in headline for term in theme["terms"]):
                continue
            if item["id"] in already_sent or item["id"] in unique:
                continue
            unique.add(item["id"])
            stories.append(item)
            publishers.add(normalize(item["source"]))
        # Una única noticia no basta para llamar "tendencia" a un tema.
        if len(stories) < 2 or len(publishers) < 2:
            continue
        matched = any(
            normalize(term) in trend or trend in normalize(term)
            for trend in norm_trends
            for term in theme["terms"]
            if len(normalize(term)) >= 5 and len(trend) >= 5
        )
        recent = sum((datetime.now(timezone.utc) - story["date"]) < timedelta(days=2) for story in stories)
        score = min(len(publishers), 7) * 2 + min(recent, 3) + theme["priority"] + (7 if matched else 0)
        potential = "ALTO" if matched or len(publishers) >= 5 else "MEDIO"
        candidates.append({
            "theme": theme,
            "stories": stories,
            "publishers": len(publishers),
            "trends": matched,
            "score": score,
            "potential": potential,
        })
    return sorted(candidates, key=lambda c: (-c["score"], c["theme"]["name"]))


def escape_html(value):
    return html.escape(str(value), quote=True)


def render_messages(day, picks, checked, trends_ok):
    introduction = [
        "<b>RADAR DE TENDENCIAS · " + day.strftime("%d/%m/%Y") + "</b>",
        "Psicología y neuropsicología | Ideas para tu blog e Instagram",
        "<i>Indicadores: cobertura mediática de 7 días" + (" y coincidencias con Trends España" if trends_ok else "") + ". El potencial es editorial, no una medición de viralidad. Las noticias no demuestran eficacia clínica.</i>",
    ]
    blocks = []
    if not picks:
        blocks.append("No hay temas nuevos con al menos dos medios independientes en las fuentes disponibles. Prefiero no presentar como tendencia algo que no está suficientemente respaldado.")
    for index, pick in enumerate(picks[:5], 1):
        theme = pick["theme"]
        lines = [
            "<b>" + str(index) + ". " + escape_html(theme["name"]) + "</b> · " + pick["potential"],
            "Señal: " + str(pick["publishers"]) + " medios diferentes" + (" + coincidencia en Trends" if pick["trends"] else "") + ".",
            "<b>Idea SEO:</b> " + escape_html(theme["title"]),
            "<b>Gancho:</b> " + escape_html(theme["hook"]),
            "<b>Formato:</b> " + escape_html(theme["format"]),
            "<b>Enfoque:</b> " + escape_html(theme["angle"]),
            "<b>Cautela:</b> " + escape_html(theme["caution"]),
        ]
        for story in pick["stories"][:2]:
            title = escape_html(story["title"][:105])
            lines.append('Fuente: <a href="' + escape_html(story["url"]) + '">' + title + "</a> (" + escape_html(story["source"][:45]) + ")")
        blocks.append("\n".join(lines))
    footer = "Fuentes: noticias indexadas por Google Noticias, no necesariamente estudios científicos. No se publica automáticamente."
    messages = []
    current = "\n".join(introduction)
    for block in blocks:
        addition = "\n\n" + block
        if len(current) + len(addition) + 100 > MAX_MESSAGE:
            messages.append(current)
            current = "<b>RADAR · continuación</b>"
        if len(current) + len(addition) + 100 > MAX_MESSAGE:
            raise ValueError("Una propuesta excede el límite de Telegram")
        current += addition
    if len(current) + len(footer) + 2 > MAX_MESSAGE:
        messages.append(current)
        current = "<b>RADAR · continuación</b>"
    current += "\n\n" + footer
    messages.append(current)
    return [("<b>Informe " + str(i) + "/" + str(len(messages)) + "</b>\n" + item)
            for i, item in enumerate(messages, 1)]



def telegram_send(token, chat, message):
    endpoint = "https://api.telegram.org/bot" + token + "/sendMessage"
    payload = json.dumps({
        "chat_id": chat,
        "text": message,
        "parse_mode": "HTML",
        "link_preview_options": {"is_disabled": True},
    }).encode()
    request = urllib.request.Request(
        endpoint, data=payload, headers={"Content-Type": "application/json"}, method="POST"
    )
    # No reintentar ciegamente: el primer envío podría haberse recibido.
    with urllib.request.urlopen(request, timeout=30) as response:
        result = json.load(response)
    if result.get("ok") is not True or not result.get("result", {}).get("message_id"):
        raise ValueError("Telegram no confirmó el envío")
    return True


def read_state(path):
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(obj, dict) and isinstance(obj.get("sent"), list):
            return obj
    except FileNotFoundError:
        pass
    except (ValueError, UnicodeError):
        pass
    return {"sent": [], "last_day": ""}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--send", action="store_true")
    args = parser.parse_args()
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat = os.environ.get("TELEGRAM_CHAT_ID", "")
    if args.send and (not token or not chat):
        raise RuntimeError("Faltan secretos de Telegram")

    now = datetime.now(timezone.utc)
    today = now.astimezone(MADRID).date()
    state_path = Path(os.environ.get("TREND_RADAR_STATE_PATH", STATE_DEFAULT))
    state = read_state(state_path)
    if args.send and state.get("last_day") == today.isoformat():
        print("Informe de hoy ya enviado; no se repetirá.")
        return

    cutoff = (today - timedelta(days=45)).isoformat()
    history = [v for v in state["sent"] if isinstance(v, dict) and v.get("day", "") >= cutoff]
    sent_ids = {v["id"] for v in history if isinstance(v.get("id"), str)}
    news_by_theme = {}
    successes = 0
    for theme in THEMES:
        query = urllib.parse.urlencode({
            "q": theme["query"] + " when:7d",
            "hl": "es", "gl": "ES", "ceid": "ES:es",
        })
        try:
            news_by_theme[theme["name"]] = parse_news(http_get(NEWS_BASE + "?" + query), now)
            successes += 1
        except (ET.ParseError, ValueError, urllib.error.URLError, TimeoutError) as error:
            print("RSS no disponible para " + theme["name"] + ": " + type(error).__name__, file=sys.stderr)
    if not successes:
        raise RuntimeError("No se ha podido consultar ninguna fuente de actualidad. No se enviará un informe vacío.")

    trends = []
    trends_ok = False
    try:
        trends = parse_trends(http_get(TRENDS_RSS))
        trends_ok = True
    except (ET.ParseError, ValueError, urllib.error.URLError, TimeoutError):
        print("Google Trends no disponible: se usa solo cobertura mediática.", file=sys.stderr)

    picks = score_themes(news_by_theme, trends, sent_ids)[:5]
    messages = render_messages(today, picks, successes, trends_ok)
    if not args.send:
        print("Vista previa sin envío (" + str(successes) + " temas consultados):\n" + "\n\n".join(messages))
        return

    for message in messages:
        telegram_send(token, chat, message)
    new_history = history + [
        {"day": today.isoformat(), "id": item["id"]}
        for pick in picks
        for item in pick["stories"][:2]
    ]
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps({"last_day": today.isoformat(), "sent": new_history}, ensure_ascii=False), encoding="utf-8")
    output = os.environ.get("GITHUB_OUTPUT")
    if output:
        with open(output, "a", encoding="utf-8") as handle:
            handle.write("sent=true\n")
    print("Informe confirmado por Telegram. Temas: " + str(len(picks)) + ".")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # No mostrar tokens, URLs con credenciales ni contenido del chat.
        print("Radar editorial: " + str(exc).replace(os.environ.get("TELEGRAM_BOT_TOKEN", "\0"), "[secret]"), file=sys.stderr)
        sys.exit(1)
