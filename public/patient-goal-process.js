/* Patient goals: voluntary publication, server-verified session, no browser persistence. */
(() => {
  "use strict";
  const list = document.getElementById("space-goals-list");
  const message = document.getElementById("space-goals-message");
  const shell = document.getElementById("space-shell");
  if (!list || !message || !shell) return;

  let requestNumber = 0;
  let controller = null;

  function clear(text) {
    list.replaceChildren();
    message.textContent = text || "";
  }

  function render(goals) {
    list.replaceChildren();
    if (!goals.length) {
      message.textContent = "Tus objetivos aparecerán aquí cuando los hayamos revisado y compartido en consulta.";
      return;
    }
    message.textContent = "";
    for (const item of goals) {
      if (!item || typeof item.title !== "string" || !item.title.trim()) continue;
      const article = document.createElement("article");
      article.className = "space-clinical-goal";
      const title = document.createElement("h4");
      title.textContent = item.title.slice(0, 220);
      article.append(title);
      if (typeof item.description === "string" && item.description.trim()) {
        const description = document.createElement("p");
        description.textContent = item.description.slice(0, 2000);
        article.append(description);
      }
      list.append(article);
    }
    if (!list.children.length) message.textContent = "No hay objetivos disponibles para mostrar.";
  }

  async function load() {
    if (shell.hidden) return;
    const current = ++requestNumber;
    if (controller) controller.abort();
    controller = new AbortController();
    clear("Consultando los objetivos compartidos…");
    try {
      const response = await fetch("/api/patient-portal/session", {
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (current !== requestNumber || shell.hidden) return;
      if (!response.ok) {
        clear(response.status === 401 ? "" : "No se han podido cargar los objetivos. Puedes volver a intentarlo más tarde.");
        return;
      }
      const data = await response.json();
      if (current !== requestNumber || shell.hidden) return;
      if (data?.authenticated !== true || !Array.isArray(data.goals)) {
        clear("No se han podido consultar los objetivos compartidos.");
        return;
      }
      render(data.goals);
    } catch {
      if (current === requestNumber && !shell.hidden && !controller?.signal.aborted) {
        clear("No se han podido cargar los objetivos. Puedes volver a intentarlo más tarde.");
      }
    }
  }

  function lock() {
    ++requestNumber;
    if (controller) controller.abort();
    clear("");
  }

  window.addEventListener("patient-portal-view-ready", () => { void load(); });
  document.addEventListener("patient-portal-locked", lock);
  // The portal might authenticate before this module finishes loading.
  if (!shell.hidden) void load();
})();
