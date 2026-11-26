"use strict";

const controls = document.querySelector(".controls");
const filters = [...controls.querySelectorAll("[data-filter]")];
const search = controls.querySelector("input");
const empty = document.querySelector(".empty");
const count = document.querySelector("#result-count");

function normalizeSearch(value) {
  return value.toLowerCase().replace(/['’‘ʻʼ]/g, "").replace(/[–—]/g, "-").trim();
}

const reforms = [...document.querySelectorAll(".reform")].map((element) => ({
  element,
  state: element.dataset.state,
  text: normalizeSearch(element.textContent),
}));

function updateResults() {
  const activeFilter = filters.find((button) => button.getAttribute("aria-pressed") === "true").dataset.filter;
  const terms = normalizeSearch(search.value).split(/\s+/).filter(Boolean);
  let visible = 0;

  for (const reform of reforms) {
    const matchesState = activeFilter === "all" || activeFilter === reform.state;
    const matchesSearch = terms.every((term) => reform.text.includes(term));
    reform.element.hidden = !(matchesState && matchesSearch);
    visible += Number(!reform.element.hidden);
  }

  empty.hidden = visible > 0;
  count.textContent = visible + " ta natija";
}

for (const button of filters) {
  button.addEventListener("click", () => {
    for (const filter of filters) {
      filter.setAttribute("aria-pressed", String(filter === button));
    }
    updateResults();
  });
}

search.addEventListener("input", updateResults);
controls.hidden = false;
