"use strict";

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
