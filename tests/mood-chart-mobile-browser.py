"""Mobile browser regression for Entre Sesiones after retiring the Wellness tab.

Loads the exported patient portal with fictional, intercepted responses. Verifies
that an old Wellness URL safely resolves to Today and that the current patient
navigation works on narrow screens without accessing real patient APIs.
"""
from __future__ import annotations

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
import shutil

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "out"


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def launch_options():
    settings = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
    executable = (shutil.which("google-chrome") or shutil.which("google-chrome-stable")
                  or shutil.which("chromium") or shutil.which("chromium-browser"))
    if executable:
        settings["executable_path"] = executable
    return settings


def run_browser(base):
    with sync_playwright() as p:
        browser = p.chromium.launch(**launch_options())
        for width in (360, 390):
            context = browser.new_context(
                viewport={"width": width, "height": 800},
                device_scale_factor=2, is_mobile=True, has_touch=True,
                locale="es-ES", timezone_id="Europe/Madrid",
            )
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))

            def intercept(route):
                url = route.request.url
                if "/api/patient-portal/session" in url:
                    route.fulfill(status=200, content_type="application/json", body=json.dumps({
                        "authenticated": True, "patient": {"first_name": "PACIENTE DE PRUEBA"},
                        "materials": [], "files": [], "next_appointment": None,
                    }))
                elif "/api/patient-portal/preferences" in url:
                    route.fulfill(status=200, content_type="application/json", body=json.dumps({
                        "storage_scope": "0123456789abcdef01234567", "avatar_id": "adult-woman"
                    }))
                elif "/api/" in url:
                    route.fulfill(status=401, content_type="application/json", body='{"error":"ficticio"}')
                else:
                    route.continue_()

            page.route("**/api/**", intercept)
            page.goto(base + "/entre-sesiones/app/espacio/?vista=wellness",
                      wait_until="domcontentloaded", timeout=30000)
            page.locator("#space-shell").wait_for(state="visible", timeout=20000)

            check(page.locator('[data-space-panel="today"]').is_visible(),
                  "Legacy Wellness URL must fall back to the Today view")
            check(page.locator('[data-space-panel="wellness"]').count() == 0,
                  "Retired Wellness panel is still part of the patient UI")
            check(page.locator("#wellness-interactive").count() == 0,
                  "Retired interactive Wellness tools are still visible")
            nav = page.locator(".esapp-bottom-nav")
            nav.wait_for(state="visible", timeout=10000)
            check(nav.locator("a").count() == 3,
                  "Mobile patient navigation must have only Inicio, Mi terapia and Cuenta")

            nav.locator('a[href*="vista=terapia"]').click()
            page.locator('[data-space-panel="therapy"]').wait_for(state="visible", timeout=5000)
            nav.locator('a[href*="vista=configuracion"]').click()
            page.locator('[data-space-panel="account"]').wait_for(state="visible", timeout=5000)

            check(not errors, "Compiled portal JavaScript errors: " + str(errors))
            print(f"PASS {width}px: retired Wellness URL falls back to Today; "
                  "three-tab mobile navigation works with fictional patient data")
            context.close()
        browser.close()


if __name__ == "__main__":
    check((OUTPUT / "entre-sesiones" / "app" / "espacio" / "index.html").is_file(),
          "Build the static site first: npm run build")
    Handler = partial(SimpleHTTPRequestHandler, directory=str(OUTPUT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        run_browser("http://127.0.0.1:" + str(server.server_address[1]))
    finally:
        server.shutdown()
        server.server_close()
    print("PASS patient mobile navigation: no real patient API data accessed.")
