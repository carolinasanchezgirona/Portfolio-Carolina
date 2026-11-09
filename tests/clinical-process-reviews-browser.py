"""Browser regression with synthetic data only, no real credentials or patient records.

Loads the actual public/clinic-process-reviews.js in Chromium. All API requests
are mocked in the page, so the test does not contact Supabase.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent
APP_SCRIPT = ROOT / "public" / "clinic-process-reviews.js"

PAGE = """<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body>
<section id="clinic-patient-dialog" hidden>
 <form id="clinic-patient-form">
   <input id="clinic-patient-id" type="hidden">
   <section class="clinic-goals-manager"></section>
   <button id="clinic-new-report" type="button">Nuevo informe</button>
 </form>
</section>
<dialog id="clinic-report-dialog">
 <select id="clinic-report-type"><option value="evolution_health">Evolución</option><option value="clinical_summary">Resumen clínico</option></select>
 <input id="clinic-report-recipient">
 <input id="clinic-report-start" type="date">
 <input id="clinic-report-end" type="date">
 <textarea id="clinic-report-context"></textarea>
 <textarea id="clinic-report-evolution"></textarea>
 <textarea id="clinic-report-interventions"></textarea>
 <textarea id="clinic-report-current"></textarea>
 <input id="clinic-report-purpose">
 <p id="clinic-report-message"></p>
</dialog>
</body></html>"""

MOCK = """
(() => {
  window.__reviewStore = [];
  window.__reviewWrites = [];
  window.__unexpectedFetches = [];
  sessionStorage.setItem("dememoria_admin_session",
    JSON.stringify({access_token:"synthetic-e2e-token-not-a-real-credential"}));
  const reportDialog = document.getElementById("clinic-report-dialog");
  document.getElementById("clinic-new-report").addEventListener("click", () => {
    if (!reportDialog.open) reportDialog.show();
  });
  let nextId = 1;
  window.fetch = async (raw, opts = {}) => {
    if (!String(raw).includes("clinical_process_reviews")) {
      window.__unexpectedFetches.push(String(raw));
      throw new Error("Unexpected network request, test refuses external access");
    }
    const url = new URL(raw);
    const patientId = (url.searchParams.get("patient_id") || "").replace(/^eq\\./,"");
    const reviewId = (url.searchParams.get("id") || "").replace(/^eq\\./,"");
    const method = (opts.method || "GET").toUpperCase();
    let records = [];
    if (method === "GET") {
      records = window.__reviewStore.filter(r => r.patient_id === patientId);
    } else if (method === "POST") {
      const data = JSON.parse(opts.body || "{}");
      const row = { ...data, id:"synthetic-review-" + nextId++,
        created_at:"2026-11-09T12:00:00.000Z" };
      window.__reviewStore.push(row);
      window.__reviewWrites.push({method,row});
      records = [row];
    } else if (method === "PATCH") {
      const data = JSON.parse(opts.body || "{}");
      const row = window.__reviewStore.find(r =>
        r.id === reviewId && r.patient_id === patientId);
      if (row) { Object.assign(row,data); records=[{...row}]; }
      window.__reviewWrites.push({method,patientId,reviewId,keys:Object.keys(data)});
    } else {
      throw new Error("Unexpected method");
    }
    return new Response(JSON.stringify(records), {
      status:200,headers:{"Content-Type":"application/json"}
    });
  };
})();
"""

PATIENT_A = "bce4a4d0-0000-4000-8000-000000000001"
PATIENT_B = "bce4a4d0-0000-4000-8000-000000000002"


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            page = browser.new_page(viewport={"width": 900, "height": 800})
            page.route("**/*", lambda route: route.fulfill(
                status=200, body=PAGE, content_type="text/html"))
            page.goto("https://synthetic-clinic.invalid/")
            page.evaluate(MOCK)
            page.add_script_tag(path=str(APP_SCRIPT))

            # Open patient A and verify that no review exists by default.
            page.evaluate("""patient => {
              document.getElementById("clinic-patient-id").value = patient;
              document.getElementById("clinic-patient-dialog").hidden = false;
            }""", PATIENT_A)
            expect(page.locator("#clinic-review-list")).to_contain_text(
                "No hay revisiones registradas")

            # Create a review with content across clinical domains.
            page.get_by_role("button", name="Nueva revisión").click()
            expect(page.locator("#clinic-review-dialog")).to_have_attribute("open", "")
            page.locator("#clinic-review-kind").select_option("closing")
            page.locator("#clinic-review-date").fill("2026-11-09")
            page.locator("#clinic-review-goals").fill("Objetivo sintético revisado")
            page.locator("#clinic-review-symptoms").fill("Cambio sintomático ficticio")
            page.locator("#clinic-review-functioning").fill("Actividad cotidiana sintética")
            page.locator("#clinic-review-perspective").fill("Perspectiva expresada ficticia")
            page.locator("#clinic-review-measures").fill("Sin medidas estandarizadas")
            page.locator("#clinic-review-strategies").fill("Intervención de prueba")
            page.locator("#clinic-review-assessment").fill("Valoración clínica sintética")
            page.locator("#clinic-review-next").fill("Seguimiento de prueba")
            page.locator("#clinic-review-maintenance").fill("Plan de mantenimiento ficticio")
            page.locator('#clinic-review-form button[type="submit"]').click()
            expect(page.locator("#clinic-review-list")).to_contain_text(
                "Valoración clínica sintética")
            assert page.evaluate("window.__reviewStore.length") == 1
            assert page.evaluate("window.__reviewWrites[0].method") == "POST"

            # Reload from the mocked server, edit an existing record, avoid duplicates.
            page.get_by_role("button", name="Consultar / editar").click()
            expect(page.locator("#clinic-review-perspective")).to_have_value(
                "Perspectiva expresada ficticia")
            page.locator("#clinic-review-perspective").fill("Perspectiva sintética revisada")
            page.locator('#clinic-review-form button[type="submit"]').click()
            expect(page.locator("#clinic-review-list")).to_contain_text(
                "Valoración clínica sintética")
            assert page.evaluate("window.__reviewStore.length") == 1
            assert page.evaluate("window.__reviewWrites.at(-1).method") == "PATCH"

            # Consolidation uses the existing editor and remains a draft.
            page.get_by_role("button", name="Preparar documento de consolidación").click()
            expect(page.locator("#clinic-report-dialog")).to_have_attribute("open", "")
            expect(page.locator("#clinic-report-type")).to_have_value("clinical_summary")
            expect(page.locator("#clinic-report-evolution")).to_have_value(
                "Perspectiva sintética revisada")
            expect(page.locator("#clinic-report-current")).to_have_value(
                "Plan de mantenimiento ficticio")
            expect(page.locator("#clinic-report-purpose")).to_have_value(
                "Resumen asistencial de revisión, consolidación y continuidad")
            assert page.evaluate("window.__reviewStore.length") == 1
            assert page.evaluate("window.__unexpectedFetches.length") == 0

            # Close A, open B. Private A data must not leak into B.
            page.locator("#clinic-report-dialog").evaluate("(el) => el.close()")
            page.evaluate("""patient => {
              const dialog = document.getElementById("clinic-patient-dialog");
              dialog.hidden = true;
              document.getElementById("clinic-patient-id").value = patient;
            }""", PATIENT_B)
            page.evaluate("""() => {
              document.getElementById("clinic-patient-dialog").hidden = false;
            }""")
            expect(page.locator("#clinic-review-list")).to_contain_text(
                "No hay revisiones registradas")
            assert page.evaluate("window.__reviewStore.length") == 1
            print("PASS: synthetic review create, retrieve, update, draft and patient separation")
        finally:
            browser.close()


if __name__ == "__main__":
    run()
