import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import vm from "node:vm";

test("Word export produces a valid editable DOCX with protected identification", async () => {
  let blob, downloaded = false;
  const anchor = { remove() {}, click() { downloaded = true; }, href: "", download: "" };
  const browser = {
    window: {},
    document: { createElement(name) { assert.equal(name, "a"); return anchor; }, body: { append() {} } },
    URL: { createObjectURL(b) { blob = b; return "blob:mock"; }, revokeObjectURL() {} },
    Blob, TextEncoder, Date, setTimeout(cb) { cb(); },
  };
  vm.runInNewContext(readFileSync("public/clinic-word-export.js", "utf8"), browser);
  browser.window.ClinicWordExport.download({
    type: "evolution_health", title: "Informe clínico de evolución y seguimiento",
    identity: { name: "Paciente de prueba & sin datos reales", code: "TEST-001", birth: "1980-01-01" },
    period: "2026-01-01 a 2026-06-30", recipient: "Profesional sanitario",
    purpose: "Continuidad asistencial",
    professional: "Profesional ficticia", sections: {
      context: "Motivo documentado.", sources: "Sesiones aprobadas",
      interventions: "Intervención basada en registros.", integration: "",
      conclusions: "Conclusiones por revisar.", limitations: "Sin pruebas estandarizadas"
    },
  });
  assert.ok(downloaded, "should initiate download");
  assert.match(anchor.download, /\.docx$/);
  assert.ok(blob.size > 2500);
  assert.ok(browser.window.ClinicWordExport.legalTexts.confidentiality.includes("Ley 41/2002"));
  assert.ok(browser.window.ClinicWordExport.legalTexts.scope.includes("clínico-asistencial"));
  const folder = mkdtempSync(join(tmpdir(), "clinic-word-"));
  const filepath = join(folder, "test.docx");
  writeFileSync(filepath, Buffer.from(await blob.arrayBuffer()));
  const py = "import sys,zipfile,xml.etree.ElementTree as ET; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; files=['[Content_Types].xml','word/document.xml','word/styles.xml','word/settings.xml','word/footer1.xml','word/_rels/document.xml.rels']; [ET.fromstring(z.read(n)) for n in files]; ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}; root=ET.fromstring(z.read('word/document.xml')); txt=' '.join(n.text or '' for n in root.findall('.//w:t',ns)); assert 'TEST-001' in txt and 'Motivo documentado' in txt and 'BORRADOR' in txt and 'Ley 41/2002' in txt and 'Alcance clínico del informe' in txt and 'Firma: pendiente de firma profesional.' in txt and 'Paciente de prueba & sin datos reales' in txt; perms=root.findall('.//w:permStart',ns); assert len(perms)>=4; parent={ch:el for el in root.iter() for ch in el}; assert all(parent[p].tag.endswith('}p') for p in perms); settings=ET.fromstring(z.read('word/settings.xml')); assert settings.find('w:documentProtection',ns) is not None; assert root.find('.//w:footerReference',ns) is not None; footer=ET.fromstring(z.read('word/footer1.xml')); assert 'Documento clínico confidencial' in ''.join(n.text or '' for n in footer.findall('.//w:t',ns)); print('ZIP, XML, footer, legal clauses and protected edit ranges OK')";
  const run = spawnSync("python3", ["-c", py, filepath], { encoding: "utf8" });
  try { assert.equal(run.status, 0, run.stdout + run.stderr); }
  finally { rmSync(folder, { recursive: true, force: true }); }
});

test("clinical generator has independent Word, Save and Print actions", () => {
 const page = readFileSync("app/admin/clinica/page.tsx","utf8");
 const generator = readFileSync("public/admin-clinica.js","utf8");
 assert.match(page, /id="clinic-generate-report"/);
 assert.match(page, /id="clinic-save-report"/);
 assert.match(page, /id="clinic-print-report"/);
 assert.match(generator, /downloadHealthReportWord\(\)/);
 assert.match(generator, /persistReport\("draft"\)/);
 assert.match(generator, /ClinicReportPreparePrint/);
});

test("printed report includes the scope and confidentiality paragraphs", () => {
 const source = readFileSync("public/clinic-report-options.js","utf8");
 assert.match(source, /legalTexts/);
 assert.match(source, /Alcance clínico del informe/);
 assert.match(source, /Confidencialidad y protección de datos/);
 assert.match(source, /sectionsHtml\+legalHtml/);
});
