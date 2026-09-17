(() => {
  "use strict";

  let deferredPrompt = null;
  const actions = document.querySelector(".clinic-top-actions");
  if (!actions) return;

  let installButton = document.querySelector("#clinic-pwa-install");
  if (!installButton) {
    installButton = document.createElement("button");
    installButton.id = "clinic-pwa-install";
    installButton.className = "clinic-secondary";
    installButton.type = "button";
    installButton.textContent = "Instalar app";
    actions.insertBefore(installButton, actions.lastElementChild);
  }

  let installHint = document.querySelector("#clinic-pwa-install-hint");
  if (!installHint) {
    installHint = document.createElement("p");
    installHint.id = "clinic-pwa-install-hint";
    installHint.className = "clinic-muted";
    installHint.hidden = true;
    const topbar = document.querySelector(".clinic-topbar");
    topbar?.insertAdjacentElement("afterend", installHint);
  }

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isAndroid = /android/i.test(window.navigator.userAgent);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("[clinic-pwa] No se ha podido registrar el service worker", error);
      });
    });
  }

  if (isStandalone) {
    installButton.hidden = true;
    return;
  }

  installButton.hidden = false;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  installButton.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      return;
    }

    if (!installHint) return;

    if (isIOS) {
      installHint.textContent = "En iPhone o iPad: toca Compartir y después “Añadir a pantalla de inicio”.";
    } else if (isAndroid) {
      installHint.textContent = "Si no aparece la ventana de instalación, abre el menú del navegador y toca “Instalar aplicación” o “Añadir a pantalla de inicio”.";
    } else {
      installHint.textContent = "Abre el menú del navegador y elige “Instalar aplicación” o “Crear acceso directo”.";
    }
    installHint.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    installButton.hidden = true;
    if (installHint) installHint.hidden = true;
  });
})();
