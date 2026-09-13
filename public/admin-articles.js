(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const AUTH_URL = `${SUPABASE_URL}/auth/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ALLOWED_USER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";

  const $ = (s) => document.querySelector(s);
  const els = {
    login: $("#articles-login"), loginForm: $("#articles-login-form"), email: $("#articles-email"), password: $("#articles-password"), loginMessage: $("#articles-login-message"),
    app: $("#articles-app"), logout: $("#articles-logout"), newButton: $("#article-new"), list: $("#articles-list"), count: $("#articles-count"),
    form: $("#article-form"), empty: $("#articles-empty"), editorTitle: $("#article-editor-title"), id: $("#article-id"), title: $("#article-title"), slug: $("#article-slug"),
    category: $("#article-category"), excerpt: $("#article-excerpt"), content: $("#article-content"), featured: $("#article-featured"), related: $("#article-related-page"), imageUrl: $("#article-image-url"),
    seoTitle: $("#article-seo-title"), seoDescription: $("#article-seo-description"), message: $("#article-message"), statusLabel: $("#article-status-label"),
    saveDraft: $("#article-save-draft"), publish: $("#article-publish"), preview: $("#article-preview"), deleteButton: $("#article-delete"),
    previewDialog: $("#article-preview-dialog"), previewClose: $("#preview-close"), previewCategory: $("#preview-category"), previewTitle: $("#preview-title"), previewExcerpt: $("#preview-excerpt"), previewContent: $("#preview-content"),
  };

  let session = null;
  let articles = [];
  let activeFilter = "all";
  let currentStatus = "draft";

  function setMessage(text) { els.message.textContent = text || ""; }
  function setLoginMessage(text) { els.loginMessage.textContent = text || ""; }
  function authHeaders(extra = {}) { return { apikey: KEY, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", ...extra }; }

  function saveSession(value) {
    session = value;
    if (value) sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }

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

  function slugify(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 180);
  }

  function plainTextFromHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return (div.textContent || "").replace(/\s+/g, " ").trim();
  }

  function smartSeo() {
    if (!els.seoTitle.value.trim()) els.seoTitle.value = `${els.title.value.trim()} | Carolina Sánchez`.slice(0, 70);
    if (!els.seoDescription.value.trim()) {
      const source = els.excerpt.value.trim() || plainTextFromHtml(els.content.innerHTML);
      els.seoDescription.value = source.slice(0, 165);
    }
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
    const rows = articles.filter((a) => activeFilter === "all" || a.status === activeFilter);
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
      const button = document.createElement("button");
      button.type = "button";
      button.className = `article-list-item${els.id.value === article.id ? " active" : ""}`;
      const cat = article.category === "neuropsicologia" ? "Neuropsicología" : "Psicología";
      button.innerHTML = `<strong>${escapeHtml(article.title)}</strong><span><i><b class="status-dot ${article.status === "published" ? "published" : ""}"></b>${article.status === "published" ? "Publicado" : "Borrador"}</i><i>${cat}${article.featured ? " · Destacado" : ""}</i></span>`;
      button.addEventListener("click", () => openArticle(article));
      els.list.append(button);
    });
  }

  function escapeHtml(value) { return String(value || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]); }

  function newArticle() {
    els.form.reset();
    els.id.value = "";
    els.content.innerHTML = "";
    els.category.value = "neuropsicologia";
    currentStatus = "draft";
    els.statusLabel.textContent = "Borrador nuevo";
    els.editorTitle.textContent = "Nuevo artículo";
    els.deleteButton.hidden = true;
    els.empty.hidden = true;
    els.form.hidden = false;
    setMessage("");
    renderList();
    els.title.focus();
  }

  function openArticle(a) {
    els.id.value = a.id;
    els.title.value = a.title || "";
    els.slug.value = a.slug || "";
    els.category.value = a.category || "neuropsicologia";
    els.excerpt.value = a.excerpt || "";
    els.content.innerHTML = a.content || "";
    els.featured.checked = Boolean(a.featured);
    els.related.value = a.related_page || "";
    els.imageUrl.value = a.image_url || "";
    els.seoTitle.value = a.seo_title || "";
    els.seoDescription.value = a.seo_description || "";
    currentStatus = a.status || "draft";
    els.statusLabel.textContent = currentStatus === "published" ? "Publicado" : "Borrador";
    els.editorTitle.textContent = "Editar artículo";
    els.deleteButton.hidden = false;
    els.empty.hidden = true;
    els.form.hidden = false;
    setMessage("");
    renderList();
  }

  function payload(status) {
    smartSeo();
    const now = new Date().toISOString();
    const existing = articles.find((a) => a.id === els.id.value);
    return {
      title: els.title.value.trim(),
      slug: slugify(els.slug.value || els.title.value),
      excerpt: els.excerpt.value.trim() || null,
      content: els.content.innerHTML.trim(),
      category: els.category.value,
      status,
      featured: els.featured.checked,
      image_url: els.imageUrl.value.trim() || null,
      related_page: els.related.value || null,
      seo_title: els.seoTitle.value.trim() || null,
      seo_description: els.seoDescription.value.trim() || null,
      updated_at: now,
      published_at: status === "published" ? (existing?.published_at || now) : null,
    };
  }

  async function save(status) {
    if (!els.title.value.trim()) return setMessage("Escribe el título del artículo.");
    if (!plainTextFromHtml(els.content.innerHTML)) return setMessage("Escribe el contenido del artículo.");
    if (!els.slug.value.trim()) els.slug.value = slugify(els.title.value);
    const body = payload(status);
    const id = els.id.value;
    setMessage(status === "published" ? "Publicando…" : "Guardando borrador…");
    const url = id ? `${REST_URL}/articles?id=eq.${encodeURIComponent(id)}` : `${REST_URL}/articles`;
    const r = await fetch(url, { method: id ? "PATCH" : "POST", headers: authHeaders({ Prefer: "return=representation" }), body: JSON.stringify(body) });
    const result = await r.json().catch(() => []);
    if (!r.ok) throw new Error(result.message || (result.code === "23505" ? "Ya existe un artículo con esa URL." : "No se ha podido guardar."));
    const savedId = id || result?.[0]?.id;
    currentStatus = status;
    await loadArticles(savedId);
    setMessage(status === "published" ? "Publicado correctamente." : "Borrador guardado.");
  }

  function showPreview() {
    els.previewCategory.textContent = els.category.value === "neuropsicologia" ? "Neuropsicología" : "Psicología";
    els.previewTitle.textContent = els.title.value.trim() || "Título del artículo";
    els.previewExcerpt.textContent = els.excerpt.value.trim();
    els.previewContent.innerHTML = els.content.innerHTML;
    els.previewDialog.showModal();
  }

  async function deleteArticle() {
    const id = els.id.value;
    if (!id) return;
    if (!window.confirm(`¿Eliminar definitivamente “${els.title.value.trim()}”?`)) return;
    setMessage("Eliminando…");
    const r = await fetch(`${REST_URL}/articles?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders() });
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      throw new Error(body.message || "No se ha podido eliminar.");
    }
    els.form.hidden = true;
    els.empty.hidden = false;
    els.id.value = "";
    await loadArticles();
  }

  els.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginMessage("Entrando…");
    try { await signIn(els.email.value.trim(), els.password.value); els.password.value = ""; showApp(); await loadArticles(); setLoginMessage(""); }
    catch (error) { setLoginMessage(error.message); }
  });

  els.logout?.addEventListener("click", () => { saveSession(null); showLogin(); });
  els.newButton?.addEventListener("click", newArticle);
  els.title?.addEventListener("input", () => { if (!els.id.value) els.slug.value = slugify(els.title.value); });
  els.saveDraft?.addEventListener("click", () => save("draft").catch((e) => setMessage(e.message)));
  els.publish?.addEventListener("click", () => save("published").catch((e) => setMessage(e.message)));
  els.preview?.addEventListener("click", showPreview);
  els.previewClose?.addEventListener("click", () => els.previewDialog.close());
  els.deleteButton?.addEventListener("click", () => deleteArticle().catch((e) => setMessage(e.message)));

  document.querySelectorAll(".articles-filters button").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".articles-filters button").forEach((b) => b.classList.toggle("active", b === button));
    renderList();
  }));

  document.querySelectorAll(".editor-toolbar button").forEach((button) => button.addEventListener("click", () => {
    const command = button.dataset.command;
    const value = button.dataset.value;
    els.content.focus();
    if (command === "createLink") {
      const url = window.prompt("URL del enlace:");
      if (url) document.execCommand("createLink", false, url);
      return;
    }
    document.execCommand(command, false, value || null);
  }));

  (async function init() {
    session = getSession();
    const user = await currentUser();
    if (user) { showApp(); loadArticles().catch((e) => setMessage(e.message)); }
    else { saveSession(null); showLogin(); }
  })();
})();
