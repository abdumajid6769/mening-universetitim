"use strict";

const mainPanels = [...document.querySelectorAll("[data-main-panel]")];
const sectionSwitches = [...document.querySelectorAll("[data-section-switch]")];

function activateMainPanel(id, updateAddress = true, shouldScroll = true) {
  for (const panel of mainPanels) panel.hidden = panel.id !== id;
  for (const control of sectionSwitches) {
    const selected = control.dataset.sectionSwitch === id;
    control.setAttribute("aria-pressed", String(selected));
    if (control.matches('[role="tab"]')) control.setAttribute("aria-selected", String(selected));
  }
  if (updateAddress && location.hash !== "#" + id) history.pushState(null, "", "#" + id);
  if (shouldScroll) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

for (const control of sectionSwitches) {
  control.addEventListener("click", () => activateMainPanel(control.dataset.sectionSwitch));
}

for (const tab of document.querySelectorAll('.main-nav [role="tab"]')) {
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll('.main-nav [role="tab"]')];
    const index = tabs.indexOf(tab);
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    tabs[next].focus();
    activateMainPanel(tabs[next].dataset.sectionSwitch);
  });
}

for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    const panel = target?.closest("[data-main-panel]");
    if (!panel) return;
    event.preventDefault();
    activateMainPanel(panel.id, false, false);
    history.pushState(null, "", link.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const initialTarget = location.hash ? document.querySelector(location.hash) : null;
const initialPanel = initialTarget?.closest("[data-main-panel]");
activateMainPanel(initialPanel?.id || "tarix", false, false);
if (initialPanel) requestAnimationFrame(() => initialTarget.scrollIntoView({ block: "start" }));
window.addEventListener("popstate", () => {
  const target = location.hash ? document.querySelector(location.hash) : null;
  const panel = target?.closest("[data-main-panel]") || (target?.matches("[data-main-panel]") ? target : null);
  activateMainPanel(panel?.id || "tarix", false, false);
  if (panel && target) target.scrollIntoView({ block: "start" });
});

function normalizeSearch(value) {
  return value.toLocaleLowerCase(document.documentElement.lang)
    .replace(/['’‘ʻʼ]/g, "")
    .replace(/[–—]/g, "-")
    .trim();
}

for (const list of document.querySelectorAll("[data-list]")) {
  const controls = list.querySelector(".controls");
  const filters = [...controls.querySelectorAll("[data-filter]")];
  const search = controls.querySelector("input");
  const empty = list.querySelector(".empty");
  const count = list.querySelector("[data-result-count]");
  const items = [...list.querySelectorAll("[data-item]")].map((element) => ({
    element,
    category: element.dataset.item,
    text: normalizeSearch(element.innerText),
  }));
  let activeCategory = "all";

  function updateResults() {
    const terms = normalizeSearch(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;

    for (const item of items) {
      const matchesCategory = activeCategory === "all" || activeCategory === item.category;
      const matchesSearch = terms.every((term) => item.text.includes(term));
      item.element.hidden = !(matchesCategory && matchesSearch);
      visible += Number(!item.element.hidden);
    }

    empty.hidden = visible > 0;
    count.textContent = list.dataset.count.replace("{n}", String(visible));
  }

  for (const button of filters) {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      for (const filter of filters) {
        filter.setAttribute("aria-pressed", String(filter === button));
      }
      updateResults();
    });
  }

  search.addEventListener("input", updateResults);
  controls.hidden = false;
  updateResults();
}

const viewer = document.querySelector("#photo-viewer");
const viewerImage = viewer.querySelector("img");
const viewerTitle = viewer.querySelector("#photo-title");

for (const link of document.querySelectorAll("[data-photo]")) {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof viewer.showModal !== "function") return;

    event.preventDefault();
    const caption = link.querySelector("img").alt;
    viewerTitle.textContent = caption;
    viewerImage.alt = caption;
    viewerImage.src = link.href;
    viewer.showModal();
  });
}

viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});
