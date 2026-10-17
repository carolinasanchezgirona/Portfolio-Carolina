"""Regression de peticiones retrasadas con datos clínicos 100 % ficticios.

Ejecuta el script real de Mi espacio en Chromium con todas las API simuladas.
No utiliza cuentas ni fichas reales y nunca solicita datos sanitarios.
"""
from pathlib import Path
import json
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "public/mi-espacio.js").read_text(encoding="utf-8")
MOCK_SOURCE = (ROOT / "tests/entre-sesiones-spa-mobile.py").read_text(encoding="utf-8")
HTML = MOCK_SOURCE.split('HTML = """', 1)[1].split('"""', 1)[0]
HTML = HTML.replace("<h1>Hoy</h1>", '<h1 id="space-today-title">Hoy</h1>')
FAKE_ID = "aabbccdd-0011-4222-8333-445566778899"
BASE = "https://entre-sesiones-navigation.test"
APP = "/entre-sesiones/app/espacio/"
DATA = {
    "authenticated": True,
    "patient": {"first_name": "PRUEBA"},
    "materials": [{
        "id": FAKE_ID, "title": "Ejercicio completamente ficticio",
        "status": "sent", "patient_response_status": "empty",
        "patient_document": {
            "material_type": "exercise",
            "instructions": "Escribe datos inventados.",
            "session_questions": ["¿Qué quieres practicar, de manera ficticia?"],
        },
    }],
    "files": [],
}

def check(condition, message):
    if not condition:
        raise AssertionError(message)

with sync_playwright() as p:
    executable = (shutil.which("google-chrome") or shutil.which("google-chrome-stable")
                  or shutil.which("chromium") or shutil.which("chromium-browser"))
    launch = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
    if executable:
        launch["executable_path"] = executable
    browser = p.chromium.launch(**launch)
    for width in (360, 390):
        ctx = browser.new_context(viewport={"width": width, "height": 800},
                                  is_mobile=True, has_touch=True, locale="es-ES",
                                  device_scale_factor=2)
        page = ctx.new_page()
        failures = []
        posted_actions = []
        page.on("pageerror", lambda err: failures.append(str(err)))

        def route(request):
            url = request.request.url
            if url.startswith(BASE + APP):
                request.fulfill(status=200, content_type="text/html", body=HTML)
            elif "/api/patient-portal/session" in url:
                request.fulfill(status=200, content_type="application/json", body=json.dumps(DATA))
            elif "/api/patient-portal/preferences" in url:
                request.fulfill(status=200, content_type="application/json",
                                body='{"storage_scope":"0123456789abcdef01234567"}')
            elif "/api/patient-portal/logout" in url:
                request.fulfill(status=200, content_type="application/json", body='{"ok":true}')
            elif "/api/patient-portal/response" in url:
                posted_actions.append(json.loads(request.request.post_data or "{}").get("action"))
                request.fulfill(status=200, content_type="application/json",
                                body='{"ok":true,"status":"shared","saved_at":"2026-10-17T18:00:00Z"}')
            else:
                request.fulfill(status=404, body="Not found")
        page.route("**/*", route)
        page.goto(BASE + APP + "?vista=terapia")
        page.evaluate("""() => {
          const nativeFetch = window.fetch.bind(window);
          window.__releaseStaleSession = null;
          let holdFirst = true;
          window.fetch = (input, options) => {
            if (String(input).includes('/api/patient-portal/session') && holdFirst) {
              holdFirst = false;
              return new Promise(resolve => {
                window.__releaseStaleSession = () => resolve(new Response(JSON.stringify({
                  authenticated: true,
                  patient: { first_name: 'OTRA CUENTA FICTICIA' },
                  materials: [],
                  files: []
                }), { status: 200, headers: { 'Content-Type':'application/json' } }));
              });
            }
            return nativeFetch(input, options);
          };
        }""")
        page.add_script_tag(content=JS)
        page.wait_for_function("window.__releaseStaleSession !== null")
        # Restoration from browser history supersedes the still-pending old session.
        page.evaluate("""() => {
            window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
        }""")
        page.locator("#space-shell:not([hidden])").wait_for()
        check(page.locator("#space-today-title").inner_text() == "Hola, PRUEBA",
              "The current session was not rendered")
        page.evaluate("window.__releaseStaleSession()")
        page.wait_for_timeout(125)
        check(page.locator("#space-today-title").inner_text() == "Hola, PRUEBA",
              "Old session response replaced the new patient's name")
        check(page.locator(".space-patient-material").count() == 1,
              "Old session response erased current patient's exercises")

        # A deliberate 'Share' click must still require separate confirmation.
        page.evaluate("window.confirm = () => false")
        page.get_by_role("button", name="Compartir respuestas con Carolina").click()
        check(posted_actions == [], "Sharing occurred even though the patient cancelled")
        page.evaluate("window.confirm = () => true")
        page.get_by_role("button", name="Compartir respuestas con Carolina").click()
        page.get_by_text("Respuestas compartidas con Carolina.", exact=True).wait_for()
        check(posted_actions == ["share"], "Approved sharing did not use exactly one request")

        # Now hold a clinical save until after logout, then deliver its late result.
        page.evaluate("""() => {
          const nativeFetch = window.fetch.bind(window);
          window.__releaseStaleSave = null;
          window.fetch = (input, options) => {
            if (String(input).includes('/api/patient-portal/response')) {
              return new Promise(resolve => {
                window.__releaseStaleSave = () => resolve(new Response(JSON.stringify({
                  ok:true, status:'draft', saved_at:'2026-10-17T18:01:00Z'
                }), { status:200, headers:{'Content-Type':'application/json'} }));
              });
            }
            return nativeFetch(input, options);
          };
        }""")
        page.locator("[data-response-record]").fill("Texto ficticio aún pendiente")
        page.get_by_role("button", name="Guardar borrador").click()
        page.wait_for_function("window.__releaseStaleSave !== null")
        page.locator('[data-space-view="account"]').click()
        page.get_by_role("button", name="Cerrar sesión").click()
        page.wait_for_function("document.querySelector('#space-shell').hidden === true")
        check(page.locator("#space-patient-materials").inner_text() == "",
              "Clinical form remained in DOM after logout")
        page.evaluate("window.__releaseStaleSave()")
        page.wait_for_timeout(125)
        check(page.locator("#space-patient-materials").inner_text() == "",
              "Late save response restored a clinical form after logout")
        check(page.locator("#space-access").is_visible(),
              "Late response bypassed the authentication screen")
        check(not failures, "Browser errors: " + str(failures))
        print(f"PASS {width}px: superseded session ignored, voluntary share confirmed, late save hidden after logout")
        ctx.close()
    browser.close()
print("All stale-session and stale-save protections passed with synthetic patients.")
