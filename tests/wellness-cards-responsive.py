"""Regression visual de las ocho tarjetas Wellness con HTML derivado de la app.
Sin autenticación ni datos de pacientes.
Ejecutar: python tests/wellness-cards-responsive.py
"""
import html
import re
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "app/mi-espacio/mi-espacio.css").read_text(encoding="utf-8")
PORTAL_CSS = (ROOT / "app/entre-sesiones/app/espacio/portal-app.css").read_text(encoding="utf-8")
PAGE = (ROOT / "app/mi-espacio/page.tsx").read_text(encoding="utf-8")
SPRITE = (ROOT / "public/wellness-editorial-sprite.svg").read_text(encoding="utf-8")
OUTPUT = ROOT / "test-results" / "wellness-mobile"
OUTPUT.mkdir(parents=True, exist_ok=True)

BUTTON_PATTERN = r'<button type="button" data-need="([^"]+)" className="wellness-need-\d+">([\s\S]*?)</button>'
BUTTONS = re.findall(BUTTON_PATTERN, PAGE)
assert len(BUTTONS) == 8, "Deben mantenerse las ocho tarjetas."

def markup():
    result = []
    for index, (need, content) in enumerate(BUTTONS):
        title = re.search(r"<strong>(.*?)</strong>", content, re.S)
        subtitle = re.search(r"<small>(.*?)</small>", content, re.S)
        assert title and subtitle, f"Texto incompleto en {need}"
        result.append(
            f'<button type="button" data-need="{html.escape(need)}" class="wellness-need-{index+1}">'
            '<span class="wellness-art" aria-hidden="true"></span>'
            '<span class="wellness-need-copy">'
            f'<strong>{html.escape(title.group(1))}</strong>'
            f'<small>{html.escape(subtitle.group(1))}</small></span>'
            '<span class="wellness-arrow" aria-hidden="true">›</span></button>'
        )
    return "".join(result)

HTML = '''<!doctype html><html lang="es"><head>
<base href="https://entre-sesiones.test/">
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}body{margin:0;font:16px Arial,sans-serif;background:#f6fbfe}</style>
</head><body><div class="esapp esapp-portal-app">
<main class="space-page"><div class="space-content">
<section class="space-view wellness-experience" data-space-panel="wellness">
<section class="wellness-need-section">
<div class="wellness-section-title"><div>
<p class="space-eyebrow">A TU RITMO</p><h3>¿Qué necesitas ahora?</h3>
</div><p>Puedes cambiar de opción cuando quieras.</p></div>
<div class="wellness-needs wellness-needs-editorial">''' + markup() + '''</div>
</section></section></div></main></div></body></html>'''

def assert_ok(value, message):
    if not value:
        raise AssertionError(message)

def verify(page, width):
    cards = page.locator(".wellness-needs-editorial button")
    assert_ok(cards.count() == 8, f"{width}px: se esperaban ocho tarjetas")
    assert_ok(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
              f"{width}px: desplazamiento horizontal no deseado")
    data = page.evaluate("""() => {
      const parent = document.querySelector('.wellness-needs-editorial');
      const box = el => { const r=el.getBoundingClientRect(); return {
        x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height
      }};
      const items = [...parent.querySelectorAll('button')].map(card => {
        const copy=card.querySelector('.wellness-need-copy');
        const title=copy.querySelector('strong');
        const subtitle=copy.querySelector('small');
        const art=card.querySelector('.wellness-art');
        const arrow=card.querySelector('.wellness-arrow');
        return {card:box(card),copy:box(copy),title:box(title),
          subtitle:box(subtitle),art:box(art),arrow:box(arrow),
          copyBg:getComputedStyle(copy).backgroundColor,
          arrowBg:getComputedStyle(arrow).backgroundColor,
          copyScrollHeight:copy.scrollHeight,copyClientHeight:copy.clientHeight,
          artDisplay:getComputedStyle(art).display,
          copyDisplay:getComputedStyle(copy).display,
          arrowDisplay:getComputedStyle(arrow).display,
          titleText:title.textContent,subtitleText:subtitle.textContent};
      });
      return {items,gridColumns:getComputedStyle(parent).gridTemplateColumns};
    }""")
    items=data["items"]
    for i,item in enumerate(items):
        rect=item["card"]
        assert_ok(rect["width"] > 110 and rect["height"] >= 140,
                  f"{width}px tarjeta {i+1}: tamaño inválido")
        for key in ("art", "copy", "title", "subtitle", "arrow"):
            child=item[key]
            assert_ok(child["x"] >= rect["x"]-1 and child["right"] <= rect["right"]+1 and
                      child["y"] >= rect["y"]-1 and child["bottom"] <= rect["bottom"]+1,
                      f"{width}px tarjeta {i+1}: {key} desbordado de la tarjeta")
        assert_ok(item["copyScrollHeight"] <= item["copyClientHeight"]+2,
                  f"{width}px tarjeta {i+1}: texto cortado")
        assert_ok(item["copyBg"] in ("rgba(0, 0, 0, 0)", "transparent") and
                  item["arrowBg"] in ("rgba(0, 0, 0, 0)", "transparent"),
                  f"{width}px tarjeta {i+1}: manchas heredadas del icono antiguo")
        for key in ("artDisplay","copyDisplay","arrowDisplay"):
            assert_ok(item[key] != "none", f"{width}px tarjeta {i+1}: {key} oculto")
        assert_ok(bool(item["titleText"].strip()) and bool(item["subtitleText"].strip()),
                  f"{width}px tarjeta {i+1}: faltan textos")
    for i in range(0,8,2):
        a,b=items[i]["card"],items[i+1]["card"]
        assert_ok(abs(a["y"]-b["y"]) < 2 and abs(a["height"]-b["height"]) < 2,
                  f"{width}px fila {i//2+1}: tarjetas desalineadas")
        assert_ok(a["right"] <= b["x"]+1,f"{width}px: columnas superpuestas")
    if width in (320,360,390,430,750,1024):
        page.screenshot(path=str(OUTPUT/f"{width}-editorial-cards.png"),full_page=True)
    print(f"PASS {width}px: iconos, flechas, textos completos, columnas y ausencia de solapamientos")

with sync_playwright() as p:
    launch_options={"headless":True,"args":["--no-sandbox","--disable-dev-shm-usage"]}
    executable=(shutil.which("google-chrome") or shutil.which("google-chrome-stable")
                or shutil.which("chromium") or shutil.which("chromium-browser"))
    if executable:
        launch_options["executable_path"]=executable
    browser = p.chromium.launch(**launch_options)
    for width in (320,360,390,430,750,1024):
        context=browser.new_context(viewport={"width":width,"height":850},
            device_scale_factor=1,is_mobile=width < 800,has_touch=width < 800,locale="es-ES")
        page=context.new_page()
        page.route("**/wellness-editorial-sprite.svg", lambda route: route.fulfill(
            status=200,content_type="image/svg+xml",body=SPRITE))
        page.set_content(HTML,wait_until="domcontentloaded")
        page.add_style_tag(content=CSS+"\n"+PORTAL_CSS)
        page.wait_for_timeout(100)
        verify(page,width)
        context.close()
    browser.close()
print("PASS: responsive Wellness cards without clipping at six viewports.")
