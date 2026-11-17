import { LOCATIONS } from "../lib/medicine.js";

/* 「自宅｜実家」を選ぶボタンです。
   counts を渡すと、ボタンの中に場所ごとの在庫数も表示します（例：counts={{ home: 8, parents: 2 }}, unit="錠"）。 */
export default function LocationPicker({ value, onChange, counts, unit, label }) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={label}>
      {LOCATIONS.map((l) => (
        <button
          key={l.key}
          type="button"
          role="radio"
          aria-checked={value === l.key}
          onClick={() => onChange(l.key)}
          className={
            "py-3 rounded-2xl border-2 font-bold text-sm " +
            (value === l.key ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white text-gray-500")
          }
        >
          {l.label}
          {counts && (
            <span className="block text-[11px] font-medium mt-0.5 opacity-80">
              在庫 {counts[l.key]}
              {unit}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
