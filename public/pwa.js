(() => {
  "use strict";

  let deferredPrompt = null;
  const installButton = document.querySelector("#pwa-install");
  const installHint = document.querySelector("#pwa-install-hint");

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  if (document.querySelector("#appointment-form") && !document.querySelector('script[data-admin-recurrence="true"]')) {
    const recurrenceScript = document.createElement("script");
    recurrenceScript.src = "/admin-recurrence.js?v=20260913-recurrence-2";
    recurrenceScript.defer = true;
    recurrenceScript.dataset.adminRecurrence = "true";
    document.head.appendChild(recurrenceScript);
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("[pwa] No se ha podido registrar el service worker", error);
      });
    });
  }

  if (isStandalone) {
    installButton?.setAttribute("hidden", "");
    installHint?.setAttribute("hidden", "");
    return;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton?.removeAttribute("hidden");
  });

  installButton?.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installButton.setAttribute("hidden", "");
      return;
    }

    if (isIOS && installHint) {
      installHint.textContent = "En iPhone o iPad: toca Compartir y después “Añadir a pantalla de inicio”.";
      installHint.removeAttribute("hidden");
    }
  });

  if (isIOS) {
    installButton?.removeAttribute("hidden");
  }

  window.addEventListener("appinstalled", () => {
    installButton?.setAttribute("hidden", "");
    installHint?.setAttribute("hidden", "");
  });
})();
