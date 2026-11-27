import { readFileSync, writeFileSync } from "node:fs";

const locales = [
  ["uz", "O‘zbekcha", "index.html"],
  ["ru", "Русский", "ru.html"],
  ["zh-Hans", "简体中文", "zh.html"],
  ["tk", "Türkmençe", "tk.html"],
  ["en", "English", "en.html"],
  ["kk", "Қазақша", "kk.html"],
];
const site = "https://abdumajid6769.github.io/mening-universetitim/";
const read = (name) => readFileSync(new URL(name, import.meta.url), "utf8");
const template = read("template.html");
const copy = new Map();

for (const file of ["ui.txt", "stories.txt", "projects.txt", "reforms.txt", "university.txt"]) {
  for (const line of read(file).trim().split(/\r?\n/)) {
    const [key, ...translations] = line.split("|").map((value) => value.trim());
    if (copy.has(key) || translations.length !== locales.length || translations.some((value) => !value)) {
      throw new Error("Invalid or duplicate translation: " + key);
    }
    copy.set(key, translations);
  }
}
const escape = (value) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const president = (id) => "https://www.president.uz/oz/lists/view/" + id;
const university = (id) => "https://www.tiiame.uz/news?id=" + id;
const law = (id) => "https://lex.uz/uz/docs/-" + id;
const ministry = "https://gov.uz/oz/suvchi/news/view/249915";
const news = [
  [14, "2026-11-27", "education", "https://www.tiiame.uz/news?id=10135", "meeting-rector-1.jpg"],
  [1, "2026-11-23", "education", university(10128), "physics.jpg"],
  [2, "2026-11-19", "water", ministry],
  [3, "2026-11-18", "city", president(9871)],
  [4, "2026-11-17", "education", university(10122), "rectors-forum.jpg"],
  [5, "2026-11-17", "education", university(10119)],
  [6, "2026-11-09", "education", university(10111)],
  [7, "2026-11-09", "energy", president(9831)],
  [8, "2026-10-18", "culture", president(9737), "imam-bukhari.jpg"],
  [9, "2026-10-12", "city", president(9707), "new-tashkent.jpg"],
  [10, "2026-09-11", "culture", president(9600)],
  [11, "2026-08-13", "energy", president(9496)],
  [12, "2026-07-31", "transport", president(9479)],
  [13, "2026-07-07", "culture", president(9390)],
];
const projects = [
  [4, "tashkent", "new-tashkent.jpg", president(9707)],
  [5, "samarkand", "imam-bukhari.jpg", president(9737)],
  [1, "surTermiz", "termiz.jpg", president(8974)],
  [2, "namangan", "ayqiron.jpg", president(8489)],
  [3, "surSariosiyo", "ges.jpg", president(6862)],
];
const gallery = [
  [1, "termiz-detail.jpg", president(8974)],
  [2, "ayqiron-detail.jpg", president(8489)],
  [3, "ges-detail.jpg", president(6862)],
];
const reforms = [
  [1, "2026-11-19", "result", ministry],
  [2, "2026-07-24", "current", law(8358785)],
  [3, "2026-07-20", "result", president(9424)],
  [4, "2026-05-26", "current", law(8238206)],
  [5, "2026-05-25", "result", president(9250)],
  [6, "2026-04-02", "current", law(8115447)],
  [7, "2026-02-16", "current", law(8050769)],
  [8, "2026-02-03", "result", president(8901)],
  [9, "2025-08-15", "current", law(7686130)],
  [10, "2025-07-30", "current", law(7655336)],
  [11, "2023-09-11", "past", law(6600413)],
  [12, "2021-12-10", "result", law(5767189)],
  [13, "2021-02-24", "past", law(5307918)],
  [14, "2020-07-10", "current", law(4892953)],
];
const stateLabel = { result: "resultsTag", current: "currentTag", past: "pastTag" };
const engineeringSource = "https://uza.uz/oz/posts/qishloq-va-suv-xojaligi-uchun-muhandis-kadrlar-tayyorlash-tizimini-takomillashtirish-masalalari-korib-chiqildi_829888";
const universityActions = [
  ["status", "2021-12-10", "https://uza.uz/oz/posts/iqtisodiyot-tarmoqlari-uchun-muhandis-kadrlarni-tayyorlash-tizimini-innovatsiya-va-raqamlashtirish-asosida-tubdan-takomillashtirish-chora-tadbirlari-togrisida_328345"],
  ["school", "2023-05-29", "https://uza.uz/sp/posts/suvchilar-maktabi-bilim-tajriba-va-kelajak-kafolati_749285"],
  ["almaty", "2024-08-08", "https://uza.uz/uz/posts/ozbekiston-va-qozogiston-strategik-sheriklik-va-ittifoqchilik-munosabatlari-rivojida-tarixiy-voqea_623388"],
  ["waterCenter", "2025-11-16", "https://uza.uz/uz/posts/markaziy-osiyo-davlatlari-rahbarlarining-vii-maslahat-uchrashuvida-ozbekiston-respublikasi-prezidenti-ilgari-surgan-asosiy-fikr-va-tashabbuslar_783507"],
  ["engineering", "2026-03-10", engineeringSource],
  ["educationDecision", "2026-04-02", law(8115447), "Lex.uz"],
];
const itCenterSource = "https://tiiame.uz/news?id=8777";

for (const [index, [lang, , file]] of locales.entries()) {
  const t = (key) => {
    const value = copy.get(key)?.[index];
    if (!value) throw new Error("Missing translation: " + key + " (" + lang + ")");
    return escape(value);
  };
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const time = (iso) => '<time datetime="' + iso + '">' + date.format(new Date(iso + "T00:00:00Z")) + '</time>';
  const photo = (image, alt) => '<a class="photo-link" href="assets/' + image + '" data-photo><img src="assets/' + image + '" alt="' + alt + '" loading="lazy"></a>';
  const controls = (options, searchKey) => {
    const buttons = options.map(([key, label]) => '<button type="button" data-filter="' + key + '" aria-pressed="' + (key === "all") + '">' + t(label) + '</button>').join("");
    return '<div class="controls" hidden><fieldset class="filters"><legend class="sr-only">' + t("filter") + '</legend>' + buttons + '</fieldset><label class="search"><span class="sr-only">' + t(searchKey) + '</span><input type="search" placeholder="' + t(searchKey) + '"></label></div><p class="sr-only" data-result-count role="status"></p>';
  };
  const newsCategories = ["education", "city", "energy", "transport", "culture", "water"];
  const fragments = {
    alternateLinks: locales.map(([code, , target]) => '<link rel="alternate" hreflang="' + code + '" href="' + site + (target === "index.html" ? "" : target) + '">').join("\n  ") + '\n  <link rel="alternate" hreflang="x-default" href="' + site + '">',
    languageLinks: locales.map(([code, name, target]) => '<a lang="' + code + '" hreflang="' + code + '" href="' + target + '"' + (target === file ? ' aria-current="page"' : "") + '>' + escape(name) + '</a>').join(""),
    newsControls: controls([["all", "all"], ...newsCategories.map((key) => [key, key])], "searchNews"),
    reformControls: controls([["all", "all"], ...Object.entries(stateLabel)], "searchReforms"),
    newsCards: news.map(([id, day, category, url, image]) =>
      '<article class="news-card" data-item="' + category + '">' +
      (image ? photo(image, t("n" + id)) : "") + '<div class="news-copy"><div class="meta"><span class="pill">' + t(category) + '</span>' + time(day) + '</div><h3>' + t("n" + id) + '</h3>' + copy.get("d" + id)[index].split("~~").map((paragraph) => '<p>' + escape(paragraph) + '</p>').join("") + (id === 14 ? '<div class="news-photo-grid">' + [2, 3, 4].map((number) => '<figure>' + photo("meeting-rector-" + number + ".jpg", t("i14photo" + number)) + '<figcaption>' + t("i14photo" + number) + '</figcaption></figure>').join("") + '</div>' : "") + '<a href="' + escape(url) + '">' + t("source") + '</a></div></article>').join("\n          "),
    projectCards: projects.map(([id, place, image, url], position) =>
      '<article class="project' + (position === 0 ? ' project-featured' : '') + '">' + photo(image, t("p" + id)) +
      '<div class="project-copy"><p class="location">' + t(place) + '</p><h3>' + t("p" + id) + '</h3><p>' + t("q" + id) + '</p><a class="text-link" href="' + escape(url) + '">' + t("photoSource") + '</a></div></article>').join("\n          "),
    gallery: gallery.map(([id, image, url]) =>
      '<figure>' + photo(image, t("detail" + id)) + '<figcaption><a href="' + escape(url) + '">' + t("detail" + id) + '</a></figcaption></figure>').join("\n          "),
    portrait: photo("portrait.jpg", t("pName")),
    fieldPhoto: photo("field.jpg", t("uPhoto")),
    engineeringSource,
    universityCards: universityActions.map(([key, day, url, source = "O‘zA"]) =>
      '<article class="reform"><div class="meta">' + time(day) + '</div><h4>' + t(key + "Title") + '</h4><p>' + t(key + "Body") + '</p><a href="' + escape(url) + '">' + escape(source) + '</a></article>').join("\n          "),
    itCenterSource,
    itCenterPhotos: [3, 1, 4, 2].map((number) =>
      '<figure>' + photo("it-center-" + number + ".jpg", t("itPhoto" + number)) + '<figcaption>' + t("itPhoto" + number) + '</figcaption></figure>').join("\n          "),
    reformCards: reforms.map(([id, day, state, url]) =>
      '<article class="reform" data-item="' + state + '"><div class="meta">' + time(day) + '<span class="pill ' + state + '">' + t(stateLabel[state]) + '</span></div><h3>' + t("t" + id) + '</h3><p>' + t("s" + id) + '</p><a href="' + escape(url) + '">' + t("source") + '</a></article>').join("\n          "),
  };
  const html = template
    .replace(/\{\{\{(\w+)\}\}\}/g, (_, key) => {
      if (!Object.hasOwn(fragments, key)) throw new Error("Unknown template fragment: " + key);
      return fragments[key];
    })
    .replace(/\{\{(\w+)\}\}/g, (_, key) => key === "lang" ? lang : t(key));
  writeFileSync(new URL("../" + file, import.meta.url), html);
  console.log(file + " (" + lang + ")");
}
