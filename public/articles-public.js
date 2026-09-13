(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const main = document.querySelector("[data-articles-view]");
  if (!main) return;

  const select = "id,title,slug,excerpt,content,category,featured,image_url,related_page,seo_title,seo_description,published_at,updated_at";

  const categoryLabel = (value) => value === "neuropsicologia" ? "Neuropsicología" : "Psicología";
  const formatDate = (value) => value ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(value)) : "";
  const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);

  async function request(path) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: KEY }, cache: "no-store" });
    if (!response.ok) throw new Error("No se han podido cargar los artículos.");
    return response.json();
  }

  function setMeta(name, content, property = false) {
    if (!content) return;
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute(property ? "property" : "name", name);
      document.head.appendChild(node);
    }
    node.setAttribute("content", content);
  }

  function setCanonical(url) {
    let node = document.head.querySelector('link[rel="canonical"]');
    if (!node) {
      node = document.createElement("link");
      node.setAttribute("rel", "canonical");
      document.head.appendChild(node);
    }
    node.setAttribute("href", url);
  }

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
      const articles = category === "psicologia" || category === "neuropsicologia" ? rows.filter((a) => a.category === category) : rows;
      grid.replaceChildren();
      if (!articles.length) {
        status.textContent = "Próximamente encontrarás aquí nuevos artículos.";
        return;
      }
      status.hidden = true;
      articles.forEach((article) => {
        const card = document.createElement("article");
        card.className = `articles-card${article.featured ? " featured" : ""}`;
        const href = `/articulos/leer/?slug=${encodeURIComponent(article.slug)}`;
        card.innerHTML = `<div class="articles-card-meta"><span class="articles-card-category">${categoryLabel(article.category)}</span>${article.published_at ? `<span>${formatDate(article.published_at)}</span>` : ""}</div><h2><a href="${href}" style="color:inherit;text-decoration:none">${escapeHtml(article.title)}</a></h2>${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ""}<a class="articles-card-link" href="${href}">Leer artículo →</a>`;
        grid.append(card);
      });
    } catch (error) {
      status.hidden = false;
      status.textContent = error.message;
    }
  }

  function relatedLabel(path) {
    return ({
      "/psicologia/": "Psicología General Sanitaria",
      "/neuropsicologia/": "Neuropsicología",
      "/ansiedad/": "Ansiedad",
      "/duelo/": "Duelo",
      "/deterioro-cognitivo/": "Deterioro cognitivo y memoria",
      "/evaluacion-neuropsicologica/": "Evaluación neuropsicológica",
    })[path] || "Información relacionada";
  }

  async function renderDetail() {
    const loading = document.querySelector("#article-loading");
    const shell = document.querySelector("#article-shell");
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) {
      loading.textContent = "No se ha indicado ningún artículo.";
      return;
    }
    try {
      const rows = await request(`articles?select=${encodeURIComponent(select)}&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      const article = rows?.[0];
      if (!article) {
        loading.textContent = "Este artículo no está disponible.";
        return;
      }

      const title = article.seo_title || article.title;
      const description = article.seo_description || article.excerpt || "Artículo de Psicología y Neuropsicología de Carolina Sánchez Girona.";
      const canonical = `https://carolinasanchezgirona.com/articulos/leer/?slug=${encodeURIComponent(article.slug)}`;
      document.title = `${title} | Carolina Sánchez`;
      setMeta("description", description);
      setMeta("og:title", title, true);
      setMeta("og:description", description, true);
      setMeta("og:url", canonical, true);
      if (article.image_url) setMeta("og:image", article.image_url, true);
      setCanonical(canonical);

      document.querySelector("#article-category").textContent = categoryLabel(article.category);
      document.querySelector("#article-title").textContent = article.title;
      const excerpt = document.querySelector("#article-excerpt");
      excerpt.textContent = article.excerpt || "";
      excerpt.hidden = !article.excerpt;
      const date = document.querySelector("#article-date");
      date.textContent = article.published_at ? `Publicado el ${formatDate(article.published_at)}` : "";
      date.hidden = !article.published_at;
      document.querySelector("#article-content").innerHTML = article.content || "";

      const image = document.querySelector("#article-image");
      if (article.image_url) { image.src = article.image_url; image.hidden = false; }

      const related = document.querySelector("#article-related");
      const relatedLink = document.querySelector("#article-related-link");
      if (article.related_page) {
        relatedLink.href = article.related_page;
        relatedLink.textContent = `Ver ${relatedLabel(article.related_page)} →`;
        related.hidden = false;
      }

      const schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description,
        datePublished: article.published_at || undefined,
        dateModified: article.updated_at,
        author: { "@type": "Person", name: "Carolina Sánchez Girona", url: "https://carolinasanchezgirona.com/sobre-mi/" },
        mainEntityOfPage: canonical,
        image: article.image_url || "https://carolinasanchezgirona.com/carolina-sanchez-retrato.jpg",
      });
      document.head.appendChild(schema);

      loading.hidden = true;
      shell.hidden = false;
    } catch (error) {
      loading.textContent = error.message;
    }
  }

  if (main.dataset.articlesView === "detail") renderDetail();
  else renderList();
})();
