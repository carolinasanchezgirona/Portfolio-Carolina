"""End-to-end browser test of the exported Entre Sesiones mood evolution chart.

Uses the real compiled React page, but all session/profile responses and mood
records are fictional and intercepted locally. It never contacts patient APIs.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from zoneinfo import ZoneInfo
import json
import shutil

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "out"
SCOPE = "0123456789abcdef01234567"


def check(value, message):
    if not value:
        raise AssertionError(message)


def launch_options():
    settings = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
    executable = (shutil.which("google-chrome") or shutil.which("google-chrome-stable")
                  or shutil.which("chromium") or shutil.which("chromium-browser"))
    if executable:
        settings["executable_path"] = executable
    return settings


def run_browser(base):
    date = datetime.now(ZoneInfo("Europe/Madrid")).date()
    # Three invented days in a fortnight: two consecutive, one isolated.
    entries = [
        {"date": (date-timedelta(days=9)).isoformat(), "rating": 2, "energy": 3, "energy_scale": 5},
        {"date": (date-timedelta(days=8)).isoformat(), "rating": 4, "energy": 1, "energy_scale": 5},
        {"date": date.isoformat(), "rating": 5, "energy": 1, "energy_scale": 5},
    ]
    scope_key = "wellness_mood_checkins_v1:" + SCOPE
    with sync_playwright() as p:
        browser = p.chromium.launch(**launch_options())
        for width in (360, 390):
            context = browser.new_context(viewport={"width": width, "height": 800},
                device_scale_factor=2, is_mobile=True, has_touch=True,
                locale="es-ES", timezone_id="Europe/Madrid")
            context.add_init_script(
                "localStorage.setItem(" + json.dumps(scope_key) + ", " +
                json.dumps(json.dumps(entries, ensure_ascii=False)) + ");")
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
                        "storage_scope": SCOPE, "avatar_id": "adult-woman"
                    }))
                elif "/api/" in url:
                    route.fulfill(status=401, content_type="application/json", body='{"error":"ficticio"}')
                else:
                    route.continue_()

            page.route("**/api/**", intercept)
            page.goto(base + "/entre-sesiones/app/espacio/?vista=wellness",
                      wait_until="domcontentloaded", timeout=30000)
            page.locator(".mood-evolution-scroll svg").wait_for(timeout=20000)
            page.locator(".mood-chart-point").first.wait_for()
            check(page.locator(".mood-periods button[aria-pressed=true]").inner_text() == "14 días",
                  "Default period does not show the scattered fortnight")

            plot = page.locator(".mood-evolution-scroll")
            # ResizeObserver commits the physical mobile width on the next frame.
            page.wait_for_function("""() => {
                const el = document.querySelector('.mood-evolution-scroll');
                const svg = el?.querySelector('svg');
                return el && svg && svg.getBoundingClientRect().width <= el.clientWidth + 2;
            }""", timeout=6000)
            check(page.locator(".mood-chart-point").count() == 3,
                  "Three synthetic non-daily mood records were not plotted")
            # Only 9 and 8 days ago are consecutive; today remains an isolated point.
            check(page.locator(".mood-evolution-scroll polyline").count() == 2,
                  "Lines should connect only consecutive dates without inventing gaps")
            rects = page.evaluate("""() => {
              const viewport = document.querySelector('.mood-evolution-scroll').getBoundingClientRect();
              const points = [...document.querySelectorAll('.mood-chart-point')].map(node => {
                const marker = node.querySelector('circle[stroke="#078e88"]');
                const shape = marker || node.querySelector('circle');
                const rect = shape.getBoundingClientRect();
                return { left: rect.left, right: rect.right, width: rect.width };
              });
              return {
                left: viewport.left, right: viewport.right,
                scrollWidth: document.querySelector('.mood-evolution-scroll').scrollWidth,
                clientWidth: document.querySelector('.mood-evolution-scroll').clientWidth,
                points
              };
            }""")
            check(rects["scrollWidth"] <= rects["clientWidth"]+2,
                  "Fortnight chart still clips values behind horizontal scrolling")
            check(all(point["width"] >= 8 and point["left"] >= rects["left"]-2 and
                      point["right"] <= rects["right"]+2 for point in rects["points"]),
                  "Mood dot is off-screen or too small on mobile: " + str(rects))
            check(not errors, "Compiled React page errors: " + str(errors))
            print(f"PASS {width}px: scattered records visible without horizontal scroll; "
                  "2 distinct day-series and isolated point, no API data")

            page.get_by_role("button", name="7 días").click()
            check(page.locator(".mood-chart-point").count() == 1,
                  "Single-day week should show one standalone mood dot")
            check(page.locator(".mood-evolution-scroll polyline").count() == 0,
                  "Single isolated day falsely connected to an empty date")
            print(f"PASS {width}px: one check-in remains visible as a dot without a fictional line")

            page.get_by_role("button", name="30 días").click()
            page.wait_for_function(
                "() => {const el=document.querySelector('.mood-evolution-scroll'); return el.scrollLeft > 0;}",
                timeout=5000)
            check(page.locator(".mood-chart-point").count() == 3,
                  "Switching to 30 days dropped valid check-ins")
            print(f"PASS {width}px: 30-day chart starts with latest dates visible")
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
    print("PASS mood chart: no patient data accessed.")
