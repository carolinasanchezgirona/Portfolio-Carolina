(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const STORAGE_URL = `${SUPABASE_URL}/storage/v1`;
  const SESSION_KEY = "dememoria_admin_session";
  const BUCKET = "article-images";
  const TARGET_BYTES = 4.5 * 1024 * 1024;
  const MAX_SOURCE_BYTES = 18 * 1024 * 1024;
  const MAX_DIMENSION = 2200;

  const $ = (selector) => document.querySelector(selector);
  const setMessage = (text) => { const el = $("#article-message"); if (el) el.textContent = text || ""; };

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
    catch { return null; }
  }

  async function getPublishableKey() {
    const response = await fetch("/admin-articles.js", { cache: "force-cache" });
    const source = await response.text();
    const match = source.match(/sb_publishable_[A-Za-z0-9_-]+/);
    if (!match) throw new Error("No se ha podido preparar la subida de imágenes.");
    return match[0];
  }

  function slugify(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
  }

  async function optimize(file) {
    if (!file) throw new Error("Selecciona una imagen.");
    const accepted = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!accepted.includes(file.type)) throw new Error("Formato no compatible. Usa JPG, PNG, WebP o GIF.");
    if (file.size > MAX_SOURCE_BYTES) throw new Error("La imagen supera 18 MB. Reduce su tamaño antes de subirla.");
    if (file.type === "image/gif") {
      if (file.size > TARGET_BYTES) throw new Error("El GIF supera 4,5 MB. Reduce su tamaño antes de subirlo.");
      return file;
    }

    if (file.type === "image/webp" && file.size <= TARGET_BYTES) return file;

    setMessage("Optimizando imagen…");
    let bitmap;
    try { bitmap = await createImageBitmap(file); }
    catch { throw new Error("No puedo leer esta imagen. Prueba con JPG, PNG o WebP."); }

    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("No se ha podido preparar la imagen.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    for (const quality of [0.86, 0.8, 0.74, 0.68]) {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (blob && blob.size <= TARGET_BYTES) {
        return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
      }
    }
    throw new Error("La imagen sigue siendo demasiado grande después de optimizarla.");
  }

  async function upload(file) {
    const session = getSession();
    if (!session?.access_token) throw new Error("La sesión ha caducado. Vuelve a iniciar sesión.");
    const prepared = await optimize(file);
    const key = await getPublishableKey();
    const ext = (prepared.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
    const base = slugify(prepared.name.replace(/\.[^.]+$/, "")) || "imagen";
    const objectName = `${Date.now()}-${base}.${ext}`;

    setMessage("Subiendo imagen…");
    const response = await fetch(`${STORAGE_URL}/object/${BUCKET}/${encodeURIComponent(objectName)}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": prepared.type || "application/octet-stream",
        "x-upsert": "false"
      },
      body: prepared
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) throw new Error("No se ha autorizado la subida. Cierra sesión y vuelve a entrar.");
      if (response.status === 413) throw new Error("La imagen es demasiado grande para el servidor.");
      throw new Error(body.message || body.error || `No se ha podido subir la imagen (${response.status}).`);
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(objectName)}`;
  }

  async function featured(file) {
    const url = await upload(file);
    const imageUrl = $("#article-image-url");
    const imageAlt = $("#article-image-alt");
    if (imageUrl) {
      imageUrl.value = url;
      imageUrl.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (imageAlt && !imageAlt.value.trim()) {
      imageAlt.value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      imageAlt.dispatchEvent(new Event("input", { bubbles: true }));
    }
    setMessage("Imagen optimizada y subida correctamente.");
  }

  async function inline(file) {
    const url = await upload(file);
    const editor = $("#article-content");
    if (!editor) return;
    const alt = window.prompt("Texto ALT de la imagen:", file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")) || "";
    const caption = window.prompt("Pie de foto (opcional):", "") || "";
    const position = $("#inline-image-position")?.value || "wide";
    editor.focus();
    const html = `<figure class="article-media article-media-${position}"><img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy" decoding="async">${caption ? `<figcaption>${caption.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</figcaption>` : ""}</figure><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    setMessage("Imagen optimizada e insertada en el artículo.");
  }

  document.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "file") return;
    if (input.id !== "article-image-file" && input.id !== "inline-image-input") return;
    event.stopImmediatePropagation();
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    const task = input.id === "article-image-file" ? featured(file) : inline(file);
    task.catch((error) => setMessage(error?.message || "No se ha podido subir la imagen."));
  }, true);
})();
