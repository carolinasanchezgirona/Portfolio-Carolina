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

  guardClick("#appointment-cancel-booking", "Vas a cancelar esta cita. Esta acción cambiará su estado y dejará de contar como cita activa. ¿Quieres continuar?");
})();