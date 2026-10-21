import { useState } from "react";
import { IcImage } from "../icons.jsx";
import { WEEK_DAYS } from "../lib/date.js";
import { MAX_IMAGE_BYTES, loadResizedImage } from "../lib/image.js";
import { TIMINGS, UNITS } from "../lib/medicine.js";
import { BTN_CANCEL, BTN_PRIMARY, INPUT_CLS, LABEL_CLS, TIMING_ICONS, TIMING_STYLE } from "../ui.js";

const choiceCls = (selected, selectedCls) =>
  "py-3.5 rounded-2xl border-2 font-bold text-sm " + (selected ? selectedCls : "border-gray-200 bg-white text-gray-500");

/* お薬の入力フォームです。新規登録と編集の両方で使います。
   initial を渡すと、その内容が最初から入った状態（編集）になります。 */
export default function MedicineForm({ initial, submitLabel, onSubmit, onCancel, notify }) {
  const [name, setName] = useState(initial ? initial.name : "");
  const [efficacy, setEfficacy] = useState(initial && initial.efficacy ? initial.efficacy : "");
  const [stock, setStock] = useState(initial ? String(initial.stock) : "");
  const [dose, setDose] = useState(initial ? String(initial.dose) : "1");
  const [unit, setUnit] = useState(initial ? initial.unit : "錠");
  const [image, setImage] = useState(initial ? initial.image : null);
  const [type, setType] = useState(initial ? initial.type : "daily");
  const [timings, setTimings] = useState(
    initial && initial.timings ? { ...initial.timings } : { morning: false, noon: false, evening: false },
  );
  const [weeklyDay, setWeeklyDay] = useState(
    initial && initial.weeklyDay ? initial.weeklyDay : WEEK_DAYS[new Date().getDay()],
  );

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      notify("画像が大きすぎます。8MB以下の画像を選んでください。");
      return;
    }
    try {
      setImage(await loadResizedImage(file));
    } catch (err) {
      notify("画像を読み込めませんでした。別の画像を選んでください。");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const stockNum = parseInt(stock, 10);
    const doseNum = parseInt(dose, 10);
    if (!name.trim()) return notify("お薬の名前を入力してください。");
    if (isNaN(stockNum) || stockNum < 0) return notify("在庫数は0以上の数字で入力してください。");
    if (isNaN(doseNum) || doseNum < 1) return notify("1回の使用量は1以上の数字で入力してください。");
    if (type === "daily" && !TIMINGS.some((t) => timings[t.key])) {
      return notify("服用するタイミングを1つ以上選んでください。");
    }
    onSubmit({
      name: name.trim(),
      efficacy: efficacy.trim(),
      stock: stockNum,
      dose: doseNum,
      unit,
      image,
      type,
      ...(type === "daily" ? { timings } : { weeklyDay }),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className={LABEL_CLS}>お薬の画像（任意）</label>
        <div className="flex items-center gap-4">
          {image ? (
            <img src={image} alt="プレビュー" className="w-20 h-20 object-cover rounded-2xl border border-gray-200 shadow-sm" />
          ) : (
            <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
              <IcImage size={24} />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <label className="block cursor-pointer bg-white border border-gray-200 active:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-2xl text-center shadow-sm text-sm">
              写真を撮る・選ぶ
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="w-full text-xs font-bold text-gray-400 active:text-red-500 py-1"
              >
                画像を外す
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={LABEL_CLS} htmlFor="med-name">
            お薬の名前
          </label>
          <input
            id="med-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：マンジャロ皮下注"
            className={INPUT_CLS}
            required
          />
        </div>

        <div>
          <label className={LABEL_CLS} htmlFor="med-efficacy">
            効能・メモ（任意）
          </label>
          <textarea
            id="med-efficacy"
            value={efficacy}
            onChange={(e) => setEfficacy(e.target.value)}
            placeholder="例：血糖値を下げるお薬です。朝食後に服用します。"
            className={INPUT_CLS + " resize-none"}
            rows="2"
          />
        </div>

        <div>
          <label className={LABEL_CLS}>服用スタイル</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("daily")}
              className={choiceCls(type === "daily", "border-blue-500 bg-blue-50 text-blue-700")}
            >
              毎日飲む薬
            </button>
            <button
              type="button"
              onClick={() => setType("weekly")}
              className={choiceCls(type === "weekly", "border-purple-500 bg-purple-50 text-purple-700")}
            >
              週1回のお薬
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className={LABEL_CLS} htmlFor="med-stock">
              今ある在庫数
            </label>
            <div className="relative">
              <input
                id="med-stock"
                type="number"
                inputMode="numeric"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="例：28"
                className={INPUT_CLS + " pr-24"}
                required
              />
              <span className="absolute right-2 top-3">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  aria-label="単位"
                  className="bg-transparent border-none text-gray-600 font-medium text-base focus:outline-none"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </span>
            </div>
          </div>
          <div className="flex-1">
            <label className={LABEL_CLS} htmlFor="med-dose">
              1回の使用量
            </label>
            <div className="relative">
              <input
                id="med-dose"
                type="number"
                inputMode="numeric"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                min="1"
                className={INPUT_CLS + " pr-16"}
                required
              />
              <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-sm">{unit}</span>
            </div>
          </div>
        </div>
      </div>

      {type === "daily" ? (
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-3">いつ飲みますか？（複数選べます）</label>
          <div className="flex gap-3">
            {TIMINGS.map(({ key, label }) => {
              const Icon = TIMING_ICONS[key];
              return (
                <label
                  key={key}
                  className={
                    "flex-1 flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 " +
                    (timings[key] ? TIMING_STYLE[key].soft : "border-gray-200 bg-white text-gray-400")
                  }
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={!!timings[key]}
                    onChange={() => setTimings((p) => ({ ...p, [key]: !p[key] }))}
                  />
                  <Icon size={24} className="mb-1.5" />
                  <span className="text-sm font-bold">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-3">何曜日に使いますか？</label>
          <div className="grid grid-cols-7 gap-1.5">
            {WEEK_DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setWeeklyDay(d)}
                className={
                  "py-3 rounded-xl border font-bold text-sm " +
                  (weeklyDay === d
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-white text-gray-500 border-gray-200")
                }
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 flex gap-3">
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
