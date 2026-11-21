#!/usr/bin/env python3
"""Radar de ahorro en España; no accede a bancos ni recomienda inversiones."""
import argparse
import hashlib
import html
import json
import os
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date, datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from zoneinfo import ZoneInfo

TZ = ZoneInfo("Europe/Madrid")
GOOGLE_NEWS = "https://news.google.com/rss/search"
STATE = "/tmp/savings-radar-telegram.json"
SOURCES = {
    "bde": ("Banco de España: planificación financiera", "https://clientebancario.bde.es/pcb/es/blog/propositos-financieros-de-ano-nuevo-como-empezar-el-ano-con-estabilidad-economica.html"),
    "gastos": ("Banco de España: gastos hormiga", "https://clientebancario.bde.es/pcb/es/blog/micro-spending-o-el-arte-de-gastar-al-tuntun.html?blog=%2Fwebcb%2FBlog%2FEducacionFinanciera"),
    "metodos": ("Banco de España: métodos para ahorrar", "https://clientebancario.bde.es/pcb/es/blog/metodos-sencillos-para-ahorrar.html?blog=%2Fwebcb%2FBlog%2FEducacionFinanciera"),
    "cnmc": ("CNMC: comparar suministros eléctricos", "https://www.cnmc.es/facil-para-ti/que-hace-la-cnmc-para-consumidores/comercializacion-y-suministro-electrico"),
    "idae": ("IDAE: consumo eficiente en el hogar", "https://www.idae.es/ahorra-energia/recomendaciones-para-el-ahorro-energetico-en-hogares"),
}
# (tema, tarea concreta, cálculo orientativo, minirreto, referencia).
TIPS = [
    ("Suscripciones", "Revisa las cuotas de los dos últimos meses y cancela una que no uses, comprobando antes permanencias.", "Evitar 8 €/mes innecesarios equivale a 96 €/año.", "Haz inventario de tus pagos recurrentes.", "bde"),
    ("Compra con lista", "Planifica tres comidas con lo que ya tienes y compra con lista; compara precios por kilo.", "Reducir 5 €/semana en compras prescindibles equivale a 260 €/año.", "Guarda un ticket y contrástalo con tu lista.", "gastos"),
    ("Móvil e internet", "Comprueba el coste real y las permanencias; compara dos tarifas con servicios equivalentes.", "Bajar 4 €/mes una cuota supone 48 €/año.", "Anota servicios, precio y fecha de renovación.", "bde"),
    ("Factura de luz", "Revisa potencia, consumo, servicios extra y tipo de tarifa. Usa el comparador de la CNMC desde el QR de tu factura.", "El ahorro varía según consumo y contrato; no hay cifra universal.", "Localiza una factura y compara ofertas completas.", "cnmc"),
    ("Comisiones bancarias", "Identifica cargos de mantenimiento, tarjeta y transferencias. Revisa las condiciones de exención.", "Evitar una comisión de 3 €/mes supone 36 €/año.", "Revisa los últimos tres extractos.", "bde"),
    ("Gastos hormiga", "Anota durante siete días los pequeños pagos no planificados, sin prohibir gastos que sí valoras.", "Evitar dos gastos de 2 € cada semana supone 208 €/año.", "Clasifica los gastos en útiles y prescindibles.", "gastos"),
    ("Desperdicio alimentario", "Planifica una comida a partir de alimentos que ya tienes, respetando su conservación segura.", "No desperdiciar 3 € de comida por semana equivale a 156 €/año.", "Haz inventario de nevera y despensa.", "gastos"),
    ("Ahorro automático", "Si cubres tus gastos esenciales, programa una aportación pequeña a una cuenta separada; páusala cuando sea necesario.", "Reservar 10 €/semana acumula 520 €/año: es dinero apartado, no una reducción del gasto.", "Elige un importe sostenible.", "metodos"),
    ("Energía doméstica", "Revisa calefacción, aire acondicionado, iluminación y electrodomésticos sin comprometer seguridad ni bienestar.", "Una reducción hipotética de 2 €/mes en la factura suma 24 €/año.", "Prueba una medida y compara facturas equivalentes.", "idae"),
    ("Renovación de seguros", "Apunta vencimientos y compara coberturas y exclusiones equivalentes; evita infrasegurarte.", "Pagar 5 €/mes menos por una cobertura comparable supone 60 €/año.", "Revisa el preaviso de tu próxima renovación.", "bde"),
    ("Precio por unidad", "Compara por kilo o litro, sin comprar formatos grandes si terminarán desperdiciándose.", "Un euro menos por semana en compras necesarias equivale a 52 €/año.", "Compara tres productos habituales.", "gastos"),
    ("Compra impulsiva", "Espera 24 horas antes de adquirir algo no esencial y comprueba si encaja en tu presupuesto.", "Evitar una compra de 20 €/mes supone 240 €/año.", "Crea una lista de deseos con fecha.", "gastos"),
    ("Transporte", "Compara billetes y abonos según tus viajes reales; revisa siempre vigencia y requisitos.", "Reducir 3 €/semana en trayectos equivalentes supone 156 €/año.", "Cuenta los desplazamientos de una semana típica.", "bde"),
    ("Reserva de emergencias", "Si tienes margen, separa una reserva líquida para imprevistos sin descuidar pagos esenciales.", "Apartar 15 €/semana acumula 780 €/año, no es una ganancia.", "Define tu primera meta realista.", "metodos"),
    ("Cargos anuales", "Identifica suscripciones anuales y fechas de renovación para valorar si siguen compensando.", "Evitar una renovación de 30 € innecesaria ahorra 30 € ese año.", "Programa avisos previos a tres renovaciones.", "bde"),
    ("Ingresos variables", "Calcula tus gastos esenciales del mes y separa las cantidades reservadas para impuestos de las disponibles para consumir.", "Apartar 6 €/semana acumula 312 €/año, no reduce gastos por sí solo.", "Calcula tu mínimo mensual imprescindible.", "bde"),
]
QUERIES = (
    "site:cnmc.es ahorro electricidad tarifa consumidor",
    "site:clientebancario.bde.es ahorro presupuesto comisiones",
    "site:idae.es ahorro energia hogar",
)

def norm(s):
    v = unicodedata.normalize("NFKD", s or "")
    return "".join(c for c in v if not unicodedata.combining(c)).casefold()

def url_safe(url):
    try:
        p = urllib.parse.urlsplit(url)
        return bool(p.scheme == "https" and p.hostname and not p.username and not p.password and len(url) < 1500)
    except (ValueError, TypeError):
        return False

def tip_for(day):
    return TIPS[((day - date(2026, 11, 22)).days // 7) % len(TIPS)]

def news_from_rss(raw, now):
    root = ET.fromstring(raw)
    output = []
    for item in root.findall("./channel/item"):
        source = html.unescape(item.findtext("source") or "").strip()
        if not any(x in norm(source) for x in ("cnmc", "banco de espana", "idae", "instituto para la diversificacion")):
            continue
        title = html.unescape(re.sub("<[^>]+>", "", item.findtext("title") or "")).strip()
        if title.endswith(" - " + source):
            title = title[:-(len(source) + 3)]
        if not any(x in norm(title) for x in ("ahorr", "tarifa", "electric", "consumo", "comision", "finanza", "energia", "cuenta", "presupuesto", "comparador")):
            continue
        link = (item.findtext("link") or "").strip()
        if not url_safe(link):
            continue
        try:
            published = parsedate_to_datetime(item.findtext("pubDate") or "").astimezone(timezone.utc)
        except (TypeError, ValueError, IndexError):
            continue
        if not now - timedelta(days=14) <= published <= now + timedelta(hours=3):
            continue
        ident = hashlib.sha256(norm(title).encode()).hexdigest()[:16]
        output.append({"id": ident, "title": title[:110], "url": link, "date": published, "source": source})
    return output

def fetch_recent(now, seen):
    found = {}
    for query in QUERIES:
        params = urllib.parse.urlencode({"q": query + " when:14d", "hl": "es", "gl": "ES", "ceid": "ES:es"})
        request = urllib.request.Request(GOOGLE_NEWS + "?" + params, headers={"User-Agent": "CarolSavingsRadar/1.0"})
        try:
            with urllib.request.urlopen(request, timeout=12) as response:
                raw = response.read(900001)
            if len(raw) > 900000:
                continue
            for story in news_from_rss(raw, now):
                if story["id"] not in seen:
                    found[story["id"]] = story
        except (OSError, ValueError, ET.ParseError) as exc:
            print("No disponible una fuente de noticias: " + type(exc).__name__, file=sys.stderr)
    return sorted(found.values(), key=lambda x: x["date"], reverse=True)[:2]

def render(day, tip, stories):
    title, action, example, challenge, source_key = tip
    label, link = SOURCES[source_key]
    esc = html.escape
    out = [
        "<b>RADAR DE AHORRO · " + day.strftime("%d/%m/%Y") + "</b>",
        "Consejos para España · Una acción práctica por semana", "",
        "<b>Esta semana: " + esc(title) + "</b>",
        esc(action), "", "<b>Ejemplo con números</b>", esc(example),
        "<i>Cálculo hipotético, nunca una promesa de ahorro.</i>", "",
        "<b>Reto de 10 minutos</b>", esc(challenge), "",
        '<b>Fuente:</b> <a href="' + esc(link, quote=True) + '">' + esc(label) + "</a>",
    ]
    if stories:
        out += ["", "<b>Lecturas recientes para revisar</b>"]
        for story in stories:
            out.append('• <a href="' + esc(story["url"], quote=True) + '">' + esc(story["title"]) + '</a> (' + esc(story["source"]) + ", " + story["date"].astimezone(TZ).strftime("%d/%m") + ")")
        out.append("<i>Son enlaces a titulares, no ofertas ni descuentos verificados.</i>")
    out += ["", "Sin publicidad afiliada. No accede a cuentas ni solicita información bancaria."]
    message = "\n".join(out)
    if len(message) > 3900:
        raise ValueError("Mensaje de Telegram demasiado largo")
    return message

def telegram_send(token, chat_id, message):
    req = urllib.request.Request(
        "https://api.telegram.org/bot" + token + "/sendMessage",
        data=json.dumps({"chat_id": chat_id, "text": message, "parse_mode": "HTML", "link_preview_options": {"is_disabled": True}}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    # No reintentar cuando la respuesta se pierde: Telegram puede haber aceptado el mensaje.
    with urllib.request.urlopen(req, timeout=30) as response:
        result = json.load(response)
    if not result.get("ok") or not result.get("result", {}).get("message_id"):
        raise RuntimeError("Telegram no confirmó el envío")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--send", action="store_true")
    send = parser.parse_args().send
    now = datetime.now(timezone.utc)
    today = now.astimezone(TZ).date()
    week = f"{today.isocalendar().year}-W{today.isocalendar().week:02d}"
    path = Path(os.getenv("SAVINGS_RADAR_STATE_PATH", STATE))
    try:
        state = json.loads(path.read_text(encoding="utf-8"))
        history = state["weeks"] if isinstance(state.get("weeks"), list) else []
    except (OSError, ValueError, KeyError):
        history = []
    history = [x for x in history if isinstance(x, dict)][-24:]
    if send and any(x.get("week") == week for x in history):
        print("El informe semanal ya fue enviado; se evita duplicado.")
        return
    seen = {i for x in history for i in x.get("news_ids", []) if isinstance(i, str)}
    stories = fetch_recent(now, seen)
    message = render(today, tip_for(today), stories)
    if not send:
        print("Vista previa sin envío:\n" + message)
        return
    token, chat_id = os.getenv("TELEGRAM_BOT_TOKEN", ""), os.getenv("TELEGRAM_CHAT_ID", "")
    if not token or not chat_id:
        raise RuntimeError("Faltan secretos de Telegram")
    telegram_send(token, chat_id, message)
    path.parent.mkdir(parents=True, exist_ok=True)
    history.append({"week": week, "news_ids": [s["id"] for s in stories]})
    path.write_text(json.dumps({"weeks": history[-24:]}), encoding="utf-8")
    if os.getenv("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as output:
            output.write("sent=true\n")
    print("Informe enviado y confirmado: " + week)

if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("Radar de ahorro: " + str(error).replace(os.getenv("TELEGRAM_BOT_TOKEN") or "\0", "[secreto]"), file=sys.stderr)
        sys.exit(1)
