import { useState } from "react";
import { addDays, toLocalInput } from "../lib/date.js";
import { timingOptionsFor } from "../lib/medicine.js";
import { BTN_CANCEL, BTN_PRIMARY, INPUT_CLS, LABEL_CLS, TIMING_STYLE } from "../ui.js";

const SMALL_BTN = "flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-xs";

/* 服用記録の入力フォームです。「あとから追加」と「記録の修正」で共用します。 */
export default function LogForm({ medicines, initial, submitLabel, onSubmit, onCancel, notify }) {
  const firstMed = medicines[0];
  const [medId, setMedId] = useState(initial ? initial.medId : firstMed ? firstMed.id : null);
  const med = medicines.find((m) => m.id === medId);
  const options = timingOptionsFor(med);
  const [timingKey, setTimingKey] = useState(
    initial && options.some((o) => o.key === initial.timingKey) ? initial.timingKey : options[0].key,
  );
  const [when, setWhen] = useState(toLocalInput(initial ? initial.timestamp : new Date()));
  const [amount, setAmount] = useState(String(initial ? initial.amount : med ? med.dose : 1));

  // 薬を変えたときは、その薬で選べるタイミングと使用量に合わせ直します
  const changeMed = (id) => {
    const next = medicines.find((m) => m.id === id);
    setMedId(id);
    const opts = timingOptionsFor(next);
    if (!opts.some((o) => o.key === timingKey)) setTimingKey(opts[0].key);
    if (next) setAmount(String(next.dose));
  };

  const shiftDay = (n) => {
    const base = new Date(when);
    if (!isNaN(base.getTime())) setWhen(toLocalInput(addDays(base, n)));
  };

  const submit = (e) => {
    e.preventDefault();
    const amountNum = parseInt(amount, 10);
    const target = medicines.find((m) => m.id === medId);
    if (!target) return notify("お薬を選んでください。");
    if (isNaN(amountNum) || amountNum < 1) return notify("使用量は1以上の数字で入力してください。");
    const ts = new Date(when);
    if (isNaN(ts.getTime())) return notify("日時を正しく入力してください。");
    if (ts.getTime() > Date.now() + 60 * 1000) return notify("未来の日時は記録できません。");
    const opt = timingOptionsFor(target).find((o) => o.key === timingKey) || { key: timingKey, label: timingKey };
    onSubmit({
      medId: target.id,
      medName: target.name,
      unit: target.unit,
      amount: amountNum,
      timingKey: opt.key,
      timingLabel: opt.label,
      timestamp: ts.toISOString(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className={LABEL_CLS} htmlFor="log-med">
          お薬
        </label>
        <select
          id="log-med"
          value={medId === null ? "" : String(medId)}
          onChange={(e) => changeMed(Number(e.target.value))}
          className={INPUT_CLS}
        >
          {medicines.map((m) => (
            <option key={m.id} value={String(m.id)}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={LABEL_CLS}>タイミング</label>
        <div className={"grid gap-2 " + (options.length === 1 ? "grid-cols-1" : "grid-cols-3")}>
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setTimingKey(o.key)}
              className={
                "py-3 rounded-2xl border-2 font-bold text-sm " +
                (timingKey === o.key
                  ? (TIMING_STYLE[o.key] || TIMING_STYLE.weekly).soft
                  : "border-gray-200 bg-white text-gray-500")
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={LABEL_CLS} htmlFor="log-when">
          飲んだ日時
        </label>
        <input id="log-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className={INPUT_CLS} />
        <div className="flex gap-2 mt-2">
          <button type="button" onClick={() => setWhen(toLocalInput(new Date()))} className={SMALL_BTN}>
            今にする
          </button>
          <button type="button" onClick={() => shiftDay(-1)} className={SMALL_BTN}>
            1日前へ
          </button>
          <button type="button" onClick={() => shiftDay(1)} className={SMALL_BTN}>
            1日後へ
          </button>
        </div>
      </div>

      <div>
        <label className={LABEL_CLS} htmlFor="log-amount">
          使用量
        </label>
        <div className="relative">
          <input
            id="log-amount"
            type="number"
            inputMode="numeric"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={INPUT_CLS + " pr-16"}
          />
          <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">{med ? med.unit : ""}</span>
        </div>
        <p className="text-[11px] text-gray-400 font-medium mt-2 leading-relaxed">
          記録を保存すると、その分だけ在庫が自動で減ります。使用量を直した場合は、差の分だけ在庫が調整されます。
        </p>
      </div>

      <div className="pt-1 flex gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className={BTN_CANCEL}>
            やめる
          </button>
        )}
        <button type="submit" className={BTN_PRIMARY}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
