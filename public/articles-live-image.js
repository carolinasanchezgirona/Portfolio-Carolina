(() => {
  "use strict";
  // Keep a statically exported article's cover in sync with its published editorial record.
  const header = document.querySelector(".article-detail .article-header");
  if (!header) return;
  let image = header.querySelector(".article-figure .article-image");
  const segments = location.pathname.split("/").filter(Boolean);
  if (segments[0] !== "articulos" || !segments[1] || segments[1] === "leer") return;
  // The outdated build included a second movie still as an inline figure.
  // Remove that duplicate on the canonical article while the static site rebuilds.
  if (segments[1] === "el-padre-pelicula-alzheimer-neuropsicologia") {
    document.querySelectorAll(".article-prose figure").forEach((figure) => {
      if (figure.querySelector('img[src*="5778282.jpg"]')) figure.remove();
    });
  }
  const slug = decodeURIComponent(segments[1]);
  const url = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/articles?" +
    "select=image_url,image_alt,image_caption&status=eq.published&slug=eq." +
    encodeURIComponent(slug) + "&limit=1";
  fetch(url, {
    cache: "no-store",
    headers: { apikey: "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii" },
  }).then((response) => {
    if (!response.ok) throw new Error("Article image lookup failed");
    return response.json();
  }).then((rows) => {
    const article = rows?.[0];
    if (!article || !article.image_url) return;
    if (!image) {
      const figure = document.createElement("figure");
      figure.className = "article-figure";
      image = document.createElement("img");
      image.className = "article-image";
      image.decoding = "async";
      image.alt = header.querySelector("h1")?.textContent || "Imagen del artículo";
      figure.appendChild(image);
      header.appendChild(figure);
    }
    if (image.getAttribute("src") !== article.image_url) image.src = article.image_url;
    if (article.image_alt) image.alt = article.image_alt;
    const figure = image.closest("figure");
    let caption = figure?.querySelector("figcaption");
    if (article.image_caption) {
      if (!caption) {
        caption = document.createElement("figcaption");
        figure?.appendChild(caption);
      }
      if (caption) caption.textContent = article.image_caption;
    } else if (caption) {
      caption.remove();
    }
  }).catch(() => {
    // Retain the server-rendered cover when the live API is unavailable.
  });
})();