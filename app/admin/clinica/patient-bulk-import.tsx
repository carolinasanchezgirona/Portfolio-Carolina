"use client";

import { useRef, useState } from "react";

const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const REST_URL = `${SUPABASE_URL}/rest/v1`;
const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const SESSION_KEY = "dememoria_admin_session";

type ClinicSite = "arenys_1" | "arenys_2";
type CareContext = "creu_blava" | "combined";

type ImportRow = {
  rowId: string;
  selected: boolean;
  fullName: string;
  phone: string;
  insuranceProvider: string;
  externalSite: ClinicSite;
  careContext: CareContext;
  visitDate: string;
  visitTime: string;
  sourceFile: string;
  existingCode?: string;
};

type ExistingPatient = {
  public_code: string;
  full_name: string;
  phone: string | null;
};

type SessionData = { access_token?: string } | null;

const insurerPatterns = [
  { value: "AXA WINTERTHUR", pattern: /AXA\s+WINTERTHUR/i },
  { value: "ADESLAS", pattern: /ADESLAS/i },
  { value: "CIGNA", pattern: /CIGNA/i },
  { value: "FIATC", pattern: /FIATC/i },
];

function rowId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length > 9 ? digits.slice(-9) : digits;
}

function normalizeTime(value: string) {
  const match = value.trim().replace(/[.;]/g, ":").match(/^(\d{1,2}):([0-5]\d)$/);
  if (!match) return value;
  const hour = Number(match[1]);
  return hour <= 23 ? `${String(hour).padStart(2, "0")}:${match[2]}` : value;
}

function detectDate(text: string) {
  const match = text.match(/(?:FECHA\s*[:\-]?\s*)?\b([0-3]?\d)[/.\-]([01]?\d)[/.\-](20\d{2})\b/i);
  if (!match) return "";
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (candidate.getUTCFullYear() !== year || candidate.getUTCMonth() !== month - 1 || candidate.getUTCDate() !== day) return "";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function detectSite(text: string): ClinicSite | null {
  const header = text
    .toUpperCase()
    .replace(/[|!]/g, "I")
    .match(/ARENYS\s*[()\[]?\s*(II|I|2|1)\s*[)\]]?/);
  if (!header) return null;
  return header[1] === "II" || header[1] === "2" ? "arenys_2" : "arenys_1";
}

function parseAgendaText(text: string, sourceFile: string, fallbackSite: ClinicSite, fallbackDate: string) {
  const detectedSite = detectSite(text) || fallbackSite;
  const detectedDate = detectDate(text) || fallbackDate;
  const normalized = text.replace(/\r/g, "\n");
  const blocks = Array.from(
    normalized.matchAll(
      /(?:^|\n)\s*((?:[01]?\d|2[0-3])[:.;]\d{2})\s+([\s\S]*?)(?=\n\s*(?:[01]?\d|2[0-3])[:.;]\d{2}\s+|\n\s*TOTAL\b|$)/gi,
    ),
  );

  return blocks.flatMap<ImportRow>((match) => {
    const visitTime = normalizeTime(match[1] || "");
    const block = (match[2] || "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    const insurer = insurerPatterns.find((item) => item.pattern.test(block));
    if (!insurer) return [];

    const insurerIndex = block.search(insurer.pattern);
    const beforeInsurer = insurerIndex >= 0 ? block.slice(0, insurerIndex) : block;
    const phoneMatches = Array.from(beforeInsurer.matchAll(/(?<!\d)([6-9](?:[\s.-]?\d){8})(?!\d)/g));
    const phoneMatch = phoneMatches.at(-1);
    if (!phoneMatch?.[1]) return [];

    const phone = normalizePhone(phoneMatch[1]);
    const beforeNumbers = beforeInsurer.slice(0, phoneMatch.index).trim();
    const firstNumberIndex = beforeNumbers.search(/\d/);
    const printedName = (firstNumberIndex >= 0 ? beforeNumbers.slice(0, firstNumberIndex) : beforeNumbers)
      .toUpperCase()
      .replace(/[^A-ZÀ-ÖØ-ÝÑÇ,.'’\-\s]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^[^A-ZÀ-ÖØ-ÝÑÇ]+|[^A-ZÀ-ÖØ-ÝÑÇ]+$/g, "")
      .trim();

    if (!printedName || !printedName.includes(",") || phone.length !== 9) return [];

    return [{
      rowId: rowId(),
      selected: true,
      fullName: printedName,
      phone,
      insuranceProvider: insurer.value,
      externalSite: detectedSite,
      careContext: "creu_blava",
      visitDate: detectedDate,
      visitTime,
      sourceFile,
    }];
  });
}

function currentSession(): SessionData {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null") as SessionData;
  } catch {
    return null;
  }
}

function requestHeaders() {
  const session = currentSession();
  return {
    apikey: KEY,
    Authorization: `Bearer ${session?.access_token || ""}`,
    "Content-Type": "application/json",
  };
}

function mergeRows(rows: ImportRow[]) {
  const unique = new Map<string, ImportRow>();
  rows.forEach((row) => unique.set(
    [normalizePhone(row.phone), row.visitDate || "sin-fecha", row.visitTime, row.externalSite].join("|"),
    row,
  ));
  return Array.from(unique.values());
}

export default function PatientBulkImport() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fallbackSite, setFallbackSite] = useState<ClinicSite>("arenys_1");
  const [fallbackDate, setFallbackDate] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  function updateRow(id: string, patch: Partial<ImportRow>) {
    setRows((current) => current.map((row) => row.rowId === id ? { ...row, ...patch } : row));
  }

  async function addExistingCodes(parsedRows: ImportRow[]) {
    const response = await fetch(
      `${REST_URL}/clinical_patients?select=public_code,full_name,phone&order=created_at.asc`,
      { headers: requestHeaders(), cache: "no-store" },
    );
    if (!response.ok) return parsedRows;
    const existing = await response.json() as ExistingPatient[];
    const byPhone = new Map(existing.map((patient) => [normalizePhone(patient.phone || ""), patient]));
    return parsedRows.map((row) => ({
      ...row,
      existingCode: byPhone.get(normalizePhone(row.phone))?.public_code,
    }));
  }

  async function analyseFiles() {
    const files = Array.from(fileRef.current?.files || []);
    if (!files.length) {
      setMessage("Selecciona al menos una fotografía o un archivo de texto.");
      return;
    }

    setWorking(true);
    setProgress(0);
    setMessage("Preparando el reconocimiento local…");
    let worker: Awaited<ReturnType<(typeof import("tesseract.js"))["createWorker"]>> | null = null;
    const extracted: ImportRow[] = [];

    try {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length) {
        const { createWorker } = await import("tesseract.js");
        worker = await createWorker("eng", 1, {
          logger: (event) => {
            if (event.status !== "recognizing text" || typeof event.progress !== "number") return;
            setProgress(Math.round(event.progress * 100));
          },
        });
      }

      for (const [index, file] of files.entries()) {
        setMessage(`Leyendo ${file.name} (${index + 1} de ${files.length})…`);
        let text = "";
        if (file.type.startsWith("image/")) {
          if (!worker) throw new Error("No se ha podido iniciar el reconocimiento de texto.");
          const result = await worker.recognize(file, { rotateAuto: true });
          text = result.data.text;
        } else {
          text = await file.text();
        }
        extracted.push(...parseAgendaText(text, file.name, fallbackSite, fallbackDate));
      }

      const parsed = mergeRows(extracted);
      const withExisting = await addExistingCodes(parsed);
      setRows(withExisting);
      setMessage(withExisting.length
        ? `${withExisting.length} ficha(s) detectada(s). Revisa cada celda antes de confirmar.`
        : "No se han detectado filas completas. Puedes añadirlas manualmente sin guardar la fotografía.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se ha podido leer el documento.");
    } finally {
      if (worker) await worker.terminate();
      setWorking(false);
      setProgress(0);
    }
  }

  function addBlankRow() {
    setRows((current) => [...current, {
      rowId: rowId(),
      selected: true,
      fullName: "",
      phone: "",
      insuranceProvider: "",
      externalSite: fallbackSite,
      careContext: "creu_blava",
      visitDate: fallbackDate,
      visitTime: "",
      sourceFile: "Entrada manual",
    }]);
  }

  async function importRows() {
    const selectedRows = rows.filter((row) => row.selected);
    if (!selectedRows.length) {
      setMessage("Selecciona al menos una ficha para guardar.");
      return;
    }
    const invalid = selectedRows.find((row) =>
      !row.fullName.trim()
      || normalizePhone(row.phone).length !== 9
      || !row.insuranceProvider.trim()
      || !row.externalSite
      || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(row.visitTime),
    );
    if (invalid) {
      setMessage("Revisa las filas marcadas: nombre, teléfono de 9 cifras, mutua, centro y hora son obligatorios.");
      return;
    }

    setWorking(true);
    setMessage("Guardando el lote de forma segura…");
    try {
      const response = await fetch(`${REST_URL}/rpc/import_clinical_patient_batch`, {
        method: "POST",
        headers: requestHeaders(),
        body: JSON.stringify({
          p_rows: selectedRows.map((row) => ({
            full_name: row.fullName.trim(),
            phone: normalizePhone(row.phone),
            insurance_provider: row.insuranceProvider.trim().toUpperCase(),
            external_provider: "Creu Blava",
            external_site: row.externalSite,
            care_context: row.careContext,
            visit_date: row.visitDate || null,
            visit_time: row.visitTime,
          })),
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message || body?.hint || "No se ha podido guardar el lote.");
      const created = Array.isArray(body) ? body.filter((item) => item.import_action === "created").length : 0;
      const updated = Array.isArray(body) ? body.filter((item) => item.import_action === "updated").length : 0;
      setMessage(`Importación completada: ${created} ficha(s) creada(s) y ${updated} actualizada(s).`);
      setRows([]);
      if (fileRef.current) fileRef.current.value = "";
      document.querySelector<HTMLButtonElement>("#clinic-refresh")?.click();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se ha podido guardar el lote.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <>
      <button className="clinic-primary" type="button" onClick={() => dialogRef.current?.showModal()}>
        Importar fichas
      </button>
      <dialog ref={dialogRef} className="clinic-dialog clinic-import-dialog">
        <div className="clinic-dialog-content">
          <div className="clinic-dialog-heading">
            <div><p className="clinic-eyebrow">Alta por lotes</p><h2>Importar fichas de pacientes</h2></div>
            <button className="clinic-close" type="button" aria-label="Cerrar" onClick={() => dialogRef.current?.close()}>×</button>
          </div>

          <div className="clinic-import-privacy" role="note">
            <strong>Reconocimiento local y revisión obligatoria</strong>
            <span>La imagen no se sube ni se conserva. Se guardan nombre, teléfono, mutua, centro, fecha y hora. Se descartan la historia externa, el motivo y las anotaciones manuscritas. El número de paciente lo genera Dememoria.</span>
          </div>

          <div className="clinic-import-controls">
            <label className="clinic-import-file">Fotografías o texto
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,.txt,.csv,.tsv" multiple />
            </label>
            <label>Sede si no se detecta
              <select value={fallbackSite} onChange={(event) => setFallbackSite(event.target.value as ClinicSite)}>
                <option value="arenys_1">Arenys 1</option>
                <option value="arenys_2">Arenys 2</option>
              </select>
            </label>
            <label>Fecha de la hoja
              <input type="date" value={fallbackDate} onChange={(event) => setFallbackDate(event.target.value)} />
              <span>Déjala vacía si no aparece impresa.</span>
            </label>
            <button className="clinic-secondary" type="button" disabled={working} onClick={analyseFiles}>
              {working ? "Leyendo…" : "Leer documentos"}
            </button>
          </div>

          {progress > 0 && <progress className="clinic-import-progress" max={100} value={progress}>{progress}%</progress>}
          <p className="clinic-message clinic-import-message" role="status" aria-live="polite">{message}</p>

          {rows.length > 0 && (
            <div className="clinic-import-table-wrap">
              <table className="clinic-import-table">
                <thead><tr><th>Guardar</th><th>Nombre impreso</th><th>Teléfono</th><th>Mutua</th><th>Centro</th><th>Fecha</th><th>Hora</th><th>Circuito</th><th>N.º Dememoria</th><th /></tr></thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.rowId}>
                      <td><input type="checkbox" checked={row.selected} aria-label={`Guardar ${row.fullName || "fila"}`} onChange={(event) => updateRow(row.rowId, { selected: event.target.checked })} /></td>
                      <td><input value={row.fullName} aria-label="Nombre impreso" onChange={(event) => updateRow(row.rowId, { fullName: event.target.value })} /></td>
                      <td><input inputMode="tel" value={row.phone} aria-label="Teléfono" onChange={(event) => updateRow(row.rowId, { phone: normalizePhone(event.target.value), existingCode: undefined })} /></td>
                      <td><input value={row.insuranceProvider} aria-label="Mutua" onChange={(event) => updateRow(row.rowId, { insuranceProvider: event.target.value })} /></td>
                      <td><select value={row.externalSite} aria-label="Sede" onChange={(event) => updateRow(row.rowId, { externalSite: event.target.value as ClinicSite })}><option value="arenys_1">Arenys 1</option><option value="arenys_2">Arenys 2</option></select></td>
                      <td><input type="date" value={row.visitDate} aria-label="Fecha de visita" onChange={(event) => updateRow(row.rowId, { visitDate: event.target.value })} /></td>
                      <td><input type="time" value={row.visitTime} aria-label="Hora de visita" onChange={(event) => updateRow(row.rowId, { visitTime: event.target.value })} /></td>
                      <td><select value={row.careContext} aria-label="Circuito asistencial" onChange={(event) => updateRow(row.rowId, { careContext: event.target.value as CareContext })}><option value="creu_blava">Creu Blava</option><option value="combined">Consulta + Creu Blava</option></select></td>
                      <td><span className={row.existingCode ? "clinic-import-existing" : "clinic-import-new"}>{row.existingCode ? `Mantiene ${row.existingCode}` : "Código nuevo"}</span></td>
                      <td><button className="clinic-text" type="button" aria-label={`Quitar ${row.fullName || "fila"}`} onClick={() => setRows((current) => current.filter((item) => item.rowId !== row.rowId))}>Quitar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="clinic-import-actions">
            <button className="clinic-secondary" type="button" onClick={addBlankRow}>Añadir fila</button>
            <div>
              <button className="clinic-text" type="button" onClick={() => dialogRef.current?.close()}>Cancelar</button>
              <button className="clinic-primary" type="button" disabled={working || !rows.some((row) => row.selected)} onClick={importRows}>Confirmar importación</button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
