"use strict";

const filters = document.querySelector("#maqsad-filtrlari");
const groups = [...document.querySelectorAll(".strategy-goal-group")];
const count = document.querySelector("#maqsadlar-soni");
const search = filters.elements.q;
const direction = filters.elements.yonalish;
const year = filters.elements.yil;

function normalize(value) {
  return value.toLocaleLowerCase("uz").normalize("NFKC").replace(/['’‘ʻʼ]/g, "").trim();
}

const indexedGroups = groups.map((element) => ({
  element,
  items: [...element.querySelectorAll("[data-number]")].map((item) => ({
    item,
    title: normalize(item.querySelector("[data-title]").textContent),
    years: item.dataset.years.split(" "),
  })),
}));

const initialOpen = new Set(groups.filter((group) => group.open));

function restoreFilters() {
  const hash = location.hash.slice(1);
  const fragment = new URLSearchParams(hash);
  const target = groups.find((group) => group.id === hash);
  if (target) fragment.set(direction.name, target.dataset.direction);
  search.value = fragment.get("q") ?? "";
  for (const select of [direction, year]) {
    const value = fragment.get(select.name) ?? "";
    select.value = [...select.options].some((option) => option.value === value) ? value : "";
  }
  updateResults(false);
  if (direction.value) (target ?? document.getElementById("maqsadlar")).scrollIntoView();
}

function updateResults(saveState) {
  const query = normalize(search.value);
  const number = query.match(/^0*(\d{1,3})(?:\s*[-–—.]?\s*maqsad)?$/)?.[1];
  const terms = query.split(/\s+/).filter(Boolean);
  const active = Boolean(query || direction.value || year.value);
  let visible = 0;

  for (const { element, items } of indexedGroups) {
    const matchesDirection = !direction.value || element.dataset.direction === direction.value;
    let matches = 0;
    for (const { item, title, years } of items) {
      const matchesQuery = number ? item.dataset.number === number : terms.every((term) => title.includes(term));
      const matchesYear = !year.value || years.includes(year.value);
      item.hidden = !(matchesDirection && matchesQuery && matchesYear);
      matches += Number(!item.hidden);
    }
    element.hidden = matches === 0;
    element.open = active ? matches > 0 : initialOpen.has(element);
    visible += matches;
  }

  count.textContent = visible ? visible + " ta maqsad" : "Mos maqsad topilmadi.";
  if (!saveState) return;
  const state = new URLSearchParams();
  for (const field of [search, direction, year]) {
    if (field.value) state.set(field.name, field.value);
  }
  history.replaceState(null, "", state.size ? "#" + state : "#maqsadlar");
}

filters.addEventListener("submit", (event) => event.preventDefault());
filters.addEventListener("input", () => updateResults(true));
filters.addEventListener("reset", () => requestAnimationFrame(() => updateResults(true)));
window.addEventListener("hashchange", restoreFilters);
filters.hidden = false;
restoreFilters();
