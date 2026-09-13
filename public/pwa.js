(() => {
  "use strict";

  let deferredPrompt = null;
  const installButton = document.querySelector("#pwa-install");
  const installHint = document.querySelector("#pwa-install-hint");

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  if (document.querySelector("#appointment-form") && !document.querySelector("style[data-admin-brand=true]")) {
    const brandStyle = document.createElement("style");
    brandStyle.dataset.adminBrand = "true";
    brandStyle.textContent = `
      .admin-primary{border-color:#11A6C2!important;background:#11A6C2!important;color:#FBF9F5!important}
      .admin-primary:hover{border-color:#075A68!important;background:#075A68!important}
      .admin-secondary,.admin-week-nav button{border-color:#9EDCE7!important;color:#11A6C2!important}
      .admin-secondary:hover,.admin-week-nav button:hover{border-color:#11A6C2!important;background:#EAF6F8!important}
      .admin-view-tabs button.active{background:#11A6C2!important;color:#FBF9F5!important;box-shadow:0 5px 16px rgba(17,166,194,.22)!important}
      .dot-psych{background:#11A6C2!important}
      .appointment-card{border-left-color:#11A6C2!important}
      .appointment-card-action{color:#11A6C2!important}
      .patient-history-list button:hover{background:#EAF6F8!important}
      .admin-top-actions a.admin-secondary{text-decoration:none}
    `;
    document.head.appendChild(brandStyle);
  }

  if (document.querySelector("#appointment-form") && !document.querySelector("#admin-articles-link")) {
    const topActions = document.querySelector(".admin-top-actions");
    if (topActions) {
      const link = document.createElement("a");
      link.id = "admin-articles-link";
      link.href = "/admin/articulos/";
      link.className = "admin-secondary";
      link.textContent = "Artículos";
      const accessButton = document.querySelector("#admin-access");
      topActions.insertBefore(link, accessButton || null);
    }
  }

  if (document.querySelector("#appointment-form") && !document.querySelector('script[data-admin-recurrence="true"]')) {
    const recurrenceScript = document.createElement("script");
    recurrenceScript.src = "/admin-recurrence.js?v=20260913-recurrence-2";
    recurrenceScript.defer = true;
    recurrenceScript.dataset.adminRecurrence = "true";
    document.head.appendChild(recurrenceScript);
  }

  if (document.querySelector("#appointment-form") && !document.querySelector('script[data-admin-communications="true"]')) {
    const communicationsScript = document.createElement("script");
    communicationsScript.src = "/admin-communications.js?v=20260913-communications-1";
    communicationsScript.defer = true;
    communicationsScript.dataset.adminCommunications = "true";
    document.head.appendChild(communicationsScript);
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
