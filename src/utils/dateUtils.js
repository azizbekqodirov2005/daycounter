/**
 * Sana bilan ishlash yordamchi funksiyalari.
 *
 * Muhim qoida: sanalar ISO string sifatida `Date.parse` bilan o'qilmaydi.
 * `new Date('2026-05-10')` UTC yarim tunni beradi va foydalanuvchining
 * timezone'ida bir kun oldinga/orqaga siljib ketishi mumkin. Shuning uchun
 * sana komponentlari (yil, oy, kun) alohida ajratilib, lokal vaqt bo'yicha
 * `new Date(year, monthIndex, day, hour, minute)` orqali quriladi.
 */

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const pad = (value) => String(value).padStart(2, '0');

export const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

/** Berilgan oydagi kunlar soni (oy 1-12 oralig'ida). */
export const getDaysInMonth = (year, month) =>
  new Date(year, month, 0).getDate();

/**
 * Kunni oy uzunligiga moslaydi.
 * 29-fevralda tug'ilganlar uchun: kabisa bo'lmagan yilda 28-fevral qaytariladi.
 */
export const clampDayToMonth = (year, month, day) =>
  Math.min(day, getDaysInMonth(year, month));

/** 'YYYY-MM-DD' qatorini {year, month, day} ko'rinishiga ajratadi. */
export const parseDateInput = (value) => {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > getDaysInMonth(year, month)) return null;
  if (year < 1900 || year > 2999) return null;

  return { year, month, day };
};

/** 'HH:MM' qatorini {hour, minute} ko'rinishiga ajratadi. */
export const parseTimeInput = (value) => {
  if (!value) return { hour: 0, minute: 0 };
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value).trim());
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;

  return { hour, minute };
};

/** Lokal vaqt bo'yicha Date obyektini quradi. */
export const buildLocalDate = (year, month, day, time = '00:00') => {
  const parsedTime = parseTimeInput(time) ?? { hour: 0, minute: 0 };
  return new Date(
    year,
    month - 1,
    clampDayToMonth(year, month, day),
    parsedTime.hour,
    parsedTime.minute,
    0,
    0,
  );
};

/** Kunning boshlanishi (00:00) — kunlar farqini aniq hisoblash uchun. */
export const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Ikki sana orasidagi kalendar kunlar farqi.
 * Yoz/qish vaqti (DST) o'tishlarida ham to'g'ri ishlashi uchun natija
 * yaxlitlanadi.
 */
export const diffInDays = (from, to) =>
  Math.round((startOfDay(to) - startOfDay(from)) / MS_IN_DAY);

/**
 * Tadbirning keyingi sanasini qaytaradi.
 * Takrorlanadigan (yillik) sanalar uchun joriy yildagi sana o'tib ketgan
 * bo'lsa, keyingi yildagi sana olinadi.
 */
export const getTargetDate = (event, now = new Date()) => {
  const parsed = parseDateInput(event.date);
  if (!parsed) return null;

  const { year, month, day } = parsed;
  const time = event.time || '00:00';

  if (!event.recurring) {
    return buildLocalDate(year, month, day, time);
  }

  const currentYear = now.getFullYear();
  const thisYear = buildLocalDate(currentYear, month, day, time);

  if (diffInDays(now, thisYear) < 0) {
    return buildLocalDate(currentYear + 1, month, day, time);
  }

  return thisYear;
};

/**
 * Qolgan vaqtni kun/soat/daqiqa/soniyaga ajratadi.
 * `isPast` true bo'lganda raqamlar manfiy emas, modul qiymatda qaytariladi.
 */
export const getTimeBreakdown = (target, now = new Date()) => {
  if (!target) {
    return {
      total: 0,
      isPast: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const total = target.getTime() - now.getTime();
  const absolute = Math.abs(total);

  return {
    total,
    isPast: total < 0,
    days: Math.floor(absolute / MS_IN_DAY),
    hours: Math.floor(absolute / (60 * 60 * 1000)) % 24,
    minutes: Math.floor(absolute / (60 * 1000)) % 60,
    seconds: Math.floor(absolute / 1000) % 60,
  };
};

export const STATUS = {
  upcoming: 'upcoming',
  today: 'today',
  past: 'past',
};

/**
 * Tadbirning to'liq countdown holati.
 */
export const getEventStatus = (event, now = new Date()) => {
  const target = getTargetDate(event, now);

  if (!target) {
    return {
      target: null,
      status: STATUS.past,
      dayDiff: 0,
      breakdown: getTimeBreakdown(null, now),
      label: "Sana noto‘g‘ri",
    };
  }

  const dayDiff = diffInDays(now, target);
  const breakdown = getTimeBreakdown(target, now);

  let status = STATUS.upcoming;
  if (dayDiff === 0) status = STATUS.today;
  else if (dayDiff < 0) status = STATUS.past;

  let label;
  if (status === STATUS.today) {
    label = 'Bugun!';
  } else if (status === STATUS.upcoming) {
    label = `${dayDiff} kun qoldi`;
  } else {
    label = "Bu sana o'tib ketdi";
  }

  return { target, status, dayDiff, breakdown, label };
};

const MONTHS_UZ = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
];

const WEEKDAYS_UZ = [
  'yakshanba',
  'dushanba',
  'seshanba',
  'chorshanba',
  'payshanba',
  'juma',
  'shanba',
];

/** Masalan: "10-may, 2026 (yakshanba)" */
export const formatDateUz = (date, { withWeekday = true } = {}) => {
  if (!date) return '';
  const base = `${date.getDate()}-${MONTHS_UZ[date.getMonth()]}, ${date.getFullYear()}`;
  return withWeekday ? `${base} (${WEEKDAYS_UZ[date.getDay()]})` : base;
};

export const formatTimeUz = (date) =>
  date ? `${pad(date.getHours())}:${pad(date.getMinutes())}` : '';

/** <input type="date"> uchun bugungi sanani 'YYYY-MM-DD' ko'rinishida qaytaradi. */
export const todayAsInputValue = (now = new Date()) =>
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
