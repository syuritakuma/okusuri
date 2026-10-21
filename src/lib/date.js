/* 日付まわりの小さな道具です。画面の部品からは独立しているので、テストもしやすくなっています。 */

export const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"];

const pad = (n) => String(n).padStart(2, "0");

export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

// 「2026-10-21」のような、日ごとに集計するときの見出しを作ります
export const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};

export const sameDay = (a, b) => dayKey(a) === dayKey(b);

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// 指定した曜日について「直近に訪れた（今日を含む）その曜日の午前0時」を返します
export const lastOccurrenceOfWeekday = (weekdayStr, base = new Date()) => {
  const target = WEEK_DAYS.indexOf(weekdayStr);
  const d = startOfDay(base);
  const diff = (d.getDay() - target + 7) % 7;
  return addDays(d, -diff);
};

// <input type="datetime-local"> に渡せる文字列に変換します
export const toLocalInput = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`;
};

export const formatDateTime = (d) => {
  const x = new Date(d);
  return (
    `${x.getFullYear()}/${x.getMonth() + 1}/${x.getDate()}（${WEEK_DAYS[x.getDay()]}） ` +
    `${pad(x.getHours())}:${pad(x.getMinutes())}`
  );
};

export const formatLongDate = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}年${x.getMonth() + 1}月${x.getDate()}日（${WEEK_DAYS[x.getDay()]}）`;
};
