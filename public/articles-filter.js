(() => {
  "use strict";
  const params = new URLSearchParams(window.location.search);
  const category = params.get("categoria");
  const active = category === "psicologia" || category === "neuropsicologia" ? category : "all";

  document.querySelectorAll(".articles-filters a[data-category]").forEach((link) => {
    link.classList.toggle("active", link.dataset.category === active);
  });

  document.querySelectorAll("[data-article-category]").forEach((card) => {
    card.hidden = active !== "all" && card.dataset.articleCategory !== active;
  });

  const visible = document.querySelectorAll("[data-article-category]:not([hidden])").length;
  const status = document.querySelector("#articles-status");
  if (status) {
    status.hidden = visible > 0;
    if (!visible) status.textContent = "Próximamente encontrarás aquí nuevos artículos.";
  }
})();
