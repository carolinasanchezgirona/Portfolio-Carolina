(() => {
  "use strict";
  const deleteButton = document.querySelector("#article-delete");
  if (!deleteButton) return;
  let bypass = false;
  deleteButton.addEventListener("click", (event) => {
    if (bypass) { bypass = false; return; }
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!window.confirm("Vas a eliminar este artículo. Esta acción no se puede deshacer. ¿Quieres continuar?")) return;
    bypass = true;
    deleteButton.click();
  }, true);
})();