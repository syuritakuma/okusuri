/* データの保存とバックアップです。
   保存先の名前（キー）とバックアップの形式は、以前の版のアプリと同じにしてあります。
   そのため、今までの記録やバックアップファイルをそのまま引き継げます。 */
import { DEFAULT_MEDS } from "./medicine.js";
import { dayKey } from "./date.js";
import { sortLogs } from "./records.js";

export const MEDS_KEY = "med_app_medicines_v2";
export const LOGS_KEY = "med_app_logs_v2";

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
    medicines: Array.isArray(medicines) ? medicines : DEFAULT_MEDS,
    logs: Array.isArray(logs) ? logs : [],
  };
}

// 保存できなかったとき（主に写真で容量がいっぱいのとき）は false を返します
export const saveMedicines = (medicines) => saveJSON(MEDS_KEY, medicines);
export const saveLogs = (logs) => saveJSON(LOGS_KEY, logs);

export function backupFile(data, now = new Date()) {
  const text = JSON.stringify(
    { app: "okusuri", version: 2, exportedAt: new Date(now).toISOString(), medicines: data.medicines, logs: data.logs },
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
    return { medicines: parsed.medicines, logs: sortLogs(parsed.logs) };
  } catch (e) {
    return null;
  }
}
