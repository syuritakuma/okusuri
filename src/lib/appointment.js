/* 次回の通院日に関する計算です。
   通院日は { date: "2026-12-18", time: "10:30", place: "病院の名前", memo: "メモ" } の形で持ちます。
   date 以外は空でも構いません。 */
import { WEEK_DAYS, addDays, sameDay, startOfDay } from "./date.js";
import { dailyTimingCount } from "./medicine.js";

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

export const isValidAppointment = (appt) => !!appt && typeof appt.date === "string" && DATE_KEY.test(appt.date);

// "2026-12-18" を、その日の午前0時の日付に直します
export const parseDateKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// 今日から通院日まで何日あるかを返します（今日なら 0、明日なら 1、過ぎていればマイナス）
export const daysUntil = (dateKey, now = new Date()) => {
  const utc = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((utc(parseDateKey(dateKey)) - utc(new Date(now))) / 86400000);
};

// 「12月18日（金） 10:30」のような表示です
export const formatAppointment = (appt) => {
  const d = parseDateKey(appt.date);
  return `${d.getMonth() + 1}月${d.getDate()}日（${WEEK_DAYS[d.getDay()]}）${appt.time ? " " + appt.time : ""}`;
};

/* 今日から通院日の前日までに、そのお薬を飲む回数です。今日すでに飲んだ分は数えません。
   通院日の当日の分は、病院で新しくお薬をもらえるものとして数えません。 */
const dosesNeededUntil = (med, logs, days, now) => {
  const today = startOfDay(now);
  const takenToday = logs.filter((l) => l.medId === med.id && sameDay(new Date(l.timestamp), today)).length;
  if (med.type === "daily") return Math.max(0, dailyTimingCount(med) * days - takenToday);
  let count = 0;
  for (let i = 0; i < days; i++) {
    const d = addDays(today, i);
    if (WEEK_DAYS[d.getDay()] === med.weeklyDay && !(i === 0 && takenToday > 0)) count++;
  }
  return count;
};

/* 通院日の前日までに在庫（自宅と実家の合計）が足りなくなりそうなお薬を、足りない数と一緒に返します。
   [{ med, shortBy }] の形で、shortBy は足りない数（錠・本などの単位）です。 */
export function medsShortBefore(medicines, logs, appt, now = new Date()) {
  if (!isValidAppointment(appt)) return [];
  const days = daysUntil(appt.date, now);
  if (days <= 0) return [];
  return medicines
    .map((med) => {
      const needed = dosesNeededUntil(med, logs, days, now) * med.dose;
      return { med, shortBy: needed - med.stock };
    })
    .filter((x) => x.shortBy > 0);
}

/* ---------- 文章から通院日を読み取る ---------- */

const pad2 = (n) => String(n).padStart(2, "0");

// 全角の数字や記号を半角にそろえます（「１２月１８日」「10：30」などに対応するため）
const toHalfWidth = (text) =>
  text
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[：／]/g, (c) => (c === "：" ? ":" : "/"));

// 日付の書き方の候補です。年がないときは、今日以降でいちばん近い年にします。
const DATE_PATTERNS = [
  { re: /令和\s*(\d{1,2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/g, ymd: (m) => [2018 + Number(m[1]), m[2], m[3]] },
  { re: /(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/g, ymd: (m) => [m[1], m[2], m[3]] },
  { re: /(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})/g, ymd: (m) => [m[1], m[2], m[3]] },
  { re: /(?<![\d年/])(\d{1,2})\s*月\s*(\d{1,2})\s*日/g, ymd: (m) => [null, m[1], m[2]] },
  { re: /(?<![\d/])(\d{1,2})\/(\d{1,2})(?![\d/])/g, ymd: (m) => [null, m[1], m[2]] },
];

// 通院の予定らしさを判断するための言葉です。日付の近くにあれば、その日付を優先します。
const VISIT_WORDS = /病院|クリニック|医院|診療所|診察|予約|通院|受診|検査|外来/;
const PLACE_RE = /(?:^|[\s、。,，（(「:])([^\s、。,，（）()「」:]{1,30}?(?:病院|クリニック|医院|診療所))/;

function findDates(text, now) {
  const today = startOfDay(now);
  const found = [];
  DATE_PATTERNS.forEach(({ re, ymd }) => {
    for (const m of text.matchAll(re)) {
      let [y, mo, d] = ymd(m).map((v) => (v === null ? null : Number(v)));
      if (!(mo >= 1 && mo <= 12 && d >= 1 && d <= 31)) continue;
      if (y === null) {
        y = today.getFullYear();
        if (new Date(y, mo - 1, d) < today) y += 1;
      }
      const date = new Date(y, mo - 1, d);
      if (date.getMonth() !== mo - 1) continue; // 2月30日のような、ない日付は使いません
      found.push({ date, start: m.index, end: m.index + m[0].length });
    }
  });
  // 同じ場所を別の書き方で拾った重複を除き、文章の順に並べます
  return found.sort((a, b) => a.start - b.start).filter((f, i, all) => i === 0 || f.start >= all[i - 1].end);
}

// 日付のあとに最初に出てくる時刻を読み取ります（「10時30分」「10時」「午後2時」「10:30」）
function findTimeAfter(text, from) {
  const rest = text.slice(from);
  const m = rest.match(/(午前|午後)?\s*(\d{1,2})\s*(?:時\s*(?:(\d{1,2})\s*分|半)?|:(\d{2}))/);
  if (!m) return "";
  let h = Number(m[2]);
  const min = m[3] ? Number(m[3]) : m[4] ? Number(m[4]) : /半/.test(m[0]) ? 30 : 0;
  if (m[1] === "午後" && h < 12) h += 12;
  if (h > 23 || min > 59) return "";
  return `${pad2(h)}:${pad2(min)}`;
}

/* 予約票や毎朝の報告などの文章から、通院日・時刻・病院名を読み取ります。
   今日以降の日付のうち、近くに「診察」「予約」「病院」などの言葉があるものを優先し、
   なければ今日以降で最初に出てくる日付を使います。日付が見つからなければ null を返します。
   返す形は { date: "2026-12-18", time: "10:30" または "", place: "○○病院" または "" } です。 */
export function parseAppointmentText(input, now = new Date()) {
  const text = toHalfWidth(String(input || ""));
  const today = startOfDay(now);
  const future = findDates(text, now).filter((f) => f.date >= today);
  if (future.length === 0) return null;
  const nearWords = (f) => VISIT_WORDS.test(text.slice(Math.max(0, f.start - 40), f.end + 80));
  const chosen = future.find(nearWords) || future[0];

  const around = text.slice(Math.max(0, chosen.start - 40), chosen.end + 120);
  const placeMatch = around.match(PLACE_RE) || text.match(PLACE_RE);
  const d = chosen.date;
  return {
    date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    time: findTimeAfter(text, chosen.end),
    place: placeMatch ? placeMatch[1] : "",
  };
}
