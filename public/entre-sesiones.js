(() => {
  const ENDPOINT = "https://grgyvdxkjdstdyumdfyg.supabase.co/functions/v1/view-clinical-exercise";
  const SESSION_KEY = "between_sessions_access_token";

  const $ = (selector) => document.querySelector(selector);
  const loading = $("#between-loading");
  const emptyAccess = $("#between-empty-access");
  const error = $("#between-error");
  const errorTitle = $("#between-error-title");
  const errorCopy = $("#between-error-copy");
  const portal = $("#between-portal");
  const current = $("#between-current");
  const reviewedSection = $("#between-reviewed-section");
  const reviewedToggle = $("#between-reviewed-toggle");
  const reviewed = $("#between-reviewed");

  function getToken() {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("token") || "";
    if (/^[A-Za-z0-9_-]{40,}$/.test(fromUrl)) {
      sessionStorage.setItem(SESSION_KEY, fromUrl);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      return fromUrl;
    }
    const stored = sessionStorage.getItem(SESSION_KEY) || "";
    return /^[A-Za-z0-9_-]{40,}$/.test(stored) ? stored : "";
  }

  function showOnly(target) {
    [loading, emptyAccess, error, portal].forEach((el) => {
      if (el) el.hidden = el !== target;
    });
  }

  function formatDate(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(new Date(value));
    } catch {
      return "";
    }
  }

  function createExercise(item) {
    const details = document.createElement("details");
    details.className = "between-exercise";

    const summary = document.createElement("summary");
    const titleWrap = document.createElement("div");
    titleWrap.className = "between-exercise-title";

    const title = document.createElement("strong");
    title.textContent = item.title || "Ejercicio";

    const meta = document.createElement("div");
    meta.className = "between-exercise-meta";

    if (item.review_due_at) {
      const due = document.createElement("span");
      due.className = "between-badge";
      due.textContent = "Revisamos " + formatDate(item.review_due_at);
      meta.append(due);
    } else if (item.status === "reviewed") {
      const done = document.createElement("span");
      done.className = "between-badge";
      done.textContent = "Revisado en sesión";
      meta.append(done);
    } else {
      const active = document.createElement("span");
      active.className = "between-badge";
      active.textContent = "Indicado";
      meta.append(active);
    }

    titleWrap.append(title, meta);

    const chevron = document.createElement("span");
    chevron.className = "between-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = "⌄";

    summary.append(titleWrap, chevron);

    const body = document.createElement("div");
    body.className = "between-exercise-content";

    const copy = document.createElement("div");
    copy.className = "between-exercise-copy";
    copy.textContent = item.content || "";

    const actions = document.createElement("div");
    actions.className = "between-exercise-actions";

    const print = document.createElement("button");
    print.className = "between-print";
    print.type = "button";
    print.textContent = "Imprimir este ejercicio";
    print.addEventListener("click", () => {
      details.open = true;
      const originalTitle = document.title;
      document.title = item.title || "Entre Sesiones";
      window.print();
      document.title = originalTitle;
    });

    actions.append(print);
    body.append(copy, actions);
    details.append(summary, body);
    return details;
  }

  function renderList(target, items) {
    target.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "between-empty";
      empty.textContent = "No tienes ejercicios pendientes en este momento. Si habéis acordado uno en sesión y no aparece, solicita un nuevo enlace.";
      target.append(empty);
      return;
    }
    items.forEach((item, index) => {
      const node = createExercise(item);
      if (index === 0 && target === current) node.open = true;
      target.append(node);
    });
  }

  async function loadPortal() {
    const token = getToken();
    if (!token) {
      showOnly(emptyAccess);
      return;
    }

    try {
      const response = await fetch(ENDPOINT + "?format=json&token=" + encodeURIComponent(token), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        referrerPolicy: "no-referrer",
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.ok && !contentType.includes("application/json")) {
        window.location.replace(ENDPOINT + "?token=" + encodeURIComponent(token));
        return;
      }

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        sessionStorage.removeItem(SESSION_KEY);
        errorTitle.textContent = body.title || "Este enlace ya no está disponible";
        errorCopy.textContent = body.error || "Solicita un nuevo enlace a tu profesional.";
        showOnly(error);
        return;
      }

      const exercises = Array.isArray(body.exercises) ? body.exercises : [];
      const active = exercises.filter((item) => item.status !== "reviewed");
      const old = exercises.filter((item) => item.status === "reviewed");

      renderList(current, active);
      renderList(reviewed, old);
      reviewedSection.hidden = old.length === 0;
      showOnly(portal);
    } catch {
      errorTitle.textContent = "No hemos podido conectar con tu espacio";
      errorCopy.textContent = "Comprueba tu conexión e inténtalo de nuevo. Si continúa, solicita un nuevo enlace.";
      showOnly(error);
    }
  }

  reviewedToggle?.addEventListener("click", () => {
    const next = reviewedToggle.getAttribute("aria-expanded") !== "true";
    reviewedToggle.setAttribute("aria-expanded", String(next));
    reviewed.hidden = !next;
  });

  loadPortal();
})();
