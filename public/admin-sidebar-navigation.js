(() => {
  "use strict";
  function normalize(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
  function initMenu(menu) {
    const search = menu.querySelector(".admin-nav-search");
    if (!search || search.dataset.ready === "true") return;
    search.dataset.ready = "true";
    const groups = [...menu.querySelectorAll(".admin-nav-group")];
    const quick = menu.querySelector(".admin-nav-quick");
    const empty = menu.querySelector(".admin-nav-no-results");
    let priorState = null;
    search.addEventListener("input", () => {
      const query = normalize(search.value);
      if (query && !priorState) priorState = groups.map(group => group.open);
      let count = 0;
      const update = container => {
        let visible = 0;
        container?.querySelectorAll("a").forEach(link => {
          const haystack = normalize(link.dataset.searchText || link.textContent);
          link.hidden = !haystack.includes(query);
          if (!link.hidden) { count++; visible++; }
        });
        return visible;
      };
      if (quick) quick.hidden = update(quick) === 0;
      groups.forEach(group => {
        const heading = normalize(group.querySelector("summary")?.textContent);
        const matchesGroup = !!query && heading.includes(query);
        const items = [...group.querySelectorAll(".admin-nav-group-links a")];
        let visible = 0;
        items.forEach(link => {
          const haystack = normalize(link.dataset.searchText || link.textContent);
          link.hidden = !matchesGroup && !haystack.includes(query);
          if (!link.hidden) { visible++; count++; }
        });
        group.hidden = visible === 0;
        if (query) group.open = visible > 0;
      });
      if (!query && priorState) {
        groups.forEach((group, index) => { group.open = priorState[index]; group.hidden = false; });
        priorState = null;
      }
      if (empty) empty.hidden = count !== 0;
    });
  }
  document.querySelectorAll(".admin-sidebar-navigation").forEach(initMenu);
})();
