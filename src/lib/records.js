/* お薬と服用記録を書き換える処理です。
   どの処理も「今のデータ」を受け取り、書き換えた「新しいデータ」を返します。
   在庫が足りないなど続けられないときは、新しいデータの代わりに error を返します。
   データの形は { medicines: [...], logs: [...] } です。

   在庫はお薬ごと・場所（自宅／実家）ごとに持っています。
   服用の記録にも、どちらの場所で飲んだか（location）を残します。
   場所の機能を足す前の記録には location がないため、自宅で飲んだものとして扱います。 */
import { DEFAULT_LOCATION, changeStockAt, locationLabel, otherLocation, stockAt, withStocks } from "./medicine.js";

const notEnoughAt = (location) =>
  `${locationLabel(location)}の在庫が足りません。補充するか、${locationLabel(otherLocation(location))}から移動してください。`;

const newLogId = () => Date.now() + Math.random();

export const logLocation = (log) => log.location || DEFAULT_LOCATION;

export const sortLogs = (list) => [...list].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

const changeStock = (medicines, medId, location, diff) =>
  medicines.map((m) => (m.id === medId ? changeStockAt(m, location, diff) : m));

/* 服用を1件記録して、飲んだ場所の在庫をその分だけ減らします。
   entry には medId, amount, location, timingKey, timingLabel, timestamp を入れます。
   あとから追加した記録には manual: true を付けます。 */
export function recordDose(data, entry) {
  const med = data.medicines.find((m) => m.id === entry.medId);
  if (!med) return { error: "お薬を選んでください。" };
  const location = entry.location || DEFAULT_LOCATION;
  if (stockAt(med, location) < entry.amount) return { error: notEnoughAt(location) };
  const log = { id: newLogId(), medName: med.name, unit: med.unit, ...entry, location };
  return {
    data: {
      medicines: changeStock(data.medicines, med.id, location, -entry.amount),
      logs: sortLogs([log, ...data.logs]),
    },
  };
}

// 記録を直します。在庫は「元の場所に元の分を戻してから、新しい場所から新しい分を引く」形で調整します。
export function updateLog(data, logId, changes) {
  const before = data.logs.find((l) => l.id === logId);
  if (!before) return { error: "記録が見つかりませんでした。" };
  const location = changes.location || logLocation(before);
  const restored = changeStock(data.medicines, before.medId, logLocation(before), before.amount);
  const medicines = changeStock(restored, changes.medId, location, -changes.amount);
  const target = medicines.find((m) => m.id === changes.medId);
  if (target && stockAt(target, location) < 0) return { error: notEnoughAt(location) };
  return {
    data: {
      medicines,
      logs: sortLogs(data.logs.map((l) => (l.id === logId ? { ...l, ...changes, location } : l))),
    },
  };
}

// 記録を取り消して、使った分を飲んだ場所の在庫に戻します
export function deleteLog(data, logId) {
  const target = data.logs.find((l) => l.id === logId);
  if (!target) return { data };
  return {
    data: {
      medicines: changeStock(data.medicines, target.medId, logLocation(target), target.amount),
      logs: data.logs.filter((l) => l.id !== logId),
    },
  };
}

// fields.stocks に場所ごとの在庫数（{ home: 10, parents: 4 } の形）を入れて渡します
export function addMedicine(data, fields, now = new Date()) {
  const { stocks, ...rest } = fields;
  const med = withStocks({ id: Date.now(), createdAt: new Date(now).toISOString(), ...rest }, stocks || {});
  return { data: { ...data, medicines: [...data.medicines, med] } };
}

export function updateMedicine(data, id, fields) {
  return {
    data: {
      ...data,
      medicines: data.medicines.map((m) => {
        if (m.id !== id) return m;
        const { stocks, ...rest } = fields;
        const next = { ...m, ...rest };
        // 毎日⇔週1回を切り替えたときは、使わなくなった方の設定を消しておきます
        if (next.type === "daily") delete next.weeklyDay;
        else delete next.timings;
        return stocks ? withStocks(next, stocks) : next;
      }),
    },
  };
}

// お薬を一覧から外します。これまでの服用記録は残します。
export function deleteMedicine(data, id) {
  return { data: { ...data, medicines: data.medicines.filter((m) => m.id !== id) } };
}

export function moveMedicine(data, index, dir) {
  const to = index + dir;
  if (to < 0 || to >= data.medicines.length) return { data };
  const medicines = [...data.medicines];
  const [item] = medicines.splice(index, 1);
  medicines.splice(to, 0, item);
  return { data: { ...data, medicines } };
}

// 薬局などで受け取った分を、指定した場所の在庫に足します
export function refill(data, id, amount, location = DEFAULT_LOCATION) {
  if (!Number.isInteger(amount) || amount <= 0) return { error: "補充する数を正しく入力してください。" };
  return { data: { ...data, medicines: changeStock(data.medicines, id, location, amount) } };
}

// 自宅から実家へ持っていったときなど、在庫を別の場所へ移します。合計の数は変わりません。
export function moveStock(data, id, from, amount) {
  if (!Number.isInteger(amount) || amount <= 0) return { error: "移動する数を正しく入力してください。" };
  const med = data.medicines.find((m) => m.id === id);
  if (!med) return { error: "お薬が見つかりませんでした。" };
  const have = stockAt(med, from);
  if (have < amount) return { error: `${locationLabel(from)}には${have}${med.unit}しかありません。` };
  const to = otherLocation(from);
  return {
    data: {
      ...data,
      medicines: data.medicines.map((m) => (m.id === id ? changeStockAt(changeStockAt(m, from, -amount), to, amount) : m)),
    },
  };
}
