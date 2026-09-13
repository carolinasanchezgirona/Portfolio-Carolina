(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const AUTH_URL = `${SUPABASE_URL}/auth/v1`;
  const STORAGE_URL = `${SUPABASE_URL}/storage/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ALLOWED_USER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";

  const $ = (s) => document.querySelector(s);
  const els = {
    login: $("#articles-login"), loginForm: $("#articles-login-form"), email: $("#articles-email"), password: $("#articles-password"), loginMessage: $("#articles-login-message"),
    app: $("#articles-app"), logout: $("#articles-logout"), newButton: $("#article-new"), list: $("#articles-list"), count: $("#articles-count"),
    form: $("#article-form"), empty: $("#articles-empty"), editorTitle: $("#article-editor-title"), id: $("#article-id"), title: $("#article-title"), subtitle: $("#article-subtitle"), slug: $("#article-slug"),
    category: $("#article-category"), excerpt: $("#article-excerpt"), content: $("#article-content"), featured: $("#article-featured"), related: $("#article-related-page"), imageUrl: $("#article-image-url"),
    imageAlt: $("#article-image-alt"), imageCaption: $("#article-image-caption"), imageFile: $("#article-image-file"), imageRemove: $("#article-image-remove"), imagePreview: $("#featured-image-preview"),
    tags: $("#article-tags"), ctaLabel: $("#article-cta-label"), ctaUrl: $("#article-cta-url"), scheduledAt: $("#article-scheduled-at"),
    seoTitle: $("#article-seo-title"), seoDescription: $("#article-seo-description"), message: $("#article-message"), statusLabel: $("#article-status-label"),
    saveDraft: $("#article-save-draft"), publish: $("#article-publish"), schedule: $("#article-schedule"), preview: $("#article-preview"), deleteButton: $("#article-delete"),
    subtitleCount: $("#subtitle-count"), excerptCount: $("#excerpt-count"), seoTitleCount: $("#seo-title-count"), seoDescriptionCount: $("#seo-description-count"), readingTime: $("#reading-time"),
    seoPreviewTitle: $("#seo-preview-title"), seoPreviewDescription: $("#seo-preview-description"), qualitySummary: $("#quality-summary"), qualityChecklist: $("#quality-checklist"),
    toolbarBlock: $("#toolbar-block"), toolbarFont: $("#toolbar-font"), toolbarSize: $("#toolbar-size"), inlineImagePosition: $("#inline-image-position"), inlineImageButton: $("#inline-image-button"), inlineImageInput: $("#inline-image-input"), insertReferences: $("#insert-references"),
    previewDialog: $("#article-preview-dialog"), previewClose: $("#preview-close"), previewDesktop: $("#preview-desktop"), previewMobile: $("#preview-mobile"), previewFrame: $("#preview-frame"),
    previewCategory: $("#preview-category"), previewTitle: $("#preview-title"), previewSubtitle: $("#preview-subtitle"), previewExcerpt: $("#preview-excerpt"), previewFigure: $("#preview-figure"), previewImage: $("#preview-image"), previewImageCaption: $("#preview-image-caption"), previewContent: $("#preview-content"), previewCta: $("#preview-cta"),
  };

  let session = null;
  let articles = [];
  let activeFilter = "all";

  const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
  const plainTextFromHtml = (html) => { const div = document.createElement("div"); div.innerHTML = html || ""; return (div.textContent || "").replace(/\s+/g, " ").trim(); };
  const slugify = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 180);
  const nowIso = () => new Date().toISOString();
  const isFuture = (value) => Boolean(value && new Date(value).getTime() > Date.now());

  function setMessage(text) { if (els.message) els.message.textContent = text || ""; }
  function setLoginMessage(text) { if (els.loginMessage) els.loginMessage.textContent = text || ""; }
  function authHeaders(extra = {}) { return { apikey: KEY, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", ...extra }; }
  function saveSession(value) { session = value; if (value) sessionStorage.setItem(SESSION_KEY, JSON.stringify(value)); else sessionStorage.removeItem(SESSION_KEY); }
  function getSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } }

  async function currentUser() {
    if (!session?.access_token) return null;
    const r = await fetch(`${AUTH_URL}/user`, { headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
    if (!r.ok) return null;
    const user = await r.json();
    return user?.id === ALLOWED_USER_ID ? user : null;
  }

  async function signIn(email, password) {
    const r = await fetch(`${AUTH_URL}/token?grant_type=password`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(body.error_description || body.msg || "No se ha podido iniciar sesión.");
    if (body.user?.id !== ALLOWED_USER_ID) throw new Error("Esta cuenta no tiene acceso al editor.");
    saveSession(body);
  }

  function showApp() { els.login.hidden = true; els.app.hidden = false; }
  function showLogin() { els.app.hidden = true; els.login.hidden = false; }

  function articleUiStatus(article) {
    if (article.status === "published" && isFuture(article.published_at)) return "scheduled";
    return article.status === "published" ? "published" : "draft";
  }

  async function loadArticles(selectId = null) {
    const r = await fetch(`${REST_URL}/articles?select=*&order=updated_at.desc`, { headers: authHeaders(), cache: "no-store" });
    const body = await r.json().catch(() => []);
    if (r.status === 401) { saveSession(null); showLogin(); return; }
    if (!r.ok) throw new Error(body.message || "No se han podido cargar los artículos.");
    articles = body;
    renderList();
    if (selectId) {
      const article = articles.find((a) => a.id === selectId);
      if (article) openArticle(article);
    }
  }

  function renderList() {
    const rows = articles.filter((a) => activeFilter === "all" || articleUiStatus(a) === activeFilter);
    els.count.textContent = String(articles.length);
    els.list.replaceChildren();
    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "articles-empty";
      empty.style.minHeight = "140px";
      empty.textContent = activeFilter === "all" ? "Todavía no hay artículos." : "No hay artículos en este estado.";
      els.list.append(empty);
      return;
    }
    rows.forEach((article) => {
      const uiStatus = articleUiStatus(article);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `article-list-item${els.id.value === article.id ? " active" : ""}`;
      const cat = article.category === "neuropsicologia" ? "Neuropsicología" : "Psicología";
      const statusText = uiStatus === "published" ? "Publicado" : uiStatus === "scheduled" ? "Programado" : "Borrador";
      button.innerHTML = `<strong>${escapeHtml(article.title)}</strong><span><i><b class="status-dot ${uiStatus}"></b>${statusText}</i><i>${cat}${article.featured ? " · Destacado" : ""}</i></span>`;
      button.addEventListener("click", () => openArticle(article));
      els.list.append(button);
    });
  }

  function resetMediaPreview() {
    els.imagePreview.replaceChildren();
    if (els.imageUrl.value.trim()) {
      const img = document.createElement("img");
      img.src = els.imageUrl.value.trim();
      img.alt = els.imageAlt.value.trim();
      els.imagePreview.append(img);
    } else {
      const span = document.createElement("span"); span.textContent = "Sin imagen de portada"; els.imagePreview.append(span);
    }
  }

  function newArticle() {
    els.form.reset();
    els.id.value = "";
    els.content.innerHTML = "";
    els.category.value = "neuropsicologia";
    els.statusLabel.textContent = "Borrador nuevo";
    els.editorTitle.textContent = "Nuevo artículo";
    els.deleteButton.hidden = true;
    els.empty.hidden = true;
    els.form.hidden = false;
    setMessage("");
    resetMediaPreview();
    updateLiveTools();
    renderList();
    els.title.focus();
  }

  function openArticle(a) {
    els.id.value = a.id;
    els.title.value = a.title || "";
    els.subtitle.value = a.subtitle || "";
    els.slug.value = a.slug || "";
    els.category.value = a.category || "neuropsicologia";
    els.excerpt.value = a.excerpt || "";
    els.content.innerHTML = a.content || "";
    els.featured.checked = Boolean(a.featured);
    els.related.value = a.related_page || "";
    els.imageUrl.value = a.image_url || "";
    els.imageAlt.value = a.image_alt || "";
    els.imageCaption.value = a.image_caption || "";
    els.tags.value = Array.isArray(a.tags) ? a.tags.join(", ") : "";
    els.ctaLabel.value = a.cta_label || "";
    els.ctaUrl.value = a.cta_url || "";
    els.seoTitle.value = a.seo_title || "";
    els.seoDescription.value = a.seo_description || "";
    els.scheduledAt.value = a.scheduled_at ? toLocalDateTimeValue(a.scheduled_at) : (isFuture(a.published_at) ? toLocalDateTimeValue(a.published_at) : "");
    const uiStatus = articleUiStatus(a);
    els.statusLabel.textContent = uiStatus === "published" ? "Publicado" : uiStatus === "scheduled" ? "Programado" : "Borrador";
    els.editorTitle.textContent = "Editar artículo";
    els.deleteButton.hidden = false;
    els.empty.hidden = true;
    els.form.hidden = false;
    setMessage("");
    resetMediaPreview();
    updateLiveTools();
    renderList();
  }

  function toLocalDateTimeValue(value) {
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function tagArray() {
    return els.tags.value.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 12);
  }

  function smartSeo() {
    if (!els.seoTitle.value.trim()) els.seoTitle.value = `${els.title.value.trim()} | Carolina Sánchez`.slice(0, 70);
    if (!els.seoDescription.value.trim()) {
      const source = els.excerpt.value.trim() || els.subtitle.value.trim() || plainTextFromHtml(els.content.innerHTML);
      els.seoDescription.value = source.slice(0, 165);
    }
  }

  function payload(mode) {
    smartSeo();
    const existing = articles.find((a) => a.id === els.id.value);
    let status = "draft";
    let publishedAt = null;
    let scheduledAt = null;
    if (mode === "published") {
      status = "published";
      publishedAt = existing?.published_at && !isFuture(existing.published_at) ? existing.published_at : nowIso();
    }
    if (mode === "scheduled") {
      if (!els.scheduledAt.value) throw new Error("Elige una fecha y hora para programar la publicación.");
      const date = new Date(els.scheduledAt.value);
      if (!(date.getTime() > Date.now())) throw new Error("La fecha programada debe ser futura.");
      status = "published";
      publishedAt = date.toISOString();
      scheduledAt = date.toISOString();
    }
    return {
      title: els.title.value.trim(), subtitle: els.subtitle.value.trim() || null, slug: slugify(els.slug.value || els.title.value),
      excerpt: els.excerpt.value.trim() || null, content: els.content.innerHTML.trim(), category: els.category.value, status,
      featured: els.featured.checked, image_url: els.imageUrl.value.trim() || null, image_alt: els.imageAlt.value.trim() || null,
      image_caption: els.imageCaption.value.trim() || null, related_page: els.related.value || null, tags: tagArray(),
      cta_label: els.ctaLabel.value.trim() || null, cta_url: els.ctaUrl.value.trim() || null,
      seo_title: els.seoTitle.value.trim() || null, seo_description: els.seoDescription.value.trim() || null,
      updated_at: nowIso(), published_at: publishedAt, scheduled_at: scheduledAt,
    };
  }

  async function save(mode) {
    if (!els.title.value.trim()) return setMessage("Escribe el título del artículo.");
    if (!plainTextFromHtml(els.content.innerHTML)) return setMessage("Escribe el contenido del artículo.");
    if (!els.slug.value.trim()) els.slug.value = slugify(els.title.value);
    const body = payload(mode);
    const id = els.id.value;
    const actionText = mode === "draft" ? "Guardando borrador…" : mode === "scheduled" ? "Programando…" : "Publicando…";
    setMessage(actionText);
    const url = id ? `${REST_URL}/articles?id=eq.${encodeURIComponent(id)}` : `${REST_URL}/articles`;
    const r = await fetch(url, { method: id ? "PATCH" : "POST", headers: authHeaders({ Prefer: "return=representation" }), body: JSON.stringify(body) });
    const result = await r.json().catch(() => []);
    if (!r.ok) throw new Error(result.message || (result.code === "23505" ? "Ya existe un artículo con esa URL." : "No se ha podido guardar."));
    const savedId = id || result?.[0]?.id;
    await loadArticles(savedId);
    setMessage(mode === "draft" ? "Borrador guardado." : mode === "scheduled" ? "Publicación programada correctamente." : "Publicado correctamente.");
  }

  async function uploadImage(file) {
    if (!file) throw new Error("Selecciona una imagen.");
    if (file.size > 5 * 1024 * 1024) throw new Error("La imagen no puede superar 5 MB.");
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagen";
    const objectName = `${Date.now()}-${base}.${ext}`;
    const r = await fetch(`${STORAGE_URL}/object/article-images/${objectName}`, {
      method: "POST",
      headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}`, "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
      body: file,
    });
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      throw new Error(body.message || "No se ha podido subir la imagen.");
    }
    return `${SUPABASE_URL}/storage/v1/object/public/article-images/${encodeURIComponent(objectName)}`;
  }

  async function handleFeaturedImage(file) {
    setMessage("Subiendo imagen…");
    const url = await uploadImage(file);
    els.imageUrl.value = url;
    if (!els.imageAlt.value.trim()) els.imageAlt.value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    resetMediaPreview(); updateLiveTools(); setMessage("Imagen subida.");
  }

  async function handleInlineImage(file) {
    setMessage("Subiendo imagen para el artículo…");
    const url = await uploadImage(file);
    const alt = window.prompt("Texto ALT de la imagen (describe brevemente qué muestra):", file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")) || "";
    const caption = window.prompt("Pie de foto (opcional):", "") || "";
    const position = els.inlineImagePosition.value || "wide";
    els.content.focus();
    const html = `<figure class="article-media article-media-${position}"><img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}"><figcaption>${escapeHtml(caption)}</figcaption></figure><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    updateLiveTools(); setMessage("Imagen insertada en el artículo.");
  }

  function readingMinutes() {
    const words = plainTextFromHtml(els.content.innerHTML).split(/\s+/).filter(Boolean).length;
    return words ? Math.max(1, Math.ceil(words / 220)) : 0;
  }

  function updateCounters() {
    els.subtitleCount.textContent = `${els.subtitle.value.length}/220`;
    els.excerptCount.textContent = `${els.excerpt.value.length}/420`;
    els.seoTitleCount.textContent = `${els.seoTitle.value.length}/60`;
    els.seoDescriptionCount.textContent = `${els.seoDescription.value.length}/160`;
    els.readingTime.textContent = `${readingMinutes()} min de lectura`;
    els.seoPreviewTitle.textContent = els.seoTitle.value.trim() || els.title.value.trim() || "Título del artículo";
    els.seoPreviewDescription.textContent = els.seoDescription.value.trim() || els.excerpt.value.trim() || els.subtitle.value.trim() || "La descripción SEO aparecerá aquí.";
  }

  function qualityChecks() {
    const html = els.content.innerHTML;
    const hasH2 = Boolean(els.content.querySelector("h2"));
    const hasInternalLink = Array.from(els.content.querySelectorAll("a")).some((a) => (a.getAttribute("href") || "").startsWith("/")) || Boolean(els.related.value);
    return [
      [Boolean(els.title.value.trim()), "Título definido"],
      [Boolean(els.subtitle.value.trim()), "Subtítulo editorial"],
      [Boolean(els.excerpt.value.trim()), "Entradilla para el listado"],
      [plainTextFromHtml(html).length >= 500, "Contenido desarrollado"],
      [hasH2, "Estructura con al menos un H2"],
      [!els.imageUrl.value.trim() || Boolean(els.imageAlt.value.trim()), "Imagen de portada con texto ALT"],
      [hasInternalLink, "Enlace interno o página relacionada"],
      [Boolean(els.seoTitle.value.trim()), "Título SEO"],
      [Boolean(els.seoDescription.value.trim()), "Descripción SEO"],
      [Boolean(els.ctaLabel.value.trim() && els.ctaUrl.value.trim()), "Llamada a la acción"],
    ];
  }

  function renderQuality() {
    const checks = qualityChecks();
    const ok = checks.filter(([pass]) => pass).length;
    els.qualitySummary.textContent = `${ok} de ${checks.length}`;
    els.qualityChecklist.replaceChildren();
    checks.forEach(([pass, label]) => {
      const div = document.createElement("div"); div.className = `quality-item${pass ? " ok" : ""}`; div.textContent = label; els.qualityChecklist.append(div);
    });
  }

  function updateLiveTools() { updateCounters(); renderQuality(); }

  function showPreview() {
    els.previewCategory.textContent = els.category.value === "neuropsicologia" ? "Neuropsicología" : "Psicología";
    els.previewTitle.textContent = els.title.value.trim() || "Título del artículo";
    els.previewSubtitle.textContent = els.subtitle.value.trim(); els.previewSubtitle.hidden = !els.subtitle.value.trim();
    els.previewExcerpt.textContent = els.excerpt.value.trim(); els.previewExcerpt.hidden = !els.excerpt.value.trim();
    els.previewContent.innerHTML = els.content.innerHTML;
    if (els.imageUrl.value.trim()) {
      els.previewImage.src = els.imageUrl.value.trim(); els.previewImage.alt = els.imageAlt.value.trim(); els.previewImageCaption.textContent = els.imageCaption.value.trim(); els.previewFigure.hidden = false;
    } else els.previewFigure.hidden = true;
    if (els.ctaLabel.value.trim() && els.ctaUrl.value.trim()) {
      els.previewCta.innerHTML = `<strong>¿Quieres dar el siguiente paso?</strong><br><a href="${escapeHtml(els.ctaUrl.value.trim())}">${escapeHtml(els.ctaLabel.value.trim())} →</a>`; els.previewCta.hidden = false;
    } else els.previewCta.hidden = true;
    els.previewDialog.showModal();
  }

  async function deleteArticle() {
    const id = els.id.value; if (!id) return;
    if (!window.confirm(`¿Eliminar definitivamente “${els.title.value.trim()}”?`)) return;
    setMessage("Eliminando…");
    const r = await fetch(`${REST_URL}/articles?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders() });
    if (!r.ok) { const body = await r.json().catch(() => ({})); throw new Error(body.message || "No se ha podido eliminar."); }
    els.form.hidden = true; els.empty.hidden = false; els.id.value = ""; await loadArticles();
  }

  els.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault(); setLoginMessage("Entrando…");
    try { await signIn(els.email.value.trim(), els.password.value); els.password.value = ""; showApp(); await loadArticles(); setLoginMessage(""); }
    catch (error) { setLoginMessage(error.message); }
  });
  els.logout?.addEventListener("click", () => { saveSession(null); showLogin(); });
  els.newButton?.addEventListener("click", newArticle);
  els.title?.addEventListener("input", () => { if (!els.id.value) els.slug.value = slugify(els.title.value); updateLiveTools(); });
  [els.subtitle, els.excerpt, els.seoTitle, els.seoDescription, els.imageAlt, els.tags, els.ctaLabel, els.ctaUrl].forEach((el) => el?.addEventListener("input", updateLiveTools));
  els.related?.addEventListener("change", updateLiveTools);
  els.content?.addEventListener("input", updateLiveTools);
  els.imageUrl?.addEventListener("input", () => { resetMediaPreview(); updateLiveTools(); });
  els.imageFile?.addEventListener("change", () => { const file = els.imageFile.files?.[0]; if (file) handleFeaturedImage(file).catch((e) => setMessage(e.message)); els.imageFile.value = ""; });
  els.imageRemove?.addEventListener("click", () => { els.imageUrl.value = ""; els.imageAlt.value = ""; els.imageCaption.value = ""; resetMediaPreview(); updateLiveTools(); });
  els.inlineImageButton?.addEventListener("click", () => els.inlineImageInput.click());
  els.inlineImageInput?.addEventListener("change", () => { const file = els.inlineImageInput.files?.[0]; if (file) handleInlineImage(file).catch((e) => setMessage(e.message)); els.inlineImageInput.value = ""; });
  els.insertReferences?.addEventListener("click", () => { els.content.focus(); document.execCommand("insertHTML", false, "<h2>Referencias</h2><ol><li>Escribe aquí la referencia bibliográfica.</li></ol>"); updateLiveTools(); });

  els.saveDraft?.addEventListener("click", () => save("draft").catch((e) => setMessage(e.message)));
  els.publish?.addEventListener("click", () => save("published").catch((e) => setMessage(e.message)));
  els.schedule?.addEventListener("click", () => save("scheduled").catch((e) => setMessage(e.message)));
  els.preview?.addEventListener("click", showPreview);
  els.previewClose?.addEventListener("click", () => els.previewDialog.close());
  els.previewDesktop?.addEventListener("click", () => { els.previewFrame.classList.remove("mobile"); els.previewDesktop.classList.add("active"); els.previewMobile.classList.remove("active"); });
  els.previewMobile?.addEventListener("click", () => { els.previewFrame.classList.add("mobile"); els.previewMobile.classList.add("active"); els.previewDesktop.classList.remove("active"); });
  els.deleteButton?.addEventListener("click", () => deleteArticle().catch((e) => setMessage(e.message)));

  document.querySelectorAll(".articles-filters button").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter; document.querySelectorAll(".articles-filters button").forEach((b) => b.classList.toggle("active", b === button)); renderList();
  }));

  document.querySelectorAll(".editor-toolbar button[data-command]").forEach((button) => button.addEventListener("click", () => {
    els.content.focus(); document.execCommand(button.dataset.command, false, button.dataset.value || null); updateLiveTools();
  }));
  document.querySelector('.editor-toolbar button[data-action="link"]')?.addEventListener("click", () => {
    const url = window.prompt("URL del enlace:"); if (!url) return; els.content.focus(); document.execCommand("createLink", false, url); updateLiveTools();
  });
  els.toolbarBlock?.addEventListener("change", () => { els.content.focus(); document.execCommand("formatBlock", false, els.toolbarBlock.value); updateLiveTools(); });
  els.toolbarFont?.addEventListener("change", () => { if (!els.toolbarFont.value) return; els.content.focus(); document.execCommand("fontName", false, els.toolbarFont.value); updateLiveTools(); });
  els.toolbarSize?.addEventListener("change", () => { els.content.focus(); document.execCommand("fontSize", false, els.toolbarSize.value); updateLiveTools(); });

  (async function init() {
    session = getSession();
    const user = await currentUser();
    if (user) { showApp(); loadArticles().catch((e) => setMessage(e.message)); }
    else { saveSession(null); showLogin(); }
  })();
})();
