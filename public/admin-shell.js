(() => {
  "use strict";
  if (window.location.pathname === "/admin/" || window.location.pathname.startsWith("/admin/clinica")) return;

  function addHomeLink() {
    if (document.querySelector('[data-admin-home-link="true"]')) return;
    const hosts = [
      ".clinic-top-actions",
      ".econ-top-links",
      ".admin-top-actions",
      ".articles-top-actions",
      ".resources-top-actions",
      ".questions-admin-topbar nav",
      ".clinic-dialog-heading"
    ];
    const host = hosts.map(s => document.querySelector(s)).find(Boolean);
    if (!host) return;
    const link = document.createElement("a");
    link.href = "/admin/";
    link.textContent = "Panel general";
    link.dataset.adminHomeLink = "true";
    link.className = "admin-home-link";
    host.prepend(link);
  }

  addHomeLink();
  const observer = new MutationObserver(addHomeLink);
  observer.observe(document.documentElement, { childList:true, subtree:true });
  setTimeout(() => observer.disconnect(), 5000);
})();
