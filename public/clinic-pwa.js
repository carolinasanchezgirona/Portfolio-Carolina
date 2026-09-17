(() => {
  "use strict";

  let deferredPrompt = null;
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

  const loginForm = document.querySelector("#clinic-login-form");
  const topActions = document.querySelector(".clinic-top-actions");

  const ensureInstallButton = (container, className = "clinic-secondary") => {
    if (!container) return null;
    const existing = container.querySelector("[data-clinic-pwa-install]");
    if (existing) return existing;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.clinicPwaInstall = "true";
    button.className = className;
    button.textContent = "Instalar Mi clínica";

    if (container === loginForm) {
      const backLink = container.querySelector(".clinic-back");
      if (backLink) container.insertBefore(button, backLink);
      else container.appendChild(button);
    } else {
      const logout = container.querySelector("#clinic-logout");
      if (logout) container.insertBefore(button, logout);
      else container.appendChild(button);
    }

    return button;
  };

  const loginButton = ensureInstallButton(loginForm, "clinic-secondary clinic-pwa-install-login");
  const appButton = ensureInstallButton(topActions, "clinic-secondary");
  const installButtons = [loginButton, appButton].filter(Boolean);

  const ensureHint = () => {
    if (!loginForm) return null;
    let hint = loginForm.querySelector("#clinic-pwa-install-hint");
    if (!hint) {
      hint = document.createElement("p");
      hint.id = "clinic-pwa-install-hint";
      hint.className = "clinic-muted clinic-pwa-install-hint";
      hint.hidden = true;
      const install = loginForm.querySelector("[data-clinic-pwa-install]");
      install?.insertAdjacentElement("afterend", hint);
    }
    return hint;
  };

  const installHint = ensureHint();

  const hideInstallControls = () => {
    installButtons.forEach((button) => { button.hidden = true; });
    if (installHint) installHint.hidden = true;
  };

  const showInstructions = () => {
    if (!installHint) return;
    if (isIOS) {
      installHint.textContent = "En iPhone o iPad: toca Compartir y después “Añadir a pantalla de inicio”.";
    } else if (isAndroid) {
      installHint.textContent = "Si no se abre el instalador, abre el menú del navegador y toca “Instalar aplicación” o “Añadir a pantalla de inicio”.";
    } else {
      installHint.textContent = "Si no se abre el instalador, usa el menú del navegador y elige “Instalar aplicación” o “Crear acceso directo”.";
    }
    installHint.hidden = false;
  };

  if (isStandalone) {
    hideInstallControls();
    return;
  }

  installButtons.forEach((button) => { button.hidden = false; });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  installButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        return;
      }
      showInstructions();
    });
  });

  window.addEventListener("appinstalled", hideInstallControls);
})();
