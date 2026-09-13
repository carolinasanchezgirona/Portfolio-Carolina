(() => {
  "use strict";

  const form = document.querySelector("#booking-form");
  if (!form || document.querySelector("#whatsapp-reminder-consent")) return;

  const formMessage = document.querySelector("#form-message");
  const consent = document.createElement("div");
  consent.className = "acceptances";
  consent.innerHTML = `
    <label class="privacy-check">
      <input id="whatsapp-reminder-consent" name="whatsapp_reminder_consent" type="checkbox" />
      <span>
        Quiero recibir un recordatorio administrativo de esta cita por WhatsApp. Es opcional y no se enviará información clínica.
      </span>
    </label>
    <p class="form-help">Podrás seguir recibiendo el recordatorio por correo aunque no marques esta opción.</p>
  `;
  formMessage?.before(consent);

  form.addEventListener("submit", (event) => {
    const data = new FormData(form);
    const name = String(data.get("patient_name") || "").trim();
    const signer = String(data.get("signer_name") || "").trim();
    if (name && signer && signer !== name) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (formMessage) {
        formMessage.textContent = "La firma debe coincidir exactamente con el nombre y apellidos indicados.";
        formMessage.className = "form-message form-message-error";
      }
    }
  }, true);

  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
    if (!url.includes("/rpc/create_public_booking_v2")) {
      return originalFetch(input, init);
    }

    const nextUrl = url.replace("/rpc/create_public_booking_v2", "/rpc/create_public_booking_v3");
    let body = init.body;
    if (typeof body === "string") {
      try {
        const parsed = JSON.parse(body);
        parsed.p_whatsapp_reminder_consent = Boolean(document.querySelector("#whatsapp-reminder-consent")?.checked);
        body = JSON.stringify(parsed);
      } catch {
        // Si el cuerpo no fuera JSON, se conserva sin modificar.
      }
    }

    if (typeof input === "string") {
      return originalFetch(nextUrl, { ...init, body });
    }

    if (input instanceof Request) {
      const requestInit = {
        method: init.method || input.method,
        headers: init.headers || input.headers,
        body,
        cache: init.cache,
        credentials: init.credentials || input.credentials,
        mode: init.mode || input.mode,
        redirect: init.redirect || input.redirect,
        referrer: init.referrer || input.referrer,
        referrerPolicy: init.referrerPolicy || input.referrerPolicy,
        signal: init.signal || input.signal,
      };
      return originalFetch(new Request(nextUrl, requestInit));
    }

    return originalFetch(nextUrl, { ...init, body });
  };
})();
