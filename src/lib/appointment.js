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
