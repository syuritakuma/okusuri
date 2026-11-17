import { IcCheck } from "../icons.jsx";
import { formatLongDate, sameDay } from "../lib/date.js";
import { locationLabel, stockAt } from "../lib/medicine.js";
import { SLOT_HOURS, slotStatus } from "../lib/schedule.js";
import { TIMING_ICONS, TIMING_STYLE } from "../ui.js";
import Modal from "./Modal.jsx";

/* カレンダーで日付を押したときに出る、その日の服用をまとめて記録する画面です。
   「まだの分を全部まとめて記録」で朝・昼・夜をまとめて、各まとまりのボタンで「朝」などをまとめて、
   お薬ごとのボタンで1つずつ記録できます。記録した分は「済み」になり、押すと取り消せます。
   取り消しも、「朝をまとめて取り消す」や「この日の記録を全部取り消す」でまとめてできます
   （onUndoMany(お薬の一覧, 日, "朝" などの名前／1日分なら null) を呼び、App が確認してから取り消します）。
   slots は App で最新のデータから計算して渡すので、記録するとすぐに表示が変わります。 */
export default function DaySheet({ day, slots, location, onRecord, onUndo, onUndoMany, onClose }) {
  const isToday = sameDay(day, new Date());
  const allItems = slots.flatMap((s) => s.items);
  const pending = allItems.filter((i) => !i.log);
  const takenCount = allItems.length - pending.length;

  return (
    <Modal title={`${formatLongDate(day)}の服用`} onClose={onClose}>
      <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
        記録すると、{locationLabel(location)}（今いる場所）の在庫が減ります。
        {!isToday &&
          `過去の日の分は、朝${SLOT_HOURS.morning}時・昼${SLOT_HOURS.noon}時・夜${SLOT_HOURS.evening}時に飲んだものとして記録します。`}
      </p>

      {slots.length === 0 ? (
        <p className="text-sm text-gray-500 font-medium text-center py-10">この日に飲む予定のお薬はありません。</p>
      ) : (
        <>
          {pending.length > 0 ? (
            <button
              onClick={() => onRecord(pending, day)}
              className="w-full py-4 mb-5 rounded-2xl bg-gray-900 active:bg-gray-700 text-white font-bold shadow-lg"
            >
              まだの分を全部まとめて記録（{pending.length}件）
            </button>
          ) : (
            <p className="w-full py-3.5 mb-5 rounded-2xl bg-green-50 text-green-700 font-bold text-sm text-center">
              この日の分はすべて記録済みです
            </p>
          )}

          <div className="space-y-3">
            {slots.map((slot) => (
              <SlotCard
                key={slot.key}
                slot={slot}
                day={day}
                location={location}
                onRecord={onRecord}
                onUndo={onUndo}
                onUndoMany={onUndoMany}
              />
            ))}
          </div>

          {takenCount > 0 && (
            <button
              onClick={() => onUndoMany(allItems, day, null)}
              className="w-full mt-5 py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold text-sm active:bg-red-50"
            >
              この日の記録を全部取り消す（{takenCount}件）
            </button>
          )}
        </>
      )}
    </Modal>
  );
}

function SlotCard({ slot, day, location, onRecord, onUndo, onUndoMany }) {
  const Icon = TIMING_ICONS[slot.key];
  const style = TIMING_STYLE[slot.key];
  const pending = slot.items.filter((i) => !i.log);
  const status = slotStatus(slot);
  const anyTaken = pending.length < slot.items.length;
  return (
    <div className={"bg-white rounded-3xl border p-4 " + (status === "done" ? "border-green-200" : "border-gray-100")}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={20} className="text-gray-500" />
        <p className="font-extrabold text-gray-900">{slot.label}</p>
        <p className="text-[11px] font-bold text-gray-400">
          {slot.items.length - pending.length} / {slot.items.length}
        </p>
      </div>
      <div className="flex gap-2 mb-1">
        {pending.length > 0 && (
          <button
            onClick={() => onRecord(pending, day)}
            className={"flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm " + style.on}
          >
            {slot.label}をまとめて記録
          </button>
        )}
        {anyTaken && (
          <button
            onClick={() => onUndoMany(slot.items, day, slot.label)}
            className="flex-1 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-bold active:bg-red-50"
          >
            {slot.label}をまとめて取り消す
          </button>
        )}
      </div>
      <ul className="divide-y divide-gray-100">
        {slot.items.map((item) => (
          <ItemRow key={item.med.id} item={item} day={day} location={location} onRecord={onRecord} onUndo={onUndo} />
        ))}
      </ul>
    </div>
  );
}

function ItemRow({ item, day, location, onRecord, onUndo }) {
  const { med, log } = item;
  const notEnough = stockAt(med, location) < med.dose;
  return (
    <li className="flex items-center gap-3 py-2.5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{med.name}</p>
        <p className="text-[11px] text-gray-500 font-medium">
          1回 {med.dose}
          {med.unit}
        </p>
      </div>
      {log ? (
        <button
          onClick={() => onUndo(item)}
          aria-label={`${med.name}（${item.timingLabel}）の記録を取り消す`}
          className="flex-shrink-0 w-[76px] py-2 rounded-xl bg-green-100 active:bg-green-200 text-green-700 flex flex-col items-center"
        >
          <span className="flex items-center gap-1 text-xs font-bold">
            <IcCheck size={14} /> 済み
          </span>
          <span className="text-[9px] font-bold text-green-600/80">タップで取消</span>
        </button>
      ) : (
        <button
          onClick={() => onRecord([item], day)}
          disabled={notEnough}
          className={
            "flex-shrink-0 w-[76px] py-2.5 rounded-xl text-xs font-bold " +
            (notEnough ? "bg-gray-100 text-gray-400" : "bg-white border-2 border-gray-200 text-gray-700 active:bg-gray-50")
          }
        >
          {notEnough ? "在庫なし" : "飲んだ"}
        </button>
      )}
    </li>
  );
}
