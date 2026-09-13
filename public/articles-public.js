(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const main = document.querySelector("[data-articles-view]");
  if (!main) return;

  const select = "id,title,subtitle,slug,excerpt,content,category,featured,image_url,image_alt,image_caption,related_page,seo_title,seo_description,tags,cta_label,cta_url,published_at,scheduled_at,updated_at";
  const categoryLabel = (value) => value === "neuropsicologia" ? "Neuropsicología" : "Psicología";
  const formatDate = (value) => value ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(value)) : "";
  const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
  const plainText = (html) => { const d = document.createElement("div"); d.innerHTML = html || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); };
  const readingMinutes = (html) => { const words = plainText(html).split(/\s+/).filter(Boolean).length; return words ? Math.max(1, Math.ceil(words / 220)) : 0; };
  const isPublishedNow = (article) => !article.published_at || new Date(article.published_at).getTime() <= Date.now();

  async function request(path) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: KEY }, cache: "no-store" });
    if (!response.ok) throw new Error("No se han podido cargar los artículos.");
    return response.json();
  }

  function setMeta(name, content, property = false) {
    if (!content) return;
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let node = document.head.querySelector(selector);
    if (!node) { node = document.createElement("meta"); node.setAttribute(property ? "property" : "name", name); document.head.appendChild(node); }
    node.setAttribute("content", content);
  }

  function setCanonical(url) {
    let node = document.head.querySelector('link[rel="canonical"]');
    if (!node) { node = document.createElement("link"); node.setAttribute("rel", "canonical"); document.head.appendChild(node); }
    node.setAttribute("href", url);
  }

  function articleHref(slug) { return `/articulos/${encodeURIComponent(slug)}/`; }

  async function renderList() {
    const grid = document.querySelector("#articles-grid");
    const status = document.querySelector("#articles-status");
    const category = new URLSearchParams(window.location.search).get("categoria");
    document.querySelectorAll(".articles-filters a").forEach((link) => {
      const value = link.dataset.category;
      link.classList.toggle("active", (!category && value === "all") || category === value);
    });

    try {
      const rows = await request(`articles?select=${encodeURIComponent(select)}&status=eq.published&order=featured.desc,published_at.desc`);
      const visible = rows.filter(isPublishedNow);
      const articles = category === "psicologia" || category === "neuropsicologia" ? visible.filter((a) => a.category === category) : visible;
      grid.replaceChildren();
      if (!articles.length) { status.textContent = "Próximamente encontrarás aquí nuevos artículos."; status.hidden = false; return; }
      status.hidden = true;
      articles.forEach((article) => {
        const card = document.createElement("article");
        card.className = `articles-card${article.featured ? " featured" : ""}`;
        const href = articleHref(article.slug);
        const summary = article.subtitle || article.excerpt || "";
        const mins = readingMinutes(article.content);
        card.innerHTML = `${article.image_url ? `<a class="articles-card-image" href="${href}" aria-label="Leer ${escapeHtml(article.title)}"><img src="${escapeHtml(article.image_url)}" alt="${escapeHtml(article.image_alt || "")}" loading="lazy"></a>` : ""}<div class="articles-card-body"><div class="articles-card-meta"><span class="articles-card-category">${categoryLabel(article.category)}</span>${article.published_at ? `<span>${formatDate(article.published_at)}</span>` : ""}${mins ? `<span>${mins} min</span>` : ""}</div><h2><a href="${href}">${escapeHtml(article.title)}</a></h2>${summary ? `<p>${escapeHtml(summary)}</p>` : ""}<a class="articles-card-link" href="${href}">Leer artículo →</a></div>`;
        grid.append(card);
      });
    } catch (error) { status.hidden = false; status.textContent = error.message; }
  }

  function relatedLabel(path) {
    return ({ "/psicologia/": "Psicología General Sanitaria", "/neuropsicologia/": "Neuropsicología", "/ansiedad/": "Ansiedad", "/duelo/": "Duelo", "/deterioro-cognitivo/": "Deterioro cognitivo y memoria", "/evaluacion-neuropsicologica/": "Evaluación neuropsicológica" })[path] || "Información relacionada";
  }

  function slugFromLocation() {
    const fromQuery = new URLSearchParams(window.location.search).get("slug");
    if (fromQuery) return fromQuery;
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts[0] === "articulos" && parts[1] && parts[1] !== "leer") return decodeURIComponent(parts[1]);
    return "";
  }

  function buildToc(content) {
    const toc = document.querySelector("#article-toc");
    const links = document.querySelector("#article-toc-links");
    const headings = Array.from(content.querySelectorAll("h2,h3"));
    links.replaceChildren();
    if (headings.length < 2) { toc.hidden = true; return; }
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `seccion-${index + 1}`;
      const a = document.createElement("a");
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent || `Sección ${index + 1}`;
      if (heading.tagName === "H3") a.className = "toc-h3";
      links.append(a);
    });
    toc.hidden = false;
  }

  async function renderDetail() {
    const loading = document.querySelector("#article-loading");
    const shell = document.querySelector("#article-shell");
    const slug = slugFromLocation();
    if (!slug) { loading.textContent = "No se ha indicado ningún artículo."; return; }
    try {
      const rows = await request(`articles?select=${encodeURIComponent(select)}&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      const article = rows?.[0];
      if (!article || !isPublishedNow(article)) { loading.textContent = "Este artículo no está disponible."; return; }

      const title = article.seo_title || article.title;
      const description = article.seo_description || article.excerpt || article.subtitle || "Artículo de Psicología y Neuropsicología de Carolina Sánchez Girona.";
      const canonical = `https://carolinasanchezgirona.com/articulos/${encodeURIComponent(article.slug)}/`;
      document.title = `${title} | Carolina Sánchez`;
      setMeta("description", description);
      setMeta("og:title", title, true); setMeta("og:description", description, true); setMeta("og:url", canonical, true);
      if (article.image_url) setMeta("og:image", article.image_url, true);
      setCanonical(canonical);

      document.querySelector("#article-category").textContent = categoryLabel(article.category);
      document.querySelector("#article-title").textContent = article.title;
      const subtitle = document.querySelector("#article-subtitle"); subtitle.textContent = article.subtitle || ""; subtitle.hidden = !article.subtitle;
      const excerpt = document.querySelector("#article-excerpt"); excerpt.textContent = article.excerpt || ""; excerpt.hidden = !article.excerpt;
      const date = document.querySelector("#article-date"); date.textContent = article.published_at ? `Publicado el ${formatDate(article.published_at)}` : "";
      document.querySelector("#article-reading-time").textContent = `${readingMinutes(article.content)} min de lectura`;

      const tags = document.querySelector("#article-tags"); tags.replaceChildren();
      (Array.isArray(article.tags) ? article.tags : []).forEach((tag) => { const span = document.createElement("span"); span.textContent = tag; tags.append(span); });
      tags.hidden = !tags.children.length;

      const figure = document.querySelector("#article-figure");
      if (article.image_url) {
        const image = document.querySelector("#article-image"); image.src = article.image_url; image.alt = article.image_alt || "";
        const caption = document.querySelector("#article-image-caption"); caption.textContent = article.image_caption || ""; caption.hidden = !article.image_caption;
        figure.hidden = false;
      }

      const content = document.querySelector("#article-content"); content.innerHTML = article.content || ""; buildToc(content);

      const cta = document.querySelector("#article-cta");
      if (article.cta_label && article.cta_url) { const link = document.querySelector("#article-cta-link"); link.href = article.cta_url; link.textContent = `${article.cta_label} →`; cta.hidden = false; }

      const related = document.querySelector("#article-related");
      const relatedLink = document.querySelector("#article-related-link");
      if (article.related_page) { relatedLink.href = article.related_page; relatedLink.textContent = `Ver ${relatedLabel(article.related_page)} →`; related.hidden = false; }

      const schema = document.createElement("script"); schema.type = "application/ld+json";
      schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: article.title, description, datePublished: article.published_at || undefined, dateModified: article.updated_at, author: { "@type": "Person", name: "Carolina Sánchez Girona", url: "https://carolinasanchezgirona.com/sobre-mi/" }, mainEntityOfPage: canonical, image: article.image_url || "https://carolinasanchezgirona.com/carolina-sanchez-retrato.jpg", keywords: Array.isArray(article.tags) ? article.tags.join(", ") : undefined });
      document.head.appendChild(schema);

      loading.hidden = true; shell.hidden = false;
    } catch (error) { loading.textContent = error.message; }
  }

  if (main.dataset.articlesView === "detail") renderDetail(); else renderList();
})();
