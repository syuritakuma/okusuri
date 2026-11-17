/* データの保存とバックアップです。
   保存先の名前（キー）とバックアップの形式は、以前の版のアプリと同じにしてあります。
   そのため、今までの記録やバックアップファイルをそのまま引き継げます。 */
import { DEFAULT_LOCATION, DEFAULT_MEDS, LOCATIONS, normalizeMedicine } from "./medicine.js";
import { dayKey } from "./date.js";
import { sortLogs } from "./records.js";

export const MEDS_KEY = "med_app_medicines_v2";
export const LOGS_KEY = "med_app_logs_v2";
// 「今いる場所（自宅／実家）」の選択です。端末ごとの設定なので、バックアップには含めません。
export const LOCATION_KEY = "med_app_location_v1";

const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
};

export function loadData() {
  const medicines = loadJSON(MEDS_KEY, null);
  const logs = loadJSON(LOGS_KEY, null);
  return {
    medicines: (Array.isArray(medicines) ? medicines : DEFAULT_MEDS).map(normalizeMedicine),
    logs: Array.isArray(logs) ? logs : [],
  };
}

// 保存できなかったとき（主に写真で容量がいっぱいのとき）は false を返します
export const saveMedicines = (medicines) => saveJSON(MEDS_KEY, medicines);
export const saveLogs = (logs) => saveJSON(LOGS_KEY, logs);

export function loadLocation() {
  const saved = loadJSON(LOCATION_KEY, null);
  return LOCATIONS.some((l) => l.key === saved) ? saved : DEFAULT_LOCATION;
}
export const saveLocation = (location) => saveJSON(LOCATION_KEY, location);

// 「今日」タブの表示の形（"list"＝一覧、"calendar"＝月カレンダー）です。これも端末ごとの設定です。
export const TODAY_VIEW_KEY = "med_app_today_view_v1";
export const loadTodayView = () => (loadJSON(TODAY_VIEW_KEY, "list") === "calendar" ? "calendar" : "list");
export const saveTodayView = (view) => saveJSON(TODAY_VIEW_KEY, view);

/* バックアップの形式は version 3 です。version 2 との違いは、お薬に場所ごとの在庫数（stocks）が
   加わったことだけです。合計の在庫数（stock）も今までどおり入れているので、
   version 2 のバックアップも読み込めます（そのときは全部を自宅の在庫として扱います）。 */
export function backupFile(data, now = new Date()) {
  const text = JSON.stringify(
    { app: "okusuri", version: 3, exportedAt: new Date(now).toISOString(), medicines: data.medicines, logs: data.logs },
    null,
    2,
  );
  return { text, fileName: `okusuri-backup-${dayKey(now)}.json` };
}

// バックアップファイルの中身を読み取ります。形式が違うときは null を返します。
export function parseBackup(text) {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.medicines) || !Array.isArray(parsed.logs)) return null;
    return { medicines: parsed.medicines.map(normalizeMedicine), logs: sortLogs(parsed.logs) };
  } catch (e) {
    return null;
  }
}
