/* 「今日飲むもの」と「どれだけ飲めたか」を計算します */
import { WEEK_DAYS, addDays, dayKey, lastOccurrenceOfWeekday, sameDay, startOfDay } from "./date.js";
import { TIMINGS, dailyTimingCount, weeklyLabel } from "./medicine.js";

const TIMING_ORDER = { morning: 0, noon: 1, evening: 2, weekly: 3 };

const isTakenOn = (logs, medId, timingKey, day) =>
  logs.some((l) => l.medId === medId && l.timingKey === timingKey && sameDay(new Date(l.timestamp), day));

// 週1回のお薬について、直近の予定日（今日を含む）以降に記録があるかを調べます
const isTakenThisCycle = (logs, med, now) => {
  const since = lastOccurrenceOfWeekday(med.weeklyDay, now);
  return logs.some((l) => l.medId === med.id && new Date(l.timestamp) >= since);
};

/* 今日やることの一覧を作ります。
   週1回のお薬は、予定日の当日に加えて、予定日を過ぎてもまだ使っていない場合にも
   「未実施」として出し続けます。 */
export function computeTodayTasks(medicines, logs, now = new Date()) {
  const list = [];
  const weekday = WEEK_DAYS[new Date(now).getDay()];
  medicines.forEach((med) => {
    if (med.type === "daily") {
      TIMINGS.forEach(({ key, label }) => {
        if (med.timings && med.timings[key]) {
          list.push({ med, timingKey: key, timingLabel: label, done: isTakenOn(logs, med.id, key, now) });
        }
      });
    } else {
      const isTargetDay = weekday === med.weeklyDay;
      const done = isTakenThisCycle(logs, med, now);
      if (isTargetDay || !done) {
        list.push({
          med,
          timingKey: "weekly",
          timingLabel: weeklyLabel(med),
          done,
          overdue: !done && !isTargetDay,
        });
      }
    }
  });
  // 同じタイミングの中では、お薬の並び順がそのまま保たれます
  return list.sort((a, b) => TIMING_ORDER[a.timingKey] - TIMING_ORDER[b.timingKey]);
}

// その日に飲む予定だった回数です。お薬を登録する前の日は数えません。
const expectedOn = (medicines, day) => {
  let n = 0;
  medicines.forEach((med) => {
    const created = startOfDay(med.createdAt ? new Date(med.createdAt) : day);
    if (day < created) return;
    if (med.type === "daily") n += dailyTimingCount(med);
    else if (WEEK_DAYS[day.getDay()] === med.weeklyDay) n += 1;
  });
  return n;
};

/* 直近 range 日の服用率と、予定どおり飲めた日が何日続いているか（連続達成）を計算します。
   今日の分がまだ途中のときは、今日を数えずに昨日からさかのぼります。 */
export function computeStats(medicines, logs, range, now = new Date()) {
  const today = startOfDay(now);
  const medIds = new Set(medicines.map((m) => m.id));
  const takenByDay = {};
  logs.forEach((l) => {
    if (!medIds.has(l.medId)) return;
    const k = dayKey(new Date(l.timestamp));
    takenByDay[k] = (takenByDay[k] || 0) + 1;
  });

  const days = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    const expected = expectedOn(medicines, d);
    const raw = takenByDay[dayKey(d)] || 0;
    const taken = expected > 0 ? Math.min(raw, expected) : raw;
    days.push({
      date: d,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      weekday: WEEK_DAYS[d.getDay()],
      expected,
      taken,
      rate: expected > 0 ? Math.round((taken / expected) * 100) : null,
    });
  }
  const totalExpected = days.reduce((s, d) => s + d.expected, 0);
  const totalTaken = days.reduce((s, d) => s + (d.expected > 0 ? d.taken : 0), 0);
  const overall = totalExpected > 0 ? Math.round((totalTaken / totalExpected) * 100) : null;

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = addDays(today, -i);
    const expected = expectedOn(medicines, d);
    if (expected === 0) continue;
    const taken = takenByDay[dayKey(d)] || 0;
    if (taken >= expected) streak++;
    else if (i === 0) continue;
    else break;
  }
  return { days, overall, totalExpected, totalTaken, streak };
}
