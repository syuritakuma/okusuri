/* お薬と服用記録を書き換える処理です。
   どの処理も「今のデータ」を受け取り、書き換えた「新しいデータ」を返します。
   在庫が足りないなど続けられないときは、新しいデータの代わりに error を返します。
   データの形は { medicines: [...], logs: [...] } です。 */

const NOT_ENOUGH = "在庫が足りません。先に補充してください。";

const newLogId = () => Date.now() + Math.random();

export const sortLogs = (list) => [...list].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

const changeStock = (medicines, medId, diff) =>
  medicines.map((m) => (m.id === medId ? { ...m, stock: m.stock + diff } : m));

/* 服用を1件記録して、その分だけ在庫を減らします。
   entry には medId, amount, timingKey, timingLabel, timestamp を入れます。
   あとから追加した記録には manual: true を付けます。 */
export function recordDose(data, entry) {
  const med = data.medicines.find((m) => m.id === entry.medId);
  if (!med) return { error: "お薬を選んでください。" };
  if (med.stock < entry.amount) return { error: NOT_ENOUGH };
  const log = { id: newLogId(), medName: med.name, unit: med.unit, ...entry };
  return {
    data: {
      medicines: changeStock(data.medicines, med.id, -entry.amount),
      logs: sortLogs([log, ...data.logs]),
    },
  };
}

// 記録を直します。在庫は「元の分を戻してから、新しい分を引く」形で調整します。
export function updateLog(data, logId, changes) {
  const before = data.logs.find((l) => l.id === logId);
  if (!before) return { error: "記録が見つかりませんでした。" };
  const medicines = changeStock(changeStock(data.medicines, before.medId, before.amount), changes.medId, -changes.amount);
  const target = medicines.find((m) => m.id === changes.medId);
  if (target && target.stock < 0) return { error: NOT_ENOUGH };
  return {
    data: {
      medicines,
      logs: sortLogs(data.logs.map((l) => (l.id === logId ? { ...l, ...changes } : l))),
    },
  };
}

// 記録を取り消して、使った分を在庫に戻します
export function deleteLog(data, logId) {
  const target = data.logs.find((l) => l.id === logId);
  if (!target) return { data };
  return {
    data: {
      medicines: changeStock(data.medicines, target.medId, target.amount),
      logs: data.logs.filter((l) => l.id !== logId),
    },
  };
}

export function addMedicine(data, fields, now = new Date()) {
  const med = { id: Date.now(), createdAt: new Date(now).toISOString(), ...fields };
  return { data: { ...data, medicines: [...data.medicines, med] } };
}

export function updateMedicine(data, id, fields) {
  return {
    data: {
      ...data,
      medicines: data.medicines.map((m) => {
        if (m.id !== id) return m;
        const next = { ...m, ...fields };
        // 毎日⇔週1回を切り替えたときは、使わなくなった方の設定を消しておきます
        if (next.type === "daily") delete next.weeklyDay;
        else delete next.timings;
        return next;
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

export function refill(data, id, amount) {
  if (!Number.isInteger(amount) || amount <= 0) return { error: "補充する数を正しく入力してください。" };
  return { data: { ...data, medicines: changeStock(data.medicines, id, amount) } };
}
