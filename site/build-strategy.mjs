import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const documents = read("strategy-documents.json");
const catalogues = new Map([
  ["pf-21", read("strategy-goals-pf21.json")],
  ["pf-60", read("strategy-goals-pf60.json")],
]);
const goalEvidence = read("strategy-evidence.json");
const output = new URL("../strategiya/", import.meta.url);
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const link = (url, label) => `<a href="${escape(url)}">${escape(label)}</a>`;
const textLink = (url, text) => url + "#:~:text=" + encodeURIComponent(text).replace(/-/g, "%2D");
const goalFile = (number) => `maqsad-${String(number).padStart(2, "0")}.html`;
const documentFile = (document) => `${document.id}/index.html`;
const interpretation = "Natijalar e’lon qilingan davrga tegishli. Yakuniy ijro holati rasmiy tasdiq asosida ko‘rsatiladi.";
const noEvidence = "Bu maqsadning ijrosi bo‘yicha katalogga kiritilgan ochiq tasdiq hozircha yo‘q.";

function write(file, html) {
  const target = new URL(file, output);
  mkdirSync(new URL(".", target), { recursive: true });
  writeFileSync(target, html.replace(/^[ \t]+$/gm, ""));
}

function page(title, description, content, { nested = false, catalogue = false } = {}) {
  const base = nested ? "../../" : "../";
  const section = nested ? "../" : "";
  return `<!doctype html>
<html lang="uz">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#102f32">
  <meta name="description" content="${escape(description)}">
  <title>${escape(title)} · Suv Ufqi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&amp;family=Instrument+Serif:ital@0;1&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${base}style.css">
  <link rel="stylesheet" href="${section}strategiya.css">
  ${catalogue ? '<script src="strategiya.js" defer></script>' : ""}
</head>
<body class="strategy-page">
  <a class="skip" href="#main">Asosiy mazmunga o‘tish</a>
  <header class="masthead">
    <div class="wrap strategy-top">
      <a class="brand" href="${base}index.html"><span class="mark" aria-hidden="true">≋</span>TIQXMMI kutubxonasi</a>
      ${link(nested ? "../index.html" : "../index.html#strategiyalar", nested ? "Strategiyalar katalogi" : "Saytdagi Strategiyalar bo‘limi")}
    </div>
  </header>
  <main id="main">
${content}
  </main>
  <footer><div class="wrap">${link(base + "index.html", "Suv Ufqi")}</div></footer>
</body>
</html>
`;
}

function hero(label, title, description, crumbs = "", facts = []) {
  return `    <section class="strategy-hero" aria-labelledby="page-title">
      <div class="wrap">
        ${crumbs ? `<nav class="strategy-breadcrumb" aria-label="Sahifa yo‘li">${crumbs}</nav>` : ""}
        ${label ? `<p class="eyebrow">${escape(label)}</p>` : ""}
        <h1 id="page-title">${escape(title)}</h1>
        ${description ? `<p>${escape(description)}</p>` : ""}
        ${facts.length ? `<dl class="strategy-brief">${facts.map(([key, value]) => `<div><dt>${escape(key)}</dt><dd>${escape(value)}</dd></div>`).join("")}</dl>` : ""}
      </div>
    </section>`;
}

function jump(links) {
  return `    <div class="strategy-jump-bar"><nav class="wrap strategy-jump" aria-label="Sahifa bo‘limlari">${links.map(([id, label]) => link("#" + id, label)).join("")}</nav></div>`;
}

function block(id, title, content) {
  return `      <section class="strategy-block" id="${id}" aria-labelledby="${id}-nomi">
        <h2 id="${id}-nomi">${escape(title)}</h2>
        ${content}
      </section>`;
}

function tiles(items) {
  return `<div class="strategy-items">
          ${items.join("\n          ")}
        </div>`;
}

function record(label, title, content, sources = "") {
  return `<article class="strategy-record">
            <p class="strategy-tag">${escape(label)}</p>
            <h3>${escape(title)}</h3>
            ${content}
            ${sources ? `<footer>${sources}</footer>` : ""}
          </article>`;
}

function sourcesBlock(sources) {
  return block("manbalar", "Rasmiy hujjatlar va manbalar", `<ul class="strategy-sources">${sources.map(([label, url]) => `<li>${link(url, label)}</li>`).join("")}</ul>`);
}

function resultBlock(results, status) {
  const content = results.length
    ? tiles(results.map(([period, title, details, url, label]) => record(period, title, `<p>${escape(details)}</p>`, link(url, label))))
    : `<p>${noEvidence}</p>`;
  return block("ijro", "Amalga oshirilgan ishlar va natijalar", content + (status ? `<p class="strategy-notice">${escape(status)}</p>` : ""));
}

function planRecord([period, title, details, owner], document) {
  return record(period, title, `<p>${escape(details)}</p><p><strong>Mas’ul</strong> · ${escape(owner)}</p>`, link(document.source, document.sourceLabel ?? document.code));
}

function documentPage(document) {
  const data = catalogues.get(document.id);
  const links = [];
  const blocks = [];
  if (data) {
    links.push(["yonalishlar", "Ustuvor yo‘nalishlar"]);
    const groups = data.groups.map(({ id, title }) => {
      const goals = data.goals.filter((goal) => goal.direction === id);
      return record(`${id}-yo‘nalish · ${goals.length} ta maqsad`, title, "", link(`../index.html#yonalish=${document.id}-${id}`, "Maqsadlarni ko‘rish"));
    });
    blocks.push(block("yonalishlar", "Ustuvor yo‘nalishlar va maqsadlar", tiles(groups)));
  }
  if (document.plans?.length) {
    links.push(["reja", "Rejalashtirilgan ishlar"]);
    blocks.push(block("reja", "Rejalashtirilgan ishlar", tiles(document.plans.map((plan) => planRecord(plan, document)))));
  }
  links.push(["ijro", "Amalga oshirilgan ishlar"], ["manbalar", "Manbalar"]);
  blocks.push(resultBlock(document.results, interpretation));
  blocks.push(sourcesBlock([[document.sourceLabel ?? `LexUZ · ${document.code}`, document.source], ...document.links ?? []]));
  return page(document.title, document.intro, [
    hero(`${document.code} · ${document.period}`, document.title, document.intro, link("../index.html", "Taraqqiyot strategiyasi")),
    jump(links),
    `    <div class="wrap strategy-body">\n${blocks.join("\n")}\n    </div>`,
  ].join("\n"), { nested: true });
}

function indicatorRecord(indicator, document) {
  const table = indicator.values
    ? `<div class="strategy-table"><table>
              <caption>2025-yil bazasi va yillik reja</caption>
              <thead><tr><th scope="col">Yil</th><th scope="col">Turi</th><th scope="col">Qiymat</th></tr></thead>
              <tbody>${indicator.values.map((value, index) => `<tr><th scope="row">${2025 + index}</th><td>${index ? "Reja" : "Baza"}</td><td>${escape(!value || value === "-" ? "Belgilanmagan" : value)}</td></tr>`).join("")}</tbody>
            </table></div>`
    : `<p class="strategy-basis">PF-21 jadvalida ayrim yil ustunlari birlashtirilgan. Qiymatlar hujjatdagi tartibda: ${escape(indicator.combined.join(" · "))}.</p>`;
  return record(`${indicator.number}-ko‘rsatkich`, indicator.title,
    `<p><strong>Mas’ul</strong> · ${escape(indicator.owner)}</p>${table}`,
    link(textLink(document.source, indicator.title), "PF-21 · 1-ilova"));
}

function taskRecord(task, summary) {
  const { number, title, deadlines, owner, partners, source } = task;
  const content = [
    summary && `<p>${escape(summary)}</p>`,
    deadlines?.length && `<p><strong>Muddat</strong> · ${escape(deadlines.join(" · "))}</p>`,
    owner && `<p><strong>Asosiy mas’ul</strong> · ${escape(owner)}</p>`,
    partners?.length && `<p><strong>${owner ? "Hamijrochilar" : "Mas’ul ijrochilar"}</strong> · ${escape(partners.join(" · "))}</p>`,
  ].filter(Boolean).join("");
  return record(`${source} · ${number}-band`, title, content, link(textLink(taskSources[source], title), `Rasmiy reja · ${source}`));
}

const taskSources = {
  "PF-22": "https://www.lex.uz/acts/-8050787",
  "PF-60": "https://lex.uz/uz/docs/-5841063?ONDATE=08.08.2025",
  "PF-27": "https://www.lex.uz/acts/-6396146",
};

function goalPage(document, goal, direction) {
  const evidence = goalEvidence[document.id]?.[goal.number];
  const official = textLink(document.source, goal.title);
  const title = `${goal.number}-maqsad. ${goal.title}`;
  const hasIndicators = Boolean(goal.indicators?.length || goal.note);
  const status = evidence?.status ?? "Ochiq tasdiq katalogga kiritilmagan";
  const intro = evidence?.intro ?? (document.id === "pf-21"
    ? "Maqsadning mazmuni va erishish mezonlari PF-21 farmonining 1-ilovasida belgilangan."
    : "Maqsadning to‘liq mazmuni PF-60 farmonining 1-ilovasi tarixiy tahririda berilgan.");
  const indicatorBlock = hasIndicators ? block("korsatkichlar", "Samaradorlik ko‘rsatkichlari",
    goal.note ? `<p>${escape(goal.note)}</p>` : tiles(goal.indicators.map((indicator) => indicatorRecord(indicator, document)))) : "";
  const tasks = goal.tasks ?? [];
  const plan = tasks.length
    ? tiles(tasks.map((task) => taskRecord(task, evidence?.tasks?.[task.number])))
    : `<p>Bu maqsad bo‘yicha alohida dastur bandi katalogga kiritilmagan.</p>`;
  const taskLinks = [...new Set(tasks.map(({ source }) => source))].map((code) => [`Davlat dasturi · ${code}`, taskSources[code]]);
  const links = [["mazmun", "Maqsad mazmuni"], ...(hasIndicators ? [["korsatkichlar", "Ko‘rsatkichlar"]] : []), ["reja", "Vazifalar"], ["ijro", "Natijalar"], ["manbalar", "Manbalar"]];
  return page(title, intro, [
    hero(`${document.code} · ${goal.number}-maqsad`, goal.title, "", link("index.html", document.title),
      [["Ustuvor yo‘nalish", direction], ["Strategiya davri", document.period], ["Ijro holati", status]]),
    jump(links),
    `    <div class="wrap strategy-body">`,
    block("mazmun", "Maqsad mazmuni", `<p>${escape(intro)}</p><p>${link(official, `Maqsadning to‘liq rasmiy matni · ${document.code}`)}</p>`),
    indicatorBlock,
    block("reja", "Belgilangan vazifalar", plan),
    resultBlock(evidence?.results ?? [], evidence?.note),
    sourcesBlock([[document.sourceLabel ?? `LexUZ · ${document.code}, 1-ilova`, official], ...taskLinks, ...evidence?.links ?? []]),
    "    </div>",
  ].filter(Boolean).join("\n"), { nested: true });
}

function catalogPage() {
  const intro = "Davlat va tarmoq strategiyalaridagi maqsadlar, rejalashtirilgan vazifalar va rasmiy manbalarda e’lon qilingan natijalar.";
  const cards = documents.map((document) => `<article class="strategy-card"><span>${escape(document.code)} · ${escape(document.period)}</span><h3>${link(documentFile(document), document.title)}</h3><p>${escape(document.intro)}</p></article>`).join("\n          ");
  const groups = [...catalogues.entries()].flatMap(([code, data]) => data.groups.map((group) => ({
    ...group, code, goals: data.goals.filter((goal) => goal.direction === group.id),
  })));
  const years = [...new Set(groups.flatMap(({ goals }) => goals.flatMap(({ years }) => years)))].sort();
  const controls = `<form class="strategy-filters" id="maqsad-filtrlari" hidden role="search">
          <div class="strategy-filters-grid">
            <label>Raqam yoki nom <input type="search" name="q" placeholder="Masalan, 64 yoki irrigatsiya"></label>
            <label>Yo‘nalish <select name="yonalish"><option value="">Barcha yo‘nalishlar</option>${groups.map(({ code, id, title }) => `<option value="${code}-${id}">${escape(code.toUpperCase() + " · " + id + " · " + title)}</option>`).join("")}</select></label>
            <label>Yil <select name="yil"><option value="">Barcha yillar</option>${years.map((year) => `<option>${year}</option>`).join("")}</select></label>
          </div>
          <button type="reset" class="text-link">Filtrlarni tozalash</button>
        </form>
        <p id="maqsadlar-soni" role="status"></p>`;
  const goalLists = groups.map(({ code, id, title, goals }, index) => `<details class="strategy-goal-group" data-direction="${code}-${id}"${index === 0 ? " open" : ""}>
          <summary>${escape(code.toUpperCase() + " · " + id + ". " + title)} (${goals.length})</summary>
          <ul class="strategy-goals">
            ${goals.map((goal) => `<li data-number="${goal.number}" data-years="${goal.years.join(" ")}"><a href="${code}/${goalFile(goal.number)}"><span>${goal.number}</span><span data-title>${escape(goal.title)}</span></a></li>`).join("\n            ")}
          </ul>
        </details>`).join("\n        ");
  return page("Taraqqiyot strategiyasi", intro, [
    hero("", "Taraqqiyot strategiyasi", intro),
    jump([["strategiyalar", "Strategiyalar va dasturlar"], ["maqsadlar", "Maqsadlarni qidirish"]]),
    `    <div class="wrap strategy-body">`,
    block("strategiyalar", "Strategiyalar va dasturlar", `<div class="strategy-docs">\n          ${cards}\n        </div>`),
    block("maqsadlar", "Maqsadlar katalogi", `<p>PF-21 va PF-60 maqsadlarini hujjatdagi raqami, nomi, yo‘nalishi yoki yili bo‘yicha toping.</p>\n        ${controls}\n        ${goalLists}`),
    "    </div>",
  ].join("\n"), { catalogue: true });
}

for (const document of documents) {
  write(documentFile(document), documentPage(document));
  const data = catalogues.get(document.id);
  if (!data) continue;
  if (data.goals.length !== 100 || data.goals.some((goal, index) => goal.number !== index + 1)) {
    throw new Error(`Maqsad raqamlari to‘liq emas: ${document.code}`);
  }
  const directions = new Map(data.groups.map(({ id, title }) => [id, `${id}. ${title}`]));
  for (const goal of data.goals) {
    if (!directions.has(goal.direction)) throw new Error(`Yo‘nalish topilmadi: ${document.code}, ${goal.number}`);
    write(`${document.id}/${goalFile(goal.number)}`, goalPage(document, goal, directions.get(goal.direction)));
  }
}
write("index.html", catalogPage());
console.log("strategiya/index.html (uz)");
