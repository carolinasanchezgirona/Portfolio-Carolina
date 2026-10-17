"""Entre Sesiones protected SPA navigation, Android Back and privacy smoke tests.

The actual production portal script runs in Chromium mobile emulation.
All session endpoints are replaced with synthetic responses. No patient data,
real credentials or production API requests are used.
"""
from __future__ import annotations
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "public/mi-espacio.js").read_text(encoding="utf-8")
BASE = "https://entre-sesiones-navigation.test"
APP = "/entre-sesiones/app/espacio/"
HTML = """<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
[hidden] { display: none !important; }
body { margin:0; font-family:system-ui,sans-serif; }
.esapp-bottom-nav {display:flex;gap:8px;position:fixed;bottom:0;padding:10px;background:#fff;width:100%}
.esapp-bottom-nav a {display:block;padding:8px;font-size:14px}
.space-view {padding:18px}
</style></head><body>
<nav class="esapp-bottom-nav" aria-label="Navegación de Entre Sesiones" hidden>
<a href="/entre-sesiones/app/">Inicio</a>
<a href="/entre-sesiones/app/espacio/?vista=terapia">Mi terapia</a>
<a href="/entre-sesiones/app/espacio/?vista=wellness">Wellness</a>
<a href="/entre-sesiones/app/espacio/?vista=progreso">Progreso</a>
<a href="/entre-sesiones/app/espacio/?vista=configuracion">Cuenta</a>
</nav>
<section id="space-access"><form id="space-login-form">
<input id="space-login-email" type="email"><input id="space-login-password" type="password">
</form><p id="space-access-message"></p></section>
<div id="space-shell" hidden>
<nav class="space-nav">
<button type="button" data-space-view="today">Hoy</button>
<button type="button" data-space-view="therapy">Mi terapia</button>
<button type="button" data-space-view="wellness">Wellness</button>
<button type="button" data-space-view="progress">Mi progreso</button>
<button type="button" data-space-view="account">Configuración</button></nav>
<section class="space-view" data-space-panel="today"><h1>Hoy</h1>
<button data-need="rumiacion">Menos vueltas</button><button data-go-therapy>Ir a mi terapia</button>
</section>
<section class="space-view" data-space-panel="therapy" hidden><h1>Mi terapia</h1>
<label>Respuesta en preparación<textarea id="draft-clinical-answer"></textarea></label></section>
<section class="space-view" data-space-panel="wellness" hidden><h1>Wellness</h1>
<div id="wellness-journey"></div><div id="wellness-context" hidden></div>
<div id="wellness-list"></div></section>
<section class="space-view" data-space-panel="progress" hidden><h1>Mi progreso</h1>
<span id="progress-total"></span><span id="progress-week"></span><span id="progress-favorites"></span>
<div id="progress-history"></div></section>
<section class="space-view" data-space-panel="account" hidden><h1>Cuenta</h1></section>
</div>
<dialog id="wellness-dialog"><button id="wellness-dialog-close">Cerrar</button>
<p id="wellness-dialog-type"></p><h2 id="wellness-dialog-title"></h2>
<p id="wellness-dialog-intro"></p><ol id="wellness-dialog-steps"></ol>
<p id="wellness-dialog-note"></p>
<button id="wellness-favorite"></button><button id="wellness-complete"></button>
</dialog>
</body></html>"""

def assert_true(value, why):
    if not value:
        raise AssertionError(why)

def test_authenticated(page, width):
    page.goto(BASE + APP + "?vista=wellness")
    page.evaluate("window.__wellnessResets = 0; document.addEventListener('wellness:interactive-reset', () => window.__wellnessResets++);")
    page.add_script_tag(content=JS)
    page.locator("#space-shell:not([hidden])").wait_for()
    assert_true(not page.locator(".esapp-bottom-nav").get_attribute("hidden"), "Authenticated bottom nav remains hidden")
    assert_true(page.locator('[data-space-panel="wellness"]').is_visible(), "Initial Wellness deep link failed")
    assert_true(page.locator(".esapp-bottom-nav a[aria-current='page']").inner_text() == "Wellness", "Wellness not active")
    page.locator(".esapp-bottom-nav a", has_text="Mi terapia").click()
    assert_true(page.locator('[data-space-panel="therapy"]').is_visible(), "Therapy did not open")
    assert_true(page.url.endswith("?vista=terapia"), "PWA URL not updated")
    assert_true(page.evaluate("window.__wellnessResets") >= 1, "Wellness ephemeral data not reset")
    page.locator("#draft-clinical-answer").fill("EXCLUSIVAMENTE FICTICIO")
    page.locator(".esapp-bottom-nav a", has_text="Progreso").click()
    assert_true(page.locator('[data-space-panel="progress"]').is_visible(), "Progress not opened")
    assert_true(page.url.endswith("?vista=progreso"), "Progress URL not updated")
    page.go_back(wait_until="domcontentloaded")
    assert_true(page.locator('[data-space-panel="therapy"]').is_visible(), "Android Back did not restore therapy")
    assert_true(page.locator("#draft-clinical-answer").input_value() == "EXCLUSIVAMENTE FICTICIO", "Therapy field lost on tab switch")
    assert_true(page.evaluate("performance.getEntriesByType('navigation').length") == 1, "Navigation reloaded the document")
    page.locator('.space-nav button[data-space-view="today"]').click()
    assert_true(page.url.endswith("?vista=panel"), "Sidebar not synced with URL")
    page.locator('button[data-need="rumiacion"]').click()
    assert_true(page.locator('[data-space-panel="wellness"]').is_visible(), "Wellness need shortcut failed")
    assert_true(page.url.endswith("?vista=wellness"), "Wellness shortcut not reflected in URL")
    page.locator(".esapp-bottom-nav a", has_text="Cuenta").click()
    assert_true(page.locator('[data-space-panel="account"]').is_visible(), "Account navigation failed")
    assert_true(page.locator(".esapp-bottom-nav a[aria-current='page']").inner_text() == "Cuenta", "Account tab state incorrect")
    assert_true(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "Horizontal overflow")
    print(f"PASS SPA {width}px: protected navigation, URL, Android Back, preserved draft, reset, active tabs")

with sync_playwright() as p:
    options = {"headless": True, "args": ["--no-sandbox","--disable-dev-shm-usage"]}
    installed = (shutil.which("google-chrome") or shutil.which("google-chrome-stable")
                 or shutil.which("chromium") or shutil.which("chromium-browser"))
    if installed:
        options["executable_path"] = installed
    browser = p.chromium.launch(**options)
    for width in (360,390):
        context = browser.new_context(
            viewport={"width":width,"height":780},is_mobile=True,has_touch=True,
            locale="es-ES",device_scale_factor=2)
        page = context.new_page()
        errors = []
        page.on("pageerror",lambda error: errors.append(str(error)))
        def handle(route):
            path = route.request.url
            if path.startswith(BASE + APP):
                route.fulfill(status=200,content_type="text/html",body=HTML)
            elif "/api/patient-portal/session" in path:
                route.fulfill(status=200,content_type="application/json",
                    body='{"authenticated":true,"patient":{"first_name":"PRUEBA"},"materials":[],"files":[]}')
            elif "/api/patient-portal/preferences" in path:
                route.fulfill(status=200,content_type="application/json",
                    body='{"storage_scope":"0123456789abcdef01234567"}')
            else:
                route.fulfill(status=404,body="Not found")
        page.route("**/*",handle)
        test_authenticated(page,width)
        assert_true(not errors,"JavaScript errors: "+str(errors))
        context.close()
    browser.close()
print("All Entre Sesiones PWA navigation mobile smoke tests passed.")
