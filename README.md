# DayCounter

Muhim sanalargacha qancha vaqt qolganini aniq va chiroyli ko‘rsatadigan countdown web ilovasi. Tug‘ilgan kun, imtihon, to‘y, sayohat yoki bayram — barcha sanalar bitta dashboard'da, countdown esa har soniyada real vaqtda yangilanadi.

Backend, database va API ishlatilmaydi: barcha ma'lumotlar foydalanuvchining brauzerida, LocalStorage'da saqlanadi.

## Imkoniyatlar

- **Real vaqtdagi countdown** — kun, soat, daqiqa va soniya har soniyada yangilanadi.
- **Eng yaqin sana** — hero bo‘limida avtomatik aniqlanadi va katta ko‘rinishda chiqadi.
- **Sana qo‘shish, tahrirlash va o‘chirish** — o‘chirishdan oldin tasdiqlash modali.
- **6 ta kategoriya** — Tug‘ilgan kun, Imtihon, To‘y, Sayohat, Bayram, Boshqa (har birining ikonkasi bilan).
- **Takrorlanadigan sanalar** — tug‘ilgan kun va yilliklar har yili avtomatik keyingi yilga o‘tadi.
- **Kabisa yili** — 29-fevral kabisa bo‘lmagan yillarda 28-fevralda hisoblanadi.
- **Qidiruv va filter** — nom yoki izoh bo‘yicha qidirish, kategoriya bo‘yicha filtrlash.
- **Saralash** — eng yaqin, eng uzoq, nom bo‘yicha yoki oxirgi qo‘shilgan.
- **Holatlar** — `12 kun qoldi`, `Bugun!`, `Bu sana o‘tib ketdi`. O‘tgan sanalar avtomatik o‘chirilmaydi.
- **Dark / Light mode** — birinchi tashrifda tizim sozlamasi olinadi, keyin tanlov saqlanadi.
- **Toast bildirishnomalari** va chiroyli Empty State.
- **Responsive** — mobile-first; telefon, planshet, laptop va desktopda gorizontal scroll yo‘q.
- **Accessibility** — klaviatura navigatsiyasi, modal ichida fokus tutqichi (focus trap), Escape bilan yopish, ARIA atributlari, `prefers-reduced-motion` qo‘llab-quvvatlanadi.

## Texnologiyalar

| Texnologiya | Vazifasi |
| --- | --- |
| React 19 | UI komponentlari va state |
| Vite | Dev server va production build |
| JavaScript (ES6+) | Biznes-logika |
| CSS3 | Dizayn tizimi, CSS o‘zgaruvchilari, dark mode |
| Lucide React | Ikonkalar |
| LocalStorage | Ma'lumotlarni saqlash |

Qo‘shimcha dependency yo‘q.

## Ishga tushirish

Talab: **Node.js 18+** va npm.

```bash
# 1. Repozitoriyani klonlash
git clone https://github.com/<username>/daycounter.git
cd daycounter

# 2. Paketlarni o'rnatish
npm install

# 3. Dev rejimda ishga tushirish
npm run dev
```

Brauzerda `http://localhost:5173` manzilini oching.

### Boshqa buyruqlar

```bash
npm run build     # production build -> dist/
npm run preview   # build qilingan versiyani lokal ko'rish
```

## Loyiha strukturasi

```
daycounter/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ConfirmModal.jsx      # O'chirishni tasdiqlash
│   │   ├── Controls.jsx          # Qidiruv, filter, saralash
│   │   ├── CountdownCard.jsx     # Bitta sana kartasi
│   │   ├── CountdownDisplay.jsx  # Kun/soat/daqiqa/soniya bloklari
│   │   ├── EmptyState.jsx        # Bo'sh holat
│   │   ├── EventModal.jsx        # Qo'shish va tahrirlash formasi
│   │   ├── Header.jsx            # Logotip, navigatsiya, mode tugmasi
│   │   ├── Hero.jsx              # Eng yaqin sana va statistika
│   │   ├── Modal.jsx             # Modallar uchun umumiy qobiq
│   │   └── Toast.jsx             # Bildirishnomalar
│   ├── hooks/
│   │   ├── useCountdown.js       # Ticker va countdown holati
│   │   ├── useEvents.js          # CRUD, filter, saralash (biznes-logika)
│   │   ├── useLocalStorage.js    # LocalStorage bilan sinxron state
│   │   ├── useTheme.js           # Dark / light mode
│   │   └── useToast.js           # Toast navbati
│   ├── utils/
│   │   ├── constants.js          # Kategoriyalar, ranglar, kalitlar
│   │   └── dateUtils.js          # Sana hisoblash algoritmi
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

UI va biznes-logika ajratilgan: komponentlar faqat ko‘rsatish bilan shug‘ullanadi, hisob-kitob va ma'lumotlar bilan ishlash hook'lar va `utils` ichida.

## Sana hisoblash algoritmi

JavaScript `Date` bilan bog‘liq tipik xatolarning oldi olingan:

- **Timezone.** Sana hech qachon `new Date('2026-05-10')` ko‘rinishida o‘qilmaydi — bu UTC yarim tunni beradi va foydalanuvchining mintaqasida bir kunga siljib ketishi mumkin. Sana komponentlari (yil, oy, kun) ajratib olinadi va `new Date(year, month - 1, day, hour, minute)` orqali **lokal vaqtda** quriladi.
- **DST.** Kunlar farqi ikkala sananing 00:00 nuqtalari orqali hisoblanadi va yaxlitlanadi, shuning uchun yoz/qish vaqti o‘tishida ham butun son chiqadi.
- **Manfiy countdown yo‘q.** O‘tgan sanalar uchun raqamlar modul qiymatda ko‘rsatiladi, holat esa alohida `isPast` bayrog‘i bilan uzatiladi.
- **Kabisa yili.** `29-fevral` takrorlanadigan sana sifatida belgilansa, kabisa bo‘lmagan yillarda `28-fevral`ga moslanadi.
- **Bugungi kun.** Vaqt ko‘rsatilgan-ko‘rsatilmaganidan qat'i nazar, sana bugungi kunga to‘g‘ri kelsa `Bugun!` holati chiqadi.
- **Validatsiya.** `2026-02-30` yoki `2026-13-01` kabi mavjud bo‘lmagan sanalar qabul qilinmaydi.

## Ma'lumotlar saqlanishi

Ma'lumotlar brauzerda, quyidagi kalitlar ostida saqlanadi:

- `daycounter.events` — sanalar ro‘yxati
- `daycounter.theme` — tanlangan rejim

Sahifa yangilanganda ma'lumotlar yo‘qolmaydi. LocalStorage'dagi ma'lumot buzilgan bo‘lsa, ilova xatolik bermasdan bo‘sh holatga qaytadi. Ma'lumotlar serverga yuborilmaydi.

## Deploy

Build natijasi — statik fayllar, shuning uchun Netlify, Vercel, GitHub Pages yoki oddiy hostingga yuklash mumkin:

```bash
npm run build
# dist/ papkasini hostingga yuklang
```

Netlify uchun: Build command — `npm run build`, Publish directory — `dist`.

## Litsenziya

MIT
