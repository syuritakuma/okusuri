/* お薬そのものに関する決まりごとです */
import { WEEK_DAYS } from "./date.js";

// 毎日飲むお薬で選べるタイミングです。並び順が、そのまま画面での並び順になります。
export const TIMINGS = [
  { key: "morning", label: "朝" },
  { key: "noon", label: "昼" },
  { key: "evening", label: "夜" },
];

export const UNITS = ["錠", "本", "包", "カプセル", "mL", "回"];

// お薬を置いておく場所です。お薬ごとに、場所別の在庫数を持ちます。
export const LOCATIONS = [
  { key: "home", label: "自宅" },
  { key: "parents", label: "実家" },
];
export const DEFAULT_LOCATION = "home";

export const locationLabel = (key) => (LOCATIONS.find((l) => l.key === key) || LOCATIONS[0]).label;
export const otherLocation = (key) => (key === "home" ? "parents" : "home");

// 在庫があと何日分を下回ったら「少なくなっています」と知らせるかの目安です（全部の場所の合計で見ます）
export const LOW_STOCK_DAYS = 7;
// 今いる場所の在庫が、この日数分以下になったら知らせます
export const LOW_LOCATION_DAYS = 1;

export const dailyTimingCount = (med) => TIMINGS.filter((t) => med.timings && med.timings[t.key]).length;

export const weeklyLabel = (med) => `毎週${med.weeklyDay}曜`;

/* 場所ごとの在庫数です。
   場所の機能を足す前のデータには stocks がないため、そのときは全部を自宅の分として扱います。 */
export const stockAt = (med, location) => {
  if (med.stocks) return med.stocks[location] || 0;
  return location === DEFAULT_LOCATION ? med.stock || 0 : 0;
};

const sumStocks = (stocks) => LOCATIONS.reduce((s, l) => s + (stocks[l.key] || 0), 0);
const currentStocks = (med) => Object.fromEntries(LOCATIONS.map((l) => [l.key, stockAt(med, l.key)]));

// 場所ごとの在庫数を入れ、合計（stock）も合わせて直したお薬を返します
export const withStocks = (med, stocks) => {
  const filled = Object.fromEntries(LOCATIONS.map((l) => [l.key, stocks[l.key] || 0]));
  return { ...med, stocks: filled, stock: sumStocks(filled) };
};

export const changeStockAt = (med, location, diff) =>
  withStocks(med, { ...currentStocks(med), [location]: stockAt(med, location) + diff });

// 古い形式のデータを読み込んだときに、場所ごとの在庫数を持つ形にそろえます
export const normalizeMedicine = (med) => withStocks(med, currentStocks(med));

/* 在庫があと何日もつかの目安を計算します（計算できないときは null）。
   stock を渡すと、その数で計算します（場所ごとの在庫を調べるときに使います）。 */
export const estimateDaysLeft = (med, stock = med.stock) => {
  if (!(med.dose > 0)) return null;
  if (med.type === "weekly") return Math.floor(stock / med.dose) * 7;
  const perDay = dailyTimingCount(med) * med.dose;
  if (perDay <= 0) return null;
  return Math.floor(stock / perDay);
};

export const isLowStock = (med) => {
  const d = estimateDaysLeft(med);
  return d !== null && d <= LOW_STOCK_DAYS;
};

export const daysLeftAt = (med, location) => estimateDaysLeft(med, stockAt(med, location));

export const isLowAt = (med, location) => {
  const d = daysLeftAt(med, location);
  return d !== null && d <= LOW_LOCATION_DAYS;
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
    stocks: { home: 12, parents: 0 },
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
    stocks: { home: 4, parents: 0 },
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
