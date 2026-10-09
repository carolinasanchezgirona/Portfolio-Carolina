(() => {
  "use strict";
  const SUPA = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const SESSION_KEY = "dememoria_admin_session";
  const $ = (s) => document.querySelector(s);
  const currency = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
  const dateFormat = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeZone: "Europe/Madrid" });
  const today = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const money = (cents) => currency.format(Number(cents || 0) / 100);
  const cents = (value) => Math.round(Number(value) * 100);
  const statusEl = $("#econ-status");
  const contents = $("#econ-content");
  let session;
  let issuer = null, patients = [], bookings = [], invoices = [], receipts = [], expenses = [];
  let editingInvoice = null;

  function setStatus(message) { statusEl.textContent = message || ""; }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function btn(label, cls, action) {
    const b = el("button", cls, label);
    b.type = "button";
    b.addEventListener("click", () => {
      try { const result = action(b); if (result && typeof result.catch === "function") result.catch(error => setStatus(error.message)); }
      catch (error) { setStatus(error.message); }
    });
    return b;
  }
  function fmtDate(value) { return value ? dateFormat.format(new Date(value.includes("T") ? value : value + "T12:00:00Z")) : ""; }
  function fmtInputEuros(value) { return (Number(value || 0) / 100).toFixed(2); }
  function requirePositiveCents(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(Math.round(amount * 100)) || !/^\d+(\.\d{1,2})?$/.test(String(value))) {
      throw new Error("Introduce un importe positivo con un máximo de dos decimales.");
    }
    return cents(amount);
  }
  async function rest(path, options = {}) {
    if (!session?.access_token) throw new Error("Necesitas iniciar sesión en Gestión clínica.");
    const response = await fetch(SUPA + "/rest/v1/" + path, {
      cache: "no-store",
      ...options,
      headers: {
        apikey: KEY,
        Authorization: "Bearer " + session.access_token,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (response.status === 401) {
      $("#econ-content").hidden = true;
      $("#econ-access").hidden = false;
      throw new Error("Tu sesión ha caducado. Vuelve a identificarte.");
    }
    if (!response.ok) throw new Error(body?.message || body?.hint || body?.error || "No se ha podido realizar la operación.");
    return body;
  }
  async function load() {
    setStatus("Actualizando datos económicos…");
    const data = await Promise.all([
      rest("billing_issuer_settings?select=*&id=eq.1"),
      rest("billing_invoices?select=*&order=created_at.desc&limit=1000"),
      rest("billing_receipts?select=*&order=paid_date.desc&limit=1000"),
      rest("billing_expenses?select=*&order=expense_date.desc&limit=1000"),
      rest("clinical_patients?select=id,full_name,national_id,address,care_context,status&order=full_name.asc&limit=1000"),
      rest("appointment_bookings?select=id,clinical_patient_id,starts_at,price_eur,service_code,status&order=starts_at.desc&limit=1000"),
    ]);
    issuer = data[0]?.[0] || null;
    invoices = data[1] || [];
    receipts = data[2] || [];
    expenses = data[3] || [];
    patients = data[4] || [];
    bookings = data[5] || [];
    renderAll();
    setStatus("");
  }
  function showTab(tab) {
    document.querySelectorAll("[data-econ-tab]").forEach((b) => b.classList.toggle("active", b.dataset.econTab === tab));
    document.querySelectorAll("[data-econ-panel]").forEach((section) => { section.hidden = section.dataset.econPanel !== tab; });
  }
  function fillPatients() {
    const select = $("#econ-invoice-patient"), previous = select.value;
    select.replaceChildren(new Option("Seleccionar paciente", ""));
    patients.filter(p => p.status !== "archived" && p.care_context !== "creu_blava")
      .forEach(p => select.add(new Option(p.full_name, p.id)));
    if (patients.some(p => p.id === previous)) select.value = previous;
  }
  function fillBookings(patientId) {
    const select = $("#econ-invoice-appointment"), old = select.value;
    select.replaceChildren(new Option("Sin cita vinculada", ""));
    const eligible = bookings.filter(b => b.clinical_patient_id === patientId && b.starts_at &&
      Date.parse(b.starts_at) <= Date.now() && !["cancelled", "canceled"].includes(b.status) &&
      !invoices.some(i => i.status === "issued" && i.appointment_id === b.id && i.id !== editingInvoice));
    eligible.forEach(b => select.add(new Option(fmtDate(b.starts_at) + " · " + (b.service_code || "Consulta") +
      (b.price_eur == null ? "" : " · " + currency.format(b.price_eur)), b.id)));
    if (eligible.some(b => b.id === old)) select.value = old;
  }
  function renderIssuer() {
    $("#econ-issuer-name").value = issuer?.legal_name || "Carolina Sánchez Girona";
    $("#econ-issuer-nif").value = issuer?.tax_id || "";
    $("#econ-issuer-address").value = issuer?.fiscal_address || "";
    $("#econ-issuer-email").value = issuer?.email || "contact@carolinasanchezgirona.com";
  }
  const paid = invoice => receipts.filter(r => r.invoice_id === invoice.id).reduce((s, r) => s + Number(r.amount_cents), 0);
  const invoiceGross = invoice => invoice.status === "issued" ? Number(invoice.total_cents) :
    invoice.quantity * invoice.unit_price_cents * (invoice.tax_treatment === "vat_21" ? 1.21 : 1);
  function renderOverview() {
    const month = $("#econ-month").value;
    const monthInvoices = invoices.filter(i => i.status === "issued" && i.issue_date?.startsWith(month));
    const invoiceAmount = monthInvoices.reduce((s, i) => s + Number(i.total_cents), 0);
    const allOutstanding = invoices.filter(i => i.status === "issued").reduce((s, i) => s + Math.max(0, Number(i.total_cents) - paid(i)), 0);
    const collected = receipts.filter(r => r.paid_date?.startsWith(month)).reduce((s, r) => s + Number(r.amount_cents), 0);
    const spent = expenses.filter(e => e.expense_date?.startsWith(month)).reduce((s, e) => s + Number(e.amount_cents), 0);
    $("#econ-kpi-issued").textContent = money(invoiceAmount);
    $("#econ-kpi-collected").textContent = money(collected);
    $("#econ-kpi-pending").textContent = money(allOutstanding);
    $("#econ-kpi-expenses").textContent = money(spent);
    $("#econ-kpi-balance").textContent = money(collected - spent);
    $("#econ-summary-note").textContent =
      invoices.filter(i => i.status === "draft").length + " borradores pendientes de revisar. " +
      invoices.filter(i => i.status === "issued" && paid(i) < i.total_cents).length +
      " facturas emitidas con un importe pendiente. El cobro nunca se presume por el hecho de que exista una cita.";
  }
  function renderInvoiceList() {
    const list = $("#econ-invoice-list");
    list.replaceChildren();
    if (!invoices.length) { list.append(el("p", "econ-empty", "Todavía no hay facturas ni borradores.")); return; }
    invoices.forEach(invoice => {
      const card = el("article", "econ-invoice");
      const head = el("div", "econ-invoice-head");
      const left = el("div");
      left.append(
        el("h3", "", invoice.status === "issued" ? invoice.invoice_number : "Borrador"),
        el("p", "", invoice.recipient_name + " · " + fmtDate(invoice.service_date)),
        el("p", "", invoice.description + " · " + money(invoice.status === "issued" ? invoice.total_cents : Math.round(invoiceGross(invoice))))
      );
      const right = el("span", "econ-status-pill" + (invoice.status === "draft" ? " draft" : ""), invoice.status === "issued" ? "Emitida" : "Sin emitir");
      head.append(left, right);
      card.append(head);
      if (invoice.status === "issued") {
        const remaining = Math.max(0, Number(invoice.total_cents) - paid(invoice));
        card.append(el("p", "", "Emisión " + fmtDate(invoice.issue_date) + " · Cobrado " + money(paid(invoice)) +
          " · Pendiente " + money(remaining)));
        const actions = el("div", "econ-actions");
        actions.append(btn("Imprimir / guardar PDF", "econ-outline", () => printInvoice(invoice)));
        if (remaining > 0) actions.append(btn("Registrar cobro", "econ-outline", b => showPaymentForm(card, b, invoice, remaining)));
        card.append(actions);
      } else {
        const actions = el("div", "econ-actions");
        actions.append(btn("Editar borrador", "econ-outline", () => editDraft(invoice)));
        actions.append(btn("Emitir factura", "econ-button", () => showIssueConfirmation(card, invoice)));
        card.append(actions);
      }
      list.append(card);
    });
  }
  function showIssueConfirmation(card, invoice) {
    card.querySelector(".econ-confirm-panel")?.remove();
    const panel = el("div", "econ-confirm-panel");
    panel.append(el("strong", "", "Confirmar emisión definitiva"));
    panel.append(el("p", "", "Comprueba NIF, domicilio fiscal, destinatario, concepto, importe y exención de IVA. Se asignará el siguiente número correlativo y la factura no podrá modificarse ni borrarse. La impresión en PDF se realizará después."));
    const actions = el("div", "econ-actions");
    actions.append(btn("Confirmar emisión", "econ-button", async b => {
      b.disabled = true;
      try {
        const issued = await rest("rpc/billing_issue_invoice", {
          method: "POST", headers: { Prefer: "return=representation" },
          body: JSON.stringify({ p_invoice_id: invoice.id }),
        });
        setStatus(issued?.invoice_number ? "Factura emitida: " + issued.invoice_number : "Factura emitida.");
        await load();
      } catch (err) { b.disabled = false; throw err; }
    }));
    actions.append(btn("Volver", "econ-outline", () => panel.remove()));
    panel.append(actions); card.append(panel);
  }
  function showPaymentForm(card, clicked, invoice, remaining) {
    if (card.querySelector(".econ-payment-form")) { card.querySelector(".econ-payment-form").remove(); return; }
    const form = el("form", "econ-payment-form");
    const dateLabel = el("label", "", "Fecha del cobro");
    const date = el("input"); date.type = "date"; date.required = true; date.value = today();
    dateLabel.append(date);
    const sumLabel = el("label", "", "Importe (€)");
    const sum = el("input"); sum.type = "number"; sum.min = "0.01"; sum.max = fmtInputEuros(remaining);
    sum.step = "0.01"; sum.value = fmtInputEuros(remaining); sum.required = true; sumLabel.append(sum);
    const typeLabel = el("label", "", "Medio de pago");
    const type = el("select");
    [["bizum","Bizum"],["bank_transfer","Transferencia"],["card","Tarjeta"],["cash","Efectivo"],["other","Otro"]]
      .forEach(([key,value]) => type.add(new Option(value, key)));
    typeLabel.append(type);
    const save = el("button", "econ-button", "Confirmar cobro"); save.type = "submit";
    const cancel = btn("Cancelar", "econ-outline", () => form.remove());
    form.append(dateLabel, sumLabel, typeLabel, save, cancel);
    form.addEventListener("submit", async event => {
      event.preventDefault(); save.disabled = true;
      try {
        const amount = requirePositiveCents(sum.value);
        if (amount > remaining) throw new Error("El cobro supera el importe pendiente.");
        await rest("billing_receipts", {
          method: "POST", headers: { Prefer: "return=representation" },
          body: JSON.stringify({ invoice_id: invoice.id, amount_cents: amount, paid_date: date.value, method: type.value }),
        });
        await load();
      } catch (error) { setStatus(error.message); save.disabled = false; }
    });
    card.append(form); clicked.disabled = false;
  }
  function renderExpenses() {
    const list = $("#econ-expense-list");
    list.replaceChildren();
    const labels = { rent:"Alquiler", utilities:"Suministros", software:"Programas", materials:"Materiales", marketing:"Publicidad", training:"Formación", professional:"Servicios profesionales", other:"Otros" };
    if (!expenses.length) { list.append(el("p", "econ-empty", "No hay gastos registrados.")); return; }
    expenses.forEach(expense => {
      const card = el("article", "econ-invoice");
      const head = el("div", "econ-invoice-head");
      const description = el("div");
      description.append(el("h3", "", expense.concept), el("p", "", expense.supplier + " · " + labels[expense.category] + " · " + fmtDate(expense.expense_date)));
      head.append(description, el("strong", "", money(expense.amount_cents)));
      card.append(head); list.append(card);
    });
  }
  function renderAll() { fillPatients(); renderIssuer(); renderOverview(); renderInvoiceList(); renderExpenses(); }
  function choosePatient() {
    const patient = patients.find(p => p.id === $("#econ-invoice-patient").value);
    fillBookings(patient?.id);
    if (!editingInvoice && patient) {
      $("#econ-invoice-recipient").value = patient.full_name || "";
      $("#econ-invoice-nif").value = patient.national_id || "";
      $("#econ-invoice-address").value = patient.address || "";
    }
  }
  function chooseBooking() {
    const appointment = bookings.find(b => b.id === $("#econ-invoice-appointment").value);
    if (!appointment) return;
    $("#econ-invoice-date").value = new Intl.DateTimeFormat("sv-SE", { timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit" }).format(new Date(appointment.starts_at));
    if (Number(appointment.price_eur) > 0) $("#econ-invoice-price").value = Number(appointment.price_eur).toFixed(2);
  }
  function clearInvoiceForm() {
    editingInvoice = null;
    $("#econ-invoice-form").reset();
    $("#econ-invoice-date").value = today();
    $("#econ-invoice-patient").value = "";
    fillBookings("");
    $("#econ-invoice-form").hidden = false;
    $("#econ-invoice-patient").focus();
  }
  function editDraft(invoice) {
    if (invoice.status !== "draft") throw new Error("Solo se pueden editar borradores.");
    showTab("invoices");
    editingInvoice = invoice.id;
    $("#econ-invoice-form").hidden = false;
    $("#econ-invoice-patient").value = invoice.patient_id;
    fillBookings(invoice.patient_id);
    $("#econ-invoice-appointment").value = invoice.appointment_id || "";
    $("#econ-invoice-recipient").value = invoice.recipient_name;
    $("#econ-invoice-nif").value = invoice.recipient_tax_id;
    $("#econ-invoice-address").value = invoice.recipient_address;
    $("#econ-invoice-date").value = invoice.service_date;
    const preset = Array.from($("#econ-invoice-service").options).some(o => o.value === invoice.description);
    $("#econ-invoice-service").value = preset ? invoice.description : "custom";
    $("#econ-custom-service-wrap").hidden = preset;
    $("#econ-invoice-custom-service").value = preset ? "" : invoice.description;
    $("#econ-invoice-quantity").value = String(invoice.quantity);
    $("#econ-invoice-price").value = fmtInputEuros(invoice.unit_price_cents);
    $("#econ-invoice-tax").value = invoice.tax_treatment;
    $("#econ-invoice-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function esc(s) { return String(s ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
  function printInvoice(i) {
    if (i.status !== "issued" || !i.issuer_snapshot || !i.invoice_number) throw new Error("Solo se imprimen facturas emitidas.");
    const issuer = i.issuer_snapshot;
    const base = i.quantity * i.unit_price_cents;
    const note = i.tax_treatment === "exempt_healthcare" ?
      "Operación exenta de IVA conforme al artículo 20.Uno.3.º de la Ley 37/1992, cuando concurren los requisitos legales." :
      "Operación sujeta a IVA general del 21 %.";
    const html = '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Factura ' + esc(i.invoice_number) + '</title>' +
      '<style>@page{size:A4;margin:18mm}body{font:14px/1.55 Arial,sans-serif;color:#173A5E;margin:0}*{box-sizing:border-box}.page{max-width:780px;margin:30px auto;padding:24px}.head{display:flex;justify-content:space-between;gap:20px;border-bottom:3px solid #08A6A0;padding-bottom:28px}.brand{font:26px Georgia,serif}h1{margin:0;font:32px Georgia,serif}h2{font-size:13px;text-transform:uppercase;letter-spacing:.11em;margin:0 0 8px}.meta{text-align:right}.party{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:32px 0}.party p{margin:5px 0}.date{padding:14px 0;color:#49687c}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{text-align:left;padding:13px 9px;border-bottom:1px solid #dbe5ee}th{background:#eaf6fb;font-size:12px}td:last-child,th:last-child{text-align:right}.total{margin-left:auto;max-width:300px;text-align:right;margin-top:30px}.total p{display:flex;justify-content:space-between;gap:30px}.total strong{font-size:22px}.note{border-top:1px solid #cddce5;margin-top:55px;padding-top:18px;font-size:12px;color:#566d7e}.controls{text-align:center;margin:25px}.controls button{background:#173A5E;color:white;border:none;padding:12px 22px;border-radius:8px;cursor:pointer}@media print{.controls{display:none}.page{margin:0;padding:0}}</style></head><body>' +
      '<div class="controls"><button onclick="window.print()">Imprimir o guardar como PDF</button></div><main class="page">' +
      '<div class="head"><div><div class="brand">Carolina Sánchez Girona</div><p>Consulta de psicología y neuropsicología</p></div><div class="meta"><h1>Factura</h1><strong>' + esc(i.invoice_number) +
      '</strong><p>Fecha: ' + esc(fmtDate(i.issue_date)) + '</p></div></div>' +
      '<div class="party"><section><h2>Emisor</h2><p><strong>' + esc(issuer.legal_name) + '</strong></p><p>NIF: ' + esc(issuer.tax_id) + '</p><p>' + esc(issuer.fiscal_address) + '</p><p>' + esc(issuer.email) +
      '</p></section><section><h2>Destinatario</h2><p><strong>' + esc(i.recipient_name) + '</strong></p><p>NIF/NIE: ' + esc(i.recipient_tax_id) +
      '</p><p>' + esc(i.recipient_address) + '</p></section></div>' +
      '<div class="date">Fecha de prestación: <strong>' + esc(fmtDate(i.service_date)) + '</strong></div>' +
      '<table><thead><tr><th>Servicio</th><th>Cantidad</th><th>Precio unitario</th><th>Base</th></tr></thead><tbody><tr><td>' +
      esc(i.description) + '</td><td>' + esc(i.quantity) + '</td><td>' + esc(money(i.unit_price_cents)) +
      '</td><td>' + esc(money(base)) + '</td></tr></tbody></table>' +
      '<div class="total"><p><span>Base imponible</span><span>' + esc(money(base)) + '</span></p>' +
      '<p><span>IVA ' + (i.tax_treatment === "vat_21" ? "21 %" : "exento") + '</span><span>' + esc(money(i.vat_cents)) +
      '</span></p><p><strong>Total</strong><strong>' + esc(money(i.total_cents)) + '</strong></p></div>' +
      '<p class="note">' + esc(note) + '</p></main></body></html>';
    const popup = window.open("", "_blank");
    if (!popup) throw new Error("Permite abrir la pestaña de impresión en el navegador.");
    popup.opener = null;
    popup.document.open(); popup.document.write(html); popup.document.close(); popup.focus();
  }
  function csvCell(value) {
    let text = String(value ?? "");
    if (/^[\s]*[=+\-@\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }
  function downloadCSV(filename, columns, rows) {
    const content = "\uFEFF" + [columns, ...rows].map(row => row.map(csvCell).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const a = el("a"); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  function exportInvoices() {
    downloadCSV("dememoria-facturas-" + today() + ".csv",
      ["Estado","Número","Fecha emisión","Fecha prestación","Destinatario","NIF","Concepto","Base EUR","IVA EUR","Total EUR","Cobrado EUR","Pendiente EUR"],
      invoices.map(i => {
        const base = i.unit_price_cents * i.quantity;
        const vat = i.status === "issued" ? i.vat_cents : (i.tax_treatment === "vat_21" ? Math.round(base * .21) : 0);
        const total = i.status === "issued" ? i.total_cents : base + vat;
        return [i.status, i.invoice_number || "",i.issue_date || "",i.service_date,i.recipient_name,i.recipient_tax_id,
          i.description,fmtInputEuros(base),fmtInputEuros(vat),fmtInputEuros(total),
          fmtInputEuros(paid(i)),fmtInputEuros(i.status === "issued" ? Math.max(0,i.total_cents-paid(i)) : 0)];
      }));
  }
  function exportExpenses() {
    downloadCSV("dememoria-gastos-" + today() + ".csv",["Fecha","Categoría","Proveedor","Concepto","Importe EUR"],
      expenses.map(e => [e.expense_date,e.category,e.supplier,e.concept,fmtInputEuros(e.amount_cents)]));
  }

  $("#econ-new-invoice").addEventListener("click", clearInvoiceForm);
  $("#econ-invoice-cancel").addEventListener("click", () => { editingInvoice=null; $("#econ-invoice-form").hidden=true; });
  $("#econ-invoice-patient").addEventListener("change", choosePatient);
  $("#econ-invoice-appointment").addEventListener("change", chooseBooking);
  $("#econ-invoice-service").addEventListener("change", () => {
    $("#econ-custom-service-wrap").hidden = $("#econ-invoice-service").value !== "custom";
  });
  $("#econ-month").value = today().slice(0,7);
  $("#econ-month").addEventListener("change", renderOverview);
  document.querySelectorAll("[data-econ-tab]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.econTab)));
  document.querySelectorAll("[data-econ-goto]").forEach(b => b.addEventListener("click", () => { showTab(b.dataset.econGoto); clearInvoiceForm(); }));
  $("#econ-refresh").addEventListener("click", () => load().catch(e => setStatus(e.message)));
  $("#econ-export-invoices").addEventListener("click", exportInvoices);
  $("#econ-export-expenses").addEventListener("click", exportExpenses);
  $("#econ-invoice-form").addEventListener("submit", async event => {
    event.preventDefault();
    try {
      const description = $("#econ-invoice-service").value === "custom" ?
        $("#econ-invoice-custom-service").value.trim() : $("#econ-invoice-service").value;
      if (description.length < 3) throw new Error("Indica el concepto del servicio.");
      const patientId = $("#econ-invoice-patient").value;
      if (!patientId || !patients.some(p => p.id === patientId)) throw new Error("Selecciona un paciente.");
      const quantity = Number($("#econ-invoice-quantity").value);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) throw new Error("Cantidad no válida.");
      const payload = {
        patient_id: patientId,
        appointment_id: $("#econ-invoice-appointment").value || null,
        recipient_name: $("#econ-invoice-recipient").value.trim(),
        recipient_tax_id: $("#econ-invoice-nif").value.trim().toUpperCase(),
        recipient_address: $("#econ-invoice-address").value.trim(),
        description,
        service_date: $("#econ-invoice-date").value,
        quantity,
        unit_price_cents: requirePositiveCents($("#econ-invoice-price").value),
        tax_treatment: $("#econ-invoice-tax").value,
      };
      const editing = Boolean(editingInvoice);
      await rest(editing ? "billing_invoices?id=eq." + encodeURIComponent(editingInvoice) : "billing_invoices", {
        method: editing ? "PATCH" : "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
      editingInvoice = null; $("#econ-invoice-form").hidden=true;
      await load(); setStatus("Borrador guardado. Revísalo antes de emitir.");
    } catch (err) { setStatus(err.message); }
  });
  $("#econ-issuer-form").addEventListener("submit", async event => {
    event.preventDefault();
    try {
      const legal_name = $("#econ-issuer-name").value.trim();
      const tax_id = $("#econ-issuer-nif").value.trim().toUpperCase();
      const fiscal_address = $("#econ-issuer-address").value.trim();
      const email = $("#econ-issuer-email").value.trim();
      if (legal_name.length < 3 || tax_id.length < 8 || fiscal_address.length < 10) throw new Error("Completa el nombre, NIF y domicilio fiscal.");
      await rest("billing_issuer_settings?id=eq.1", {
        method:"PATCH", headers:{Prefer:"return=representation"},
        body:JSON.stringify({legal_name,tax_id,fiscal_address,email}),
      });
      await load(); setStatus("Datos fiscales guardados. Comprueba que sean correctos antes de emitir.");
    } catch (err) { setStatus(err.message); }
  });
  $("#econ-expense-date").value = today();
  $("#econ-expense-form").addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await rest("billing_expenses", {
        method:"POST", headers:{Prefer:"return=representation"},
        body:JSON.stringify({
          expense_date:$("#econ-expense-date").value,
          category:$("#econ-expense-category").value,
          supplier:$("#econ-expense-supplier").value.trim(),
          concept:$("#econ-expense-concept").value.trim(),
          amount_cents:requirePositiveCents($("#econ-expense-amount").value),
        }),
      });
      $("#econ-expense-form").reset(); $("#econ-expense-date").value = today();
      await load(); setStatus("Gasto registrado.");
    } catch (err) { setStatus(err.message); }
  });
  (async () => {
    try {
      session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      if (!session?.access_token) throw new Error("Acceso profesional necesario.");
      const auth = await fetch(SUPA + "/auth/v1/user", {
        headers: { apikey: KEY, Authorization: "Bearer " + session.access_token }, cache: "no-store",
      });
      if (!auth.ok) throw new Error("La sesión ha caducado.");
      const user = await auth.json();
      if (user?.id !== OWNER) throw new Error("Acceso restringido.");
      contents.hidden = false;
      await load();
    } catch (err) {
      contents.hidden = true;
      $("#econ-access").hidden = false;
      setStatus(err.message);
    }
  })();
})();
