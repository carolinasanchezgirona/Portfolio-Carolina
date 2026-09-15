(() => {
  "use strict";
  const dialog = document.querySelector("#clinic-patient-dialog");
  const heading = dialog?.querySelector(".clinic-dialog-heading");
  const nameNode = document.querySelector("#clinic-patient-name");
  const contact = document.querySelector("#clinic-patient-contact");
  if (!dialog || !heading || !nameNode || !contact) return;

  if (!document.querySelector("#clinic-rebook")) {
    const button = document.createElement("button");
    button.id = "clinic-rebook";
    button.type = "button";
    button.className = "clinic-secondary";
    button.textContent = "Volver a citar";
    button.style.marginLeft = "auto";
    button.addEventListener("click", () => {
      const raw = nameNode.textContent || "";
      const name = raw.includes(" · ") ? raw.split(" · ").slice(1).join(" · ").trim() : raw.trim();
      const spans = Array.from(contact.querySelectorAll("span")).map((node) => (node.textContent || "").trim()).filter(Boolean);
      const email = spans.find((value) => value.includes("@")) || "";
      const phone = spans.find((value) => value !== email) || "";
      sessionStorage.setItem("clinic_rebook_draft", JSON.stringify({ name, email, phone, created_at: Date.now() }));
      window.location.href = "/admin/agenda/?rebook=1";
    });
    const close = heading.querySelector(".clinic-close");
    if (close) heading.insertBefore(button, close);
    else heading.append(button);
  }
})();