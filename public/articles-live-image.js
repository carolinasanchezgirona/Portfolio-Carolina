(() => {
  "use strict";
  // Keep a statically exported article's cover in sync with its published editorial record.
  const image = document.querySelector(".article-header .article-figure .article-image");
  if (!image) return;
  const segments = location.pathname.split("/").filter(Boolean);
  if (segments[0] !== "articulos" || !segments[1] || segments[1] === "leer") return;
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