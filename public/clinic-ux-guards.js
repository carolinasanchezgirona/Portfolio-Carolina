(() => {
  "use strict";

  function guardClick(selector, message) {
    const element = document.querySelector(selector);
    if (!element) return;
    let bypass = false;
    element.addEventListener("click", (event) => {
      if (bypass) { bypass = false; return; }
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!window.confirm(message)) return;
      bypass = true;
      element.click();
    }, true);
  }

  guardClick("#clinic-approve-session", "Vas a aprobar y cerrar este registro clínico. Después no podrá sobrescribirse. ¿Quieres continuar?");
  guardClick("#clinic-approve-report", "Vas a aprobar este informe. Después quedará bloqueado y no podrá modificarse ni eliminarse. ¿Quieres continuar?");
})();
// deployment refresh 2026-09-15
