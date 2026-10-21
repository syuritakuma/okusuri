/* 計算とデータ書き換えの処理のテストです。 npm test で実行します。 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { addDays, lastOccurrenceOfWeekday, startOfDay } from "../src/lib/date.js";
import { estimateDaysLeft, isLowStock, scheduleLabel } from "../src/lib/medicine.js";
import * as records from "../src/lib/records.js";
import { computeStats, computeTodayTasks } from "../src/lib/schedule.js";
import { backupFile, parseBackup } from "../src/lib/storage.js";

// 2026年10月21日（水）の昼12時を「今」として扱います
const NOW = new Date(2026, 9, 21, 12, 0);
const at = (daysAgo, hour = 9) => {
  const d = addDays(startOfDay(NOW), -daysAgo);
  d.setHours(hour);
  return d.toISOString();
};

const daily = {
  id: 1,
  name: "朝夕の薬",
  stock: 10,
  dose: 1,
  unit: "錠",
  type: "daily",
  timings: { morning: true, noon: false, evening: true },
  createdAt: at(30),
};
const weekly = { id: 2, name: "週1の注射", stock: 4, dose: 1, unit: "本", type: "weekly", weeklyDay: "月", createdAt: at(30) };

const log = (medId, timingKey, timestamp, amount = 1) => ({ id: Math.random(), medId, timingKey, timingLabel: timingKey, timestamp, amount });

test("直近の曜日は今日を含めてさかのぼる", () => {
  assert.equal(lastOccurrenceOfWeekday("水", NOW).getDate(), 21);
  assert.equal(lastOccurrenceOfWeekday("月", NOW).getDate(), 19);
  assert.equal(lastOccurrenceOfWeekday("木", NOW).getDate(), 15);
});

test("在庫があと何日もつかを計算する", () => {
  assert.equal(estimateDaysLeft(daily), 5); // 1日2錠で10錠
  assert.equal(estimateDaysLeft(weekly), 28); // 週1本で4本
  assert.equal(isLowStock(daily), true);
  assert.equal(isLowStock(weekly), false);
  assert.equal(scheduleLabel(daily), "毎日 朝・夜");
  assert.equal(scheduleLabel(weekly), "週1回（月曜）");
});

test("今日の一覧：毎日の薬はタイミングごとに並び、記録済みは済みになる", () => {
  const tasks = computeTodayTasks([daily], [log(1, "morning", at(0, 8))], NOW);
  assert.deepEqual(
    tasks.map((t) => [t.timingKey, t.done]),
    [
      ["morning", true],
      ["evening", false],
    ],
  );
});

test("今日の一覧：週1回の薬は予定日を過ぎて未使用なら未実施として出る", () => {
  const tasks = computeTodayTasks([weekly], [], NOW);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].overdue, true);

  // 月曜に使っていれば、水曜の一覧には出ない
  assert.equal(computeTodayTasks([weekly], [log(2, "weekly", at(2))], NOW).length, 0);
});

test("集計：達成率と連続達成日数", () => {
  const logs = [
    log(1, "morning", at(0)), // 今日は途中（夜がまだ）
    log(1, "morning", at(1)),
    log(1, "evening", at(1, 20)),
    log(1, "morning", at(2)),
    log(1, "evening", at(2, 20)),
    log(1, "morning", at(3)), // 3日前は半分だけ
  ];
  const s = computeStats([daily], logs, 7, NOW);
  assert.equal(s.days.length, 7);
  assert.equal(s.totalExpected, 14);
  assert.equal(s.totalTaken, 6);
  assert.equal(s.days[6].rate, 50); // 今日
  assert.equal(s.streak, 2); // 今日は途中なので数えず、昨日・一昨日の2日
});

test("集計：登録前の日は予定に数えない", () => {
  const fresh = { ...daily, createdAt: at(1) };
  const s = computeStats([fresh], [], 7, NOW);
  assert.equal(s.totalExpected, 4);
  assert.equal(s.days[0].rate, null);
});

test("記録すると在庫が減り、取り消すと戻る", () => {
  const data = { medicines: [daily], logs: [] };
  const r1 = records.recordDose(data, { medId: 1, amount: 2, timingKey: "morning", timingLabel: "朝", timestamp: at(0) });
  assert.equal(r1.data.medicines[0].stock, 8);
  assert.equal(r1.data.logs[0].medName, "朝夕の薬");

  const r2 = records.deleteLog(r1.data, r1.data.logs[0].id);
  assert.equal(r2.data.medicines[0].stock, 10);
  assert.equal(r2.data.logs.length, 0);
});

test("在庫が足りないときは記録できない", () => {
  const data = { medicines: [{ ...daily, stock: 0 }], logs: [] };
  const r = records.recordDose(data, { medId: 1, amount: 1, timingKey: "morning", timingLabel: "朝", timestamp: at(0) });
  assert.ok(r.error);
});

test("記録の修正では差の分だけ在庫を調整する", () => {
  const first = records.recordDose(
    { medicines: [daily, weekly], logs: [] },
    { medId: 1, amount: 1, timingKey: "morning", timingLabel: "朝", timestamp: at(0) },
  ).data;
  const id = first.logs[0].id;

  const more = records.updateLog(first, id, { medId: 1, amount: 3 }).data;
  assert.equal(more.medicines[0].stock, 7);

  // 別の薬に付け替えると、元の薬は戻り、新しい薬が減る
  const moved = records.updateLog(first, id, { medId: 2, amount: 1, timingKey: "weekly" }).data;
  assert.equal(moved.medicines[0].stock, 10);
  assert.equal(moved.medicines[1].stock, 3);

  assert.ok(records.updateLog(first, id, { medId: 1, amount: 99 }).error);
});

test("毎日⇔週1回を切り替えると使わない設定が消える", () => {
  const r = records.updateMedicine({ medicines: [daily], logs: [] }, 1, { type: "weekly", weeklyDay: "金" });
  assert.equal(r.data.medicines[0].timings, undefined);
  assert.equal(r.data.medicines[0].weeklyDay, "金");
});

test("並び替えと補充", () => {
  const data = { medicines: [daily, weekly], logs: [] };
  assert.deepEqual(records.moveMedicine(data, 1, -1).data.medicines.map((m) => m.id), [2, 1]);
  assert.equal(records.moveMedicine(data, 0, -1).data, data);
  assert.equal(records.refill(data, 2, 4).data.medicines[1].stock, 8);
  assert.ok(records.refill(data, 2, NaN).error);
  assert.ok(records.refill(data, 2, 0).error);
});

test("バックアップは書き出した内容をそのまま読み戻せる", () => {
  const data = { medicines: [daily], logs: [log(1, "morning", at(1)), log(1, "evening", at(0))] };
  const { text, fileName } = backupFile(data, NOW);
  assert.equal(fileName, "okusuri-backup-2026-10-21.json");
  const restored = parseBackup(text);
  assert.equal(restored.medicines[0].name, "朝夕の薬");
  // 履歴は新しい順に並び直される
  assert.equal(restored.logs[0].timingKey, "evening");

  assert.equal(parseBackup("{}"), null);
  assert.equal(parseBackup("壊れたファイル"), null);
});
