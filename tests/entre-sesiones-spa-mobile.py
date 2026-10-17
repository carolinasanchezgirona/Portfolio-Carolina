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
FAKE_ID = "aabbccdd-0011-4222-8333-445566778899"
APP = "/entre-sesiones/app/espacio/"
HTML = """<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
[hidden] { display: none !important; }
body { margin:0; padding-bottom:100px; font-family:system-ui,sans-serif; }
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
<section id="space-session-check">Comprobando acceso seguro…</section>
<section id="space-access" hidden><form id="space-login-form">
<input id="space-login-email" type="email"><input id="space-login-password" type="password">
</form><p id="space-access-message"></p></section>
<div id="space-shell" class="space-page" hidden>
<div id="space-patient-materials"></div><div id="space-shared-files"></div>
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
<section class="space-view" data-space-panel="account" hidden><h1>Cuenta</h1>
<label for="space-reading-size">Tamaño
<select id="space-reading-size"><option value="normal">Normal</option><option value="large">Grande</option><option value="extra">Muy grande</option></select></label>
<label for="space-reading-simple"><input id="space-reading-simple" type="checkbox">Lectura tranquila</label>
<label for="space-reading-motion"><input id="space-reading-motion" type="checkbox">Menos movimiento</label>
<button id="space-logout" type="button">Cerrar sesión</button>
<p id="space-clear-message" role="status"></p>
</section>
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
    assert_true(page.locator("#space-access").is_hidden(), "Login form flashes before verifying the session")
    assert_true(page.locator("#space-session-check").is_visible(), "Neutral verification screen missing")
    page.evaluate("window.__wellnessResets = 0; document.addEventListener('wellness:interactive-reset', () => window.__wellnessResets++);")
    page.add_script_tag(content=JS)
    page.locator("#space-shell:not([hidden])").wait_for()
    assert_true(page.locator("#space-access").is_hidden(), "Password prompt visible for an authenticated patient")
    assert_true(page.locator("#space-session-check").is_hidden(), "Session check still covering the authenticated app")
    # BFCache restore must show an unobtrusive session check, never a password form.
    restored = page.evaluate("""() => {
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
      return {
        checking: !document.querySelector('#space-session-check').hidden,
        password: !document.querySelector('#space-access').hidden
      };
    }""")
    assert_true(restored["checking"] and not restored["password"], "BFCache restore flashes the password form")
    page.locator("#space-shell:not([hidden])").wait_for()
    assert_true(page.locator("#space-session-check").is_hidden(), "BFCache verification not completed")
    assert_true(not page.locator(".esapp-bottom-nav").get_attribute("hidden"), "Authenticated bottom nav remains hidden")
    assert_true(page.locator('[data-space-panel="wellness"]').is_visible(), "Initial Wellness deep link failed")
    assert_true(page.locator(".esapp-bottom-nav a[aria-current='page']").inner_text() == "Wellness", "Wellness not active")
    page.locator(".esapp-bottom-nav a", has_text="Mi terapia").click()
    assert_true(page.locator('[data-space-panel="therapy"]').is_visible(), "Therapy did not open")
    assert_true(page.url.endswith("?vista=terapia"), "PWA URL not updated")
    assert_true(page.evaluate("window.__wellnessResets") >= 1, "Wellness ephemeral data not reset")
    material = page.locator(".space-patient-material")
    assert_true(material.count() == 1, "Assigned synthetic exercise was not rendered")
    assert_true(material.get_attribute("id") == "space-material-" + FAKE_ID, "Material anchor mismatch")
    link = material.locator("a.space-material-download-button")
    assert_true(link.get_attribute("href") == "/api/patient-portal/material-pdf?material_id=" + FAKE_ID,
                "PDF does not use authenticated native URL")
    assert_true(link.get_attribute("download") is not None, "PDF link does not request a native download")
    assert_true(link.get_attribute("target") is None, "PDF download must not open a new PWA tab")
    # The browser receives a synthetic private PDF response. This checks a real
    # browser download event, not merely that the anchor looks correct.
    def serve_test_pdf(route):
        route.fulfill(status=200, headers={
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="entre-sesiones-prueba.pdf"',
            "Cache-Control": "private, no-store"
        }, body=b"%PDF-1.4\\n1 0 obj <<>> endobj\\n%%EOF")
    page.route("**/api/patient-portal/material-pdf?*", serve_test_pdf)
    with page.expect_download(timeout=12000) as completed:
        link.click()
    assert_true(completed.value.suggested_filename.endswith(".pdf"), "The mobile browser did not download a PDF")
    page.unroute("**/api/patient-portal/material-pdf?*", serve_test_pdf)
    page.evaluate("window.__printCalls = 0; window.print = () => { window.__printCalls++; };")
    material.locator(".space-material-print-button").click()
    print("PRINT-DIAG", page.evaluate("""() => ({
      callCount: window.__printCalls,
      location: location.pathname,
      shellVisible: !document.querySelector('#space-shell').hidden,
      hint: document.querySelector('.space-material-download-status')?.textContent,
      connected: Boolean(document.querySelector('.space-patient-material')?.isConnected),
      materialWithin: Boolean(document.querySelector('#space-patient-materials')?.contains(document.querySelector('.space-patient-material'))),
      printFlag: document.body.classList.contains('space-print-patient-material')
    })"""))
    assert_true(page.evaluate("window.__printCalls") == 1, "Print PDF alternative did not invoke the native print dialog")
    assert_true(material.get_attribute("data-print-material") == "true", "Printable worksheet not selected")
    assert_true(page.evaluate("document.body.classList.contains('space-print-patient-material')"),
                "Worksheet print-only stylesheet not enabled")
    page.evaluate("""(id) => {
      history.replaceState(null, "", location.pathname + location.search + "#space-material-" + id);
      window.dispatchEvent(new Event("hashchange"));
    }""", FAKE_ID)
    assert_true(material.get_attribute("open") is not None, "Deep link failed to expand assigned exercise")
    assert_true(page.evaluate("document.activeElement.tagName === 'SUMMARY'"), "Deep link did not focus its exercise")
    response = material.locator("[data-response-record]")
    response.fill("Borrador de prueba, todavía sin guardar")
    assert_true("SIN guardar" in material.locator(".space-patient-response-status").inner_text(), "Missing dirty indicator")
    prevented = page.evaluate("""() => {
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    }""")
    assert_true(prevented, "Unsaved clinical response does not warn before exit")
    page.locator("#draft-clinical-answer").fill("EXCLUSIVAMENTE FICTICIO")
    page.locator(".esapp-bottom-nav a", has_text="Progreso").click()
    assert_true(page.locator('[data-space-panel="progress"]').is_visible(), "Progress not opened")
    assert_true(page.url.endswith("?vista=progreso"), "Progress URL not updated")
    page.go_back(wait_until="domcontentloaded")
    assert_true(page.locator('[data-space-panel="therapy"]').is_visible(), "Android Back did not restore therapy")
    assert_true(page.locator("#draft-clinical-answer").input_value() == "EXCLUSIVAMENTE FICTICIO", "Therapy field lost on tab switch")
    assert_true(response.input_value() == "Borrador de prueba, todavía sin guardar", "Draft in exercise was lost on tab switch")
    assert_true(page.evaluate("performance.getEntriesByType('navigation').length") == 1, "Navigation reloaded the document")
    page.locator('.space-nav button[data-space-view="today"]').click()
    assert_true(page.url.endswith("?vista=panel"), "Sidebar not synced with URL")
    page.locator('button[data-need="rumiacion"]').click()
    assert_true(page.locator('[data-space-panel="wellness"]').is_visible(), "Wellness need shortcut failed")
    assert_true(page.url.endswith("?vista=wellness"), "Wellness shortcut not reflected in URL")
    page.locator(".esapp-bottom-nav a", has_text="Cuenta").click()
    assert_true(page.locator('[data-space-panel="account"]').is_visible(), "Account navigation failed")
    assert_true(page.locator(".esapp-bottom-nav a[aria-current='page']").inner_text() == "Cuenta", "Account tab state incorrect")
    page.locator("#space-reading-size").wait_for(state="visible")
    page.locator("#space-reading-size").select_option("extra")
    page.locator("#space-reading-simple").check()
    page.locator("#space-reading-motion").check()
    assert_true(page.locator("#space-shell").get_attribute("data-reading-size") == "extra", "Reading size not applied")
    assert_true(page.locator("#space-shell").evaluate("(el) => el.classList.contains('space-reading-simple')"), "Simple reading mode missing")
    assert_true(page.locator("#space-shell").evaluate("(el) => el.classList.contains('space-reading-quiet')"), "Quiet mode missing")
    page.evaluate("window.confirm = () => false")
    page.get_by_role("button", name="Cerrar sesión").click()
    assert_true(page.locator("#space-shell").is_visible(), "Logout did not respect unsaved-notes cancellation")
    page.evaluate("window.confirm = () => true")
    page.evaluate("""() => {
      document.querySelector('#space-patient-materials').textContent = 'EXPEDIENTE DE PRUEBA 123';
      document.querySelector('#space-shared-files').textContent = 'ARCHIVO FICTICIO 123';
    }""")
    def fail_logout(route):
        route.fulfill(status=503,content_type="application/json",body='{"error":"temporal"}')
    page.route("**/api/patient-portal/logout", fail_logout)
    page.get_by_role("button", name="Cerrar sesión").click()
    page.get_by_text("No hemos podido cerrar la sesión en el servidor").wait_for()
    assert_true(page.locator("#space-shell").is_visible(), "Failed logout falsely locked or claimed success")
    page.unroute("**/api/patient-portal/logout", fail_logout)
    page.get_by_role("button", name="Cerrar sesión").click()
    page.locator("#space-access:not([hidden])").wait_for()
    assert_true(page.locator("#space-session-check").is_hidden(), "Loading screen remained when password is required")
    assert_true(not page.locator("#space-patient-materials").inner_text(), "Clinical DOM not cleared after logout")
    assert_true(not page.locator("#space-shared-files").inner_text(), "Shared files not cleared after logout")
    assert_true(page.locator(".esapp-bottom-nav").get_attribute("hidden") is not None, "Locked account tabs visible")
    assert_true(page.locator("#space-shell").get_attribute("data-reading-size") == "normal", "Previous patient's reading preferences retained")
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
                    body='{"authenticated":true,"patient":{"first_name":"PRUEBA"},"materials":[{"id":"'+FAKE_ID+'","title":"Ejercicio inventado","status":"sent","patient_response_status":"empty","patient_document":{"material_type":"exercise","introduction":"Actividad solo de prueba","instructions":"Anota una frase ficticia","session_questions":["¿Qué puedes practicar?"]}}],"files":[]}')
            elif "/api/patient-portal/preferences" in path:
                route.fulfill(status=200,content_type="application/json",
                    body='{"storage_scope":"0123456789abcdef01234567"}')
            elif "/api/patient-portal/logout" in path:
                route.fulfill(status=200,content_type="application/json", body='{"ok":true}')
            else:
                route.fulfill(status=404,body="Not found")
        page.route("**/*",handle)
        test_authenticated(page,width)
        assert_true(not errors,"JavaScript errors: "+str(errors))
        context.close()
    browser.close()
print("All Entre Sesiones PWA navigation mobile smoke tests passed.")
