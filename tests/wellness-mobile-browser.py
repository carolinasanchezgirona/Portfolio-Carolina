"""Mobile browser regression of the actual Wellness UI module with synthetic data.

Run: python tests/wellness-mobile-browser.py
Browser: Chromium emulating Android touch at 360/390 px.
No patient authentication and no live patient records are used.
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "public/wellness-interactive.js").read_text(encoding="utf-8")
CSS = (ROOT / "app/mi-espacio/mi-espacio.css").read_text(encoding="utf-8")
OUTPUT = ROOT / "test-results" / "wellness-mobile"
OUTPUT.mkdir(parents=True, exist_ok=True)
HTML = """<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
* { box-sizing: border-box; }
html,body {margin:0; font-family: Arial, sans-serif; }
body { background:#f5f9fb; }
main {max-width:1060px; margin:auto; padding:18px 14px 50px}
</style></head><body><main class="space-page">
<section class="space-view wellness-experience" data-space-panel="wellness">
<h1 style="font-size:26px;color:#173a5e;">Wellness · pruebas de interacción</h1>
<section class="wellness-interactive-section">
<div class="wellness-section-title"><div><h3>Hazlo aquí, no solo lo leas.</h3></div></div>
<div id="wellness-interactive"><p class="wellness-interactive-loading">Preparando…</p></div>
</section></section></main></body></html>"""

def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)

def browser_path() -> str | None:
    return (shutil.which("google-chrome") or shutil.which("google-chrome-stable")
            or shutil.which("chromium") or shutil.which("chromium-browser"))

def test_mobile(p, width: int, height: int) -> None:
    launch = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
    executable = browser_path()
    if executable:
        launch["executable_path"] = executable
    browser = p.chromium.launch(**launch)
    context = browser.new_context(
        viewport={"width": width, "height": height},
        screen={"width": width, "height": height},
        device_scale_factor=3,
        is_mobile=True, has_touch=True, locale="es-ES")
    page = context.new_page()
    console_errors = []
    page.on("pageerror", lambda exc: console_errors.append(str(exc)))
    page.set_content(HTML)
    page.add_style_tag(content=CSS)
    page.evaluate("""() => {
        window.__wellnessEvents = [];
        document.addEventListener('wellness:interactive-completed', event => {
            window.__wellnessEvents.push(Object.keys(event.detail).sort());
            event.detail.saved = true; // fake persistence for UI-only tests
        });
    }""")
    page.add_script_tag(content=JS)
    check(page.locator(".wi-card").count() == 7, "Expected 7 interaction cards")
    check(page.locator(".wellness-interactive-loading").count() == 0, "Loader not removed")
    page.screenshot(path=str(OUTPUT / f"{width}-cards.png"), full_page=True)

    def open_card(title: str):
        card = page.locator(".wi-card").filter(has=page.locator("h4", has_text=title))
        check(card.count() == 1, f"Missing card: {title}")
        card.locator(".wi-open").tap()
        check(page.locator(".wi-workspace").is_visible(), "Workspace not visible")

    def close_card():
        page.locator(".wi-workspace-heading button", has_text="Cerrar").tap()
        check(page.locator(".wi-workspace").is_hidden(), "Workspace should close")

    open_card("¿Problema o posibilidad?")
    page.locator(".wi-choice", has_text="Sí, hay algo").tap()
    page.locator(".wi-field textarea").fill("Ejemplo ficticio: mirar la agenda")
    page.get_by_role("button", name="Terminar y registrar esta práctica").tap()
    check("registrada" in page.locator(".wi-finish-state").inner_text(), "Completion status missing")
    close_card()

    open_card("Mi energía, mi margen")
    page.get_by_role("button", name="3 de 5").tap()
    check(page.locator(".wi-energy-display span.filled").count() == 3, "Energy display incorrect")
    close_card()

    open_card("Ordenar la cabeza")
    page.locator(".wi-field textarea").fill("Primera tarea ficticia")
    page.get_by_role("button", name="Añadir asunto").tap()
    page.locator(".wi-field textarea").fill("Segunda tarea ficticia")
    page.get_by_role("button", name="Añadir asunto").tap()
    check(page.locator(".wi-entry").count() == 2, "Pending items missing")
    page.locator(".wi-entry").first.get_by_role("button", name="Puedo ocuparme de ello").tap()
    check(page.locator(".wi-entry.now").count() == 1, "Grouping failed")
    page.locator(".wi-entry").last.get_by_role("button", name="Eliminar").tap()
    check(page.locator(".wi-entry").count() == 1, "Removal failed")
    close_card()

    open_card("Cambiar de criterio")
    for text in ["Pera", "Música", "Sorpresa", "Nubes", "Lápiz", "Calma"]:
        page.get_by_role("button", name=text, exact=True).tap()
        page.get_by_role("button", name="Siguiente consigna").tap() if text != "Calma" else page.get_by_role("button", name="Finalizar práctica").tap()
    check("Has llegado al final" in page.locator(".wi-stage").inner_text(), "Cognitive rounds incomplete")
    close_card()

    open_card("Pon las ideas en orden")
    before = page.locator(".wi-sequence-select").all_text_contents()
    page.locator(".wi-sequence-select").first.tap()
    page.locator(".wi-sequence-select").nth(2).tap()
    after = page.locator(".wi-sequence-select").all_text_contents()
    check(before != after, "Tapping did not reorder")
    page.locator(".wi-sequence-item").first.get_by_role("button", name="Bajar").tap()
    check(page.locator(".wi-sequence-conclusion .wi-finish-state").count() == 1, "Completion area missing")
    page.screenshot(path=str(OUTPUT / f"{width}-sequence.png"), full_page=True)
    close_card()

    open_card("Encuentra la figura")
    page.screenshot(path=str(OUTPUT / f"{width}-visual.png"), full_page=True)
    def choose(predicate):
        board = page.locator(".wi-visual-board")
        matches = board.get_by_role("button").all()
        chosen = 0
        for cell in matches:
            if predicate(cell.get_attribute("aria-label") or ""):
                cell.tap()
                chosen += 1
        check(chosen > 0, "No valid pieces found")
        check(page.locator(".wi-visual-board [aria-pressed='true']").count() == chosen, "Pieces not selected")
    choose(lambda label: label.startswith("círculo "))
    page.get_by_role("button", name="Cambiar de consigna").tap()
    choose(lambda label: label.endswith(" coral"))
    page.get_by_role("button", name="Cambiar de consigna").tap()
    choose(lambda label: label == "triángulo azul")
    page.get_by_role("button", name="Finalizar exploración").tap()
    check("Has terminado" in page.locator(".wi-visual-stage").inner_text(), "Visual activity did not complete")
    close_card()

    open_card("Ordenar un momento")
    for k in range(4):
        page.locator(".wi-moment-stage textarea").fill(f"Texto ficticio {k+1}")
        page.get_by_role("button", name="Continuar" if k < 3 else "Ver mi resumen").tap()
    check(page.locator(".wi-moment-preview-item").count() == 4, "Four part summary missing")
    check("Texto ficticio 4" in page.locator(".wi-moment-preview").inner_text(), "Text not shown in transient summary")
    page.screenshot(path=str(OUTPUT / f"{width}-moment.png"), full_page=True)
    page.evaluate("document.dispatchEvent(new Event('wellness:interactive-reset'))")
    check(page.locator(".wi-workspace").is_hidden(), "Reset event did not hide workspace")
    check("Texto ficticio" not in page.locator("body").inner_text(), "Personal text survived reset")

    check(page.evaluate("() => document.documentElement.scrollWidth <= innerWidth + 1"), "Horizontal overflow at " + str(width))
    event_keys = page.evaluate("window.__wellnessEvents")
    check(event_keys == [["id", "saved"]], "Event leaked response fields: " + str(event_keys))
    check(not console_errors, "Browser JavaScript exceptions: " + str(console_errors))
    print(f"PASS mobile emulation {width}x{height}: seven activities, tap navigation, text discard, no overflow, {len(event_keys)} sanitized completion event")
    browser.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        test_mobile(p, 390, 844)
        test_mobile(p, 360, 780)
    print("All Wellness mobile browser tests passed.")
