# Suv Ufqi

TIQXMMI va O‘zbekiston yangiliklari, Prezident tashabbuslari, inshootlar va suv xo‘jaligi haqida olti tilli o‘quv portali.

[Suv Ufqi sayti](https://abdumajid6769.github.io/mening-universetitim/)

Sayt o‘zbek, rus, soddalashtirilgan xitoy, turkman, ingliz va qozoq tillarida mavjud. Mahalliy ko‘rish uchun `index.html` faylini brauzerda oching. Yangiliklar va islohotlarni qidirish, filtrlash hamda suratlarni kattalashtirish brauzerda ishlaydi.

## Mazmunni yangilash

- `site/ui.txt`, `site/stories.txt`, `site/projects.txt`, `site/reforms.txt` va `site/about.txt` fayllaridagi ustunlar tartibi: kalit, o‘zbek, rus, xitoy, turkman, ingliz, qozoq.
- «Loyiha haqida» sahifasining shabloni `site/about-template.html` faylida, uslublari `about.css` faylida saqlanadi.
- Sana, toifa, manba va rasm fayli `site/build.mjs` faylida beriladi.
- `node site/build.mjs` yordamida bosh sahifa va «Loyiha haqida» sahifasining olti tildagi versiyalarini qayta yarating. GitHub Pages tayyor sahifalarni `main` branchidan yuklaydi.

Yozuvlar va suratlar rasmiy manbalariga bog‘langan. Foto kreditlari saytning quyi qismida keltirilgan.

## «Loyiha haqida» matnlarini tahrirlash

1. `site/about.txt` faylini oching. Hozirgi matnlardan namuna sifatida foydalaning. Har qatordagi birinchi ustun kalit, undan keyingi olti ustun o‘zbek, rus, soddalashtirilgan xitoy, turkman, ingliz va qozoq tillaridagi matnlardir. Masalan:

   ```text
   aboutMission|Loyihaning maqsadi|Цель проекта|项目宗旨|Taslamanyň maksady|Our purpose|Жобаның мақсаты
   ```

2. Kalitni qoldirib, kerakli til ustunidagi matnni almashtiring. Har bir tarjimani bitta qatorda yozing va barcha olti ustunni to‘ldiring. `|` belgisi ustunlarni ajratadi, `#` bilan boshlangan qatorlar esa izoh hisoblanadi.
3. Loyiha nomi ostidagi katta sarlavha uchun `aboutHeadline`, qisqa ta’rif uchun `aboutDesc`, loyiha maqsadi uchun `aboutPurpose` va auditoriya uchun `aboutAudience` qatorini tahrirlang. Kartalar matni `aboutProjects`, `aboutReforms` va `aboutLibrary` qatorlarida. Menyu yoki boshqa bo‘limlar bilan umumiy yozuvlar `site/ui.txt` faylida saqlanadi.
4. `node site/build.mjs` buyrug‘ini bajaring va `about.html` faylini brauzerda oching. Qolgan versiyalarni til almashtirgichdan tekshiring. Keyingi build hosil qilingan HTML fayllarini qayta yozadi, shuning uchun matnni tarjima fayllarida saqlang.
