/* お薬そのものに関する決まりごとです */
import { WEEK_DAYS } from "./date.js";

// 毎日飲むお薬で選べるタイミングです。並び順が、そのまま画面での並び順になります。
export const TIMINGS = [
  { key: "morning", label: "朝" },
  { key: "noon", label: "昼" },
  { key: "evening", label: "夜" },
];

export const UNITS = ["錠", "本", "包", "カプセル", "mL", "回"];

// 在庫があと何日分を下回ったら「少なくなっています」と知らせるかの目安です
export const LOW_STOCK_DAYS = 7;

export const dailyTimingCount = (med) =>
  TIMINGS.filter((t) => med.timings && med.timings[t.key]).length;

export const weeklyLabel = (med) => `毎週${med.weeklyDay}曜`;

// 在庫があと何日もつかの目安を計算します（計算できないときは null）
export const estimateDaysLeft = (med) => {
  if (!(med.dose > 0)) return null;
  if (med.type === "weekly") return Math.floor(med.stock / med.dose) * 7;
  const perDay = dailyTimingCount(med) * med.dose;
  if (perDay <= 0) return null;
  return Math.floor(med.stock / perDay);
};

export const isLowStock = (med) => {
  const d = estimateDaysLeft(med);
  return d !== null && d <= LOW_STOCK_DAYS;
};

// その薬で選べるタイミングの一覧を返します
export const timingOptionsFor = (med) => {
  if (med && med.type === "weekly") return [{ key: "weekly", label: weeklyLabel(med) }];
  return TIMINGS.map((t) => ({ key: t.key, label: t.label }));
};

// 一覧のバッジに出す「毎日 朝・夜」「週1回（日曜）」のような説明です
export const scheduleLabel = (med) =>
  med.type === "weekly"
    ? `週1回（${med.weeklyDay}曜）`
    : `毎日 ${TIMINGS.filter((t) => med.timings && med.timings[t.key])
        .map((t) => t.label)
        .join("・")}`;

// 初めて開いたときに、使い方の見本として入っているお薬です
export const DEFAULT_MEDS = [
  {
    id: 1,
    name: "ロキソプロフェン錠",
    stock: 12,
    dose: 1,
    unit: "錠",
    image: null,
    type: "daily",
    createdAt: new Date(2026, 0, 1).toISOString(),
    efficacy: "頭痛や関節痛などの痛みや、発熱を抑えるお薬です。なるべく空腹時を避けて服用してください。",
    timings: { morning: true, noon: true, evening: true },
  },
  {
    id: 2,
    name: "マンジャロ皮下注",
    stock: 4,
    dose: 1,
    unit: "本",
    image: null,
    type: "weekly",
    createdAt: new Date(2026, 0, 1).toISOString(),
    efficacy: "血糖値を下げるお薬です。週に1回、同じ曜日に注射します。",
    weeklyDay: "日",
  },
];

export const todayWeekday = (now = new Date()) => WEEK_DAYS[new Date(now).getDay()];
