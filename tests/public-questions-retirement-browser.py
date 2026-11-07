"""Check that retired public pages stay unavailable and public pages load cleanly."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"
RETIRED = ("/pregunta-a-carolina/", "/podcast/", "/podcast/salir-del-ruido/")
PAGES = ["/", "/psicologia/", "/neuropsicologia/", "/recursos/", "/sobre-mi/", "/evaluacion-tdah-adultos/"]

def check(value, message):
    if not value:
        raise AssertionError(message)

def check_export():
    sitemap = OUT / "sitemap.xml"
    check(sitemap.is_file(), "Missing sitemap.xml")
    sitemap_xml = sitemap.read_text("utf-8")
    check(all(path not in sitemap_xml for path in RETIRED), "Retired page still appears in sitemap")
    offenders = []
    for f in OUT.rglob("*.html"):
        relative = f.relative_to(OUT)
        if relative.parts[0] in ("admin", "entre-sesiones", "mi-espacio"):
            continue
        html = f.read_text("utf-8")
        if any(path in html for path in RETIRED):
            offenders.append(str(relative))
    check(not offenders, "Public pages still link to removed page: " + str(offenders))
    print("PASS: all exported public HTML and sitemap exclude old URL")

def browser_check(base):
    with sync_playwright() as p:
        opts = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
        executable = shutil.which("google-chrome") or shutil.which("google-chrome-stable") or shutil.which("chromium")
        if executable:
            opts["executable_path"] = executable
        browser = p.chromium.launch(**opts)
        try:
            for width in (390, 1365):
                context = browser.new_context(viewport={"width": width, "height": 850}, locale="es-ES")
                try:
                    page = context.new_page()
                    errors = []
                    page.on("pageerror", lambda e: errors.append(str(e)))
                    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                    for path in PAGES:
                        errors.clear()
                        response = page.goto(base + path, wait_until="domcontentloaded", timeout=25000)
                        check(response and response.status == 200, "Public page failed: " + path)
                        page.wait_for_timeout(350)
                        check(page.locator("a[href*='pregunta-a-carolina'], a[href*='/podcast/']").count() == 0,
                              "Retired link reappears on " + path)
                        check(not errors, "Browser console errors on " + path + ": " + str(errors))
                    print(f"PASS: {width}px, {len(PAGES)} pages without stale links or console errors")
                finally:
                    context.close()
            page = browser.new_page()
            for path in RETIRED:
                response = page.goto(base + path, wait_until="domcontentloaded")
                check(response and response.status == 404, "Retired URL must return HTTP 404: " + path)
            print("PASS: all retired URLs respond with HTTP 404")
        finally:
            browser.close()

if __name__ == "__main__":
    check_export()
    server = ThreadingHTTPServer(("127.0.0.1", 0),
        partial(SimpleHTTPRequestHandler, directory=str(OUT)))
    Thread(target=server.serve_forever, daemon=True).start()
    try:
        browser_check("http://127.0.0.1:" + str(server.server_address[1]))
    finally:
        server.shutdown()
        server.server_close()
