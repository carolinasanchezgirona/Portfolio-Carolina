(() => {
  "use strict";

  // El selector público reenvía cada cambio al botón de su vista.
  // La lista de espera añade su botón al cargar.
  const tabs = document.querySelector(".admin-page .agenda-view-tabs-source");
  const select = document.querySelector("#admin-agenda-view-select");
  if (!tabs || !select) return;

  let refreshQueued = false;
  function refresh() {
    refreshQueued = false;
    const buttons = Array.from(tabs.querySelectorAll("button[id]"));
    const original = Array.from(select.options).map(option => option.value);
    const next = buttons.map(button => button.id);
    const active = buttons.find(button => button.classList.contains("active"));

    if (original.length !== next.length || original.some((id, index) => id !== next[index])) {
      select.replaceChildren(...buttons.map(button => {
        const option = document.createElement("option");
        option.value = button.id;
        option.textContent = button.textContent.trim();
        return option;
      }));
    }

    if (active) select.value = active.id;
  }

  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    queueMicrotask(refresh);
  }

  select.addEventListener("change", () => {
    const target = Array.from(tabs.querySelectorAll("button[id]"))
      .find(button => button.id === select.value);
    if (target) target.click();
    queueRefresh();
  });

  const observer = new MutationObserver(queueRefresh);
  observer.observe(tabs, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  refresh();
})();
