import { useState } from "react";
import { LOCATIONS, dailyTimingCount, locationLabel, otherLocation, stockAt } from "../lib/medicine.js";
import { BTN_CANCEL, BTN_PRIMARY, LABEL_CLS } from "../ui.js";
import Modal from "./Modal.jsx";

// 持っていく日数のめやすです。毎日飲むお薬は「何日分」、週1回のお薬は「何週分」で数を入れられます。
const DAY_PRESETS = [3, 7, 14];
const WEEK_PRESETS = [1, 2, 4];

/* 自宅から実家へ持っていったときなどに、在庫を別の場所へ移す画面です。
   移す元は、最初は「今いる場所ではない方」になっています（実家にいるなら、自宅から持ってきた想定です）。 */
export default function MoveSheet({ med, defaultFrom, onApply, onClose }) {
  const [from, setFrom] = useState(defaultFrom);
  const [amount, setAmount] = useState("");
  const to = otherLocation(from);
  const have = stockAt(med, from);

  const weekly = med.type === "weekly";
  const perDay = dailyTimingCount(med) * med.dose;
  const presets = (weekly ? WEEK_PRESETS : DAY_PRESETS).map((n) => ({
    label: weekly ? `${n}週分` : `${n}日分`,
    value: weekly ? n * med.dose : n * perDay,
  }));

  return (
    <Modal title="在庫を移動する" onClose={onClose}>
      <p className="text-sm text-gray-600 font-medium mb-5 leading-relaxed">
        「{med.name}」を別の場所へ持っていったときに使います。合計の数は変わらず、移した分だけ置き場所が入れ替わります。
      </p>

      <div className="mb-5">
        <label className={LABEL_CLS}>どちらへ移しますか？</label>
        <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label="移動の向き">
          {LOCATIONS.map((l) => (
            <button
              key={l.key}
              type="button"
              role="radio"
              aria-checked={from === l.key}
              onClick={() => setFrom(l.key)}
              className={
                "py-3 px-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-between " +
                (from === l.key ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white text-gray-500")
              }
            >
              <span className="flex items-center gap-2">
                {l.label}
                <span aria-hidden="true">→</span>
                {locationLabel(otherLocation(l.key))}
              </span>
              <span className="text-[11px] font-medium">
                {l.label}に{stockAt(med, l.key)}
                {med.unit}
              </span>
            </button>
          ))}
        </div>
      </div>

      {presets[0].value > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setAmount(String(Math.min(p.value, have)))}
              disabled={have === 0}
              className={
                "py-3 rounded-2xl border-2 font-bold text-sm " +
                (amount === String(Math.min(p.value, have)) && have > 0
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-500")
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className="relative mb-2">
        <input
          type="number"
          inputMode="numeric"
          value={amount}
          min="1"
          max={have}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="移動する数を入力"
          aria-label="移動する数"
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg pr-16"
        />
        <span className="absolute right-5 top-4 text-gray-400 font-bold">{med.unit}</span>
      </div>
      <p className="text-[11px] text-gray-400 font-medium mb-6 leading-relaxed">
        {locationLabel(from)}にある{have}
        {med.unit}まで移せます。
      </p>

      <div className="flex gap-3">
        <button onClick={onClose} className={BTN_CANCEL}>
          やめる
        </button>
        <button onClick={() => onApply(from, parseInt(amount, 10))} className={BTN_PRIMARY}>
          {locationLabel(to)}へ移動する
        </button>
      </div>
    </Modal>
  );
}
