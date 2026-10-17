"""Android-size browser tests for the real session-preparation script, using invented text.

The tests do not authenticate to a real patient account or send any records.
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
MODULE = (ROOT / "public/session-prep.js").read_text(encoding="utf-8")
STYLES = (ROOT / "app/mi-espacio/mi-espacio.css").read_text(encoding="utf-8")
HTML = """<!doctype html><html lang="es"><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style> *{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif}
[hidden]{display:none!important}.space-page{min-height:100vh;padding:14px}
</style></head><body><main class="space-page">
<section id="space-access"><h1>Acceso seguro</h1></section>
<div id="space-shell" hidden>
<section id="space-session-prep" class="space-session-prep" tabindex="-1">
 <div class="space-session-prep-head"><div><p class="space-eyebrow">ANTES DE NUESTRA PRÓXIMA SESIÓN</p><h3>Hay cosas que merece la pena traer a consulta.</h3></div></div>
 <form id="space-session-prep-form">
 <label for="space-prep-difficult">¿Qué me ha costado?</label><textarea id="space-prep-difficult" maxlength="900"></textarea>
 <label for="space-prep-helped">¿Qué me ha ayudado?</label><textarea id="space-prep-helped" maxlength="900"></textarea>
 <label for="space-prep-talk">¿De qué quiero hablar?</label><textarea id="space-prep-talk" maxlength="900"></textarea>
 <button id="space-prep-preview-button" type="button">Ver mi resumen</button>
 <button id="space-prep-clear" type="button">Descartar notas</button>
 </form>
 <div id="space-session-prep-preview" class="space-session-prep-preview" hidden>
 <div id="space-session-prep-summary"></div>
 <select id="space-session-prep-target"><option value="">Seleccionar</option></select>
 <button id="space-session-prep-insert" type="button">Incorporar al ejercicio</button>
 <button id="space-session-prep-copy" type="button">Copiar resumen</button>
 </div>
 <p id="space-session-prep-message"></p>
 </section>
 <div id="space-patient-materials"></div>
 <button type="button" data-space-view="therapy">Mi terapia</button>
 </div></main></body></html>"""

def assert_check(condition, explanation):
    if not condition: raise AssertionError(explanation)

with sync_playwright() as p:
    launch = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
    chrome = (shutil.which("google-chrome") or shutil.which("google-chrome-stable")
              or shutil.which("chromium") or shutil.which("chromium-browser"))
    if chrome: launch["executable_path"] = chrome
    browser = p.chromium.launch(**launch)
    for width, height in [(390, 844), (360, 780)]:
        context = browser.new_context(viewport={"width": width, "height": height},
            has_touch=True, is_mobile=True, device_scale_factor=2, locale="es-ES")
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        requests = []
        page.on("request", lambda req: requests.append(req.url))
        page.set_content(HTML)
        page.add_style_tag(content=STYLES)
        page.evaluate("""() => {
            window.__transferNavigated = 0;
            document.querySelector('[data-space-view="therapy"]').addEventListener('click',
                () => window.__transferNavigated++);
            window.confirm = () => true;
        }""")
        page.add_script_tag(content=MODULE)
        page.locator("#space-prep-talk").fill("Solo datos inventados")
        page.locator("#space-prep-preview-button").tap()
        assert_check(page.locator("#space-session-prep-preview").is_hidden(), "Unauthorized preview visible")
        page.evaluate("""() => {
          document.querySelector('#space-access').hidden = true;
          document.querySelector('#space-shell').hidden = false;
          const wrapper = document.querySelector('#space-patient-materials');
          const card = document.createElement('details');
          card.dataset.patientMaterialId = 'material-ficticio';
          card.className='space-patient-material';
          card.innerHTML = '<summary><span class="space-patient-material-title"><strong>Ejercicio ficticio</strong></span></summary><div><form class="space-patient-response"><textarea data-response-record maxlength="12000">Nota anterior ficticia</textarea><div class="space-patient-response-status">Borrador guardado</div></form></div>';
          wrapper.append(card);
          window.dispatchEvent(new Event('patient-portal-view-ready'));
        }""")
        page.locator("#space-prep-difficult").fill("Situación de ejemplo inventada")
        page.locator("#space-prep-helped").fill("Me ayudó descansar cinco minutos")
        page.locator("#space-prep-talk").fill("Quiero hablar de una duda inventada")
        page.locator("#space-prep-preview-button").tap()
        assert_check(page.locator(".space-session-prep-summary-row").count() == 3, "Three prompts not previewed")
        assert_check(page.locator("#space-session-prep-target option").count() == 2, "Assigned form not discovered")
        page.locator("#space-session-prep-target").select_option("material-ficticio")
        page.locator("#space-session-prep-insert").tap()
        inserted = page.locator("[data-response-record]").input_value()
        assert_check("Nota anterior ficticia" in inserted, "Existing clinical draft was overwritten")
        assert_check("Situación de ejemplo inventada" in inserted, "New summary missing from exercise")
        assert_check(page.evaluate("window.__transferNavigated") == 1, "Not forwarded to existing therapy form")
        assert_check("SIN guardar" in page.locator(".space-patient-response-status").inner_text(), "Unsaved warning missing")
        assert_check(not requests, "Unexpected network request or auto-share: " + str(requests))
        page.locator("#space-prep-helped").fill("Otro pensamiento inventado")
        assert_check(page.locator("#space-session-prep-preview").is_hidden(), "Stale preview remains visible")
        page.evaluate("""() => {
            document.querySelector('#space-shell').hidden = true;
            document.querySelector('#space-access').hidden = false;
            document.dispatchEvent(new Event('patient-portal-locked'));
        }""")
        for field in ("space-prep-difficult", "space-prep-helped", "space-prep-talk"):
            assert_check(not page.locator("#" + field).input_value(), "Text survived logout in " + field)
        assert_check(page.locator("#space-session-prep-preview").is_hidden(), "Preview survived logout")
        assert_check(not errors, "Browser JS errors: " + str(errors))
        assert_check(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "Horizontal overflow")
        # No eligible material: copying/reading remains available, transfer disabled.
        page.evaluate("""() => {
          document.querySelector('#space-access').hidden = true;
          document.querySelector('#space-shell').hidden = false;
          document.querySelector('#space-patient-materials').replaceChildren();
          window.dispatchEvent(new Event('patient-portal-view-ready'));
        }""")
        page.locator("#space-prep-talk").fill("Nota ficticia sin ejercicio")
        page.locator("#space-prep-preview-button").tap()
        assert_check(page.locator("#space-session-prep-insert").is_disabled(), "Transfer should be disabled without eligible exercise")
        print(f"PASS session prep at {width}x{height}: guarded access, 3 prompts, explicit unsaved transfer, private logout, zero writes, no material")
        context.close()
    browser.close()
print("All next-session preparation mobile QA checks passed.")
