import { useMemo, useState } from "react";
import { IcLeft, IcRight } from "../icons.jsx";
import { WEEK_DAYS, sameDay, startOfDay } from "../lib/date.js";
import { SLOT_LABELS, computeDaySlots, slotStatus } from "../lib/schedule.js";
import { CARD, DOT_NONE, SLOT_DOT } from "../ui.js";

const STATUS_LABEL = { done: "飲んだ", partial: "一部", none: "まだ" };

/* 月カレンダーです。各日に、朝・昼・夜・週1回の丸印を並べ、飲んだかどうかを色で表します。
   日付を押すと onSelectDay(その日) を呼びます（その日の分をまとめて記録する画面を開きます）。
   これからの日は、予定だけを白丸で表示し、押せないようにしています。
   today（"2026-11-17" の形）を受け取るのは、日付が変わったときに描き直すためです。 */
export default function CalendarView({ medicines, logs, today, onSelectDay }) {
  // 0 なら今月、-1 なら先月、のように表示する月をずらします
  const [offset, setOffset] = useState(0);
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);

  const cells = useMemo(() => {
    const todayStart = startOfDay(new Date());
    const list = Array.from({ length: first.getDay() }, () => null); // 1日より前の空きマス
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (let date = 1; date <= daysInMonth; date++) {
      const day = new Date(first.getFullYear(), first.getMonth(), date);
      list.push({
        day,
        slots: computeDaySlots(medicines, logs, day),
        future: day > todayStart,
        isToday: sameDay(day, todayStart),
      });
    }
    return list;
  }, [medicines, logs, offset, today]);

  return (
    <div className={CARD + " p-4"}>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setOffset((o) => o - 1)}
          aria-label="前の月"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-gray-500 active:bg-gray-100"
        >
          <IcLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-base font-extrabold text-gray-900">
            {first.getFullYear()}年{first.getMonth() + 1}月
          </p>
          {offset < 0 && (
            <button onClick={() => setOffset(0)} className="text-[11px] font-bold text-blue-600">
              今月に戻る
            </button>
          )}
        </div>
        <button
          onClick={() => setOffset((o) => o + 1)}
          disabled={offset >= 0}
          aria-label="次の月"
          className={
            "w-11 h-11 rounded-xl flex items-center justify-center " +
            (offset >= 0 ? "text-gray-200" : "text-gray-500 active:bg-gray-100")
          }
        >
          <IcRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEK_DAYS.map((w, i) => (
          <p key={w} className={"text-center text-[11px] font-bold " + weekdayColor(i)}>
            {w}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (cell ? <DayCell key={i} cell={cell} onSelect={onSelectDay} /> : <div key={i} />))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 pt-3 border-t border-gray-100 text-[11px] font-bold text-gray-500">
        {Object.keys(SLOT_LABELS).map((key) => (
          <span key={key} className="flex items-center gap-1">
            <span className={"w-2 h-2 rounded-full " + SLOT_DOT[key].done} />
            {SLOT_LABELS[key]}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 font-medium mt-2 leading-relaxed">
        濃い丸は全部飲んだ、薄い丸は一部だけ飲んだ、白い丸はまだ飲んでいないことを表します。日付を押すと、その日の分をまとめて記録できます。
      </p>
    </div>
  );
}

const weekdayColor = (weekday) => (weekday === 0 ? "text-red-500" : weekday === 6 ? "text-blue-500" : "text-gray-500");

function DayCell({ cell, onSelect }) {
  const { day, slots, future, isToday } = cell;
  const summary = slots.map((s) => `${s.label} ${future ? "予定" : STATUS_LABEL[slotStatus(s)]}`).join("、");
  return (
    <button
      onClick={() => onSelect(day)}
      disabled={future}
      aria-label={`${day.getMonth() + 1}月${day.getDate()}日${summary ? "：" + summary : ""}`}
      className={
        "min-h-[3.25rem] rounded-xl flex flex-col items-center pt-1.5 pb-1 " +
        (isToday ? "bg-blue-50 ring-2 ring-blue-500 " : "") +
        (future ? "opacity-40" : "active:bg-gray-100")
      }
    >
      <span className={"text-sm font-bold leading-none " + (isToday ? "text-blue-700" : weekdayColor(day.getDay()))}>
        {day.getDate()}
      </span>
      <span className="flex flex-wrap justify-center gap-[3px] mt-1.5 px-0.5">
        {slots.map((s) => {
          const status = future ? "none" : slotStatus(s);
          return (
            <span
              key={s.key}
              className={"w-1.5 h-1.5 rounded-full " + (status === "none" ? DOT_NONE : SLOT_DOT[s.key][status])}
            />
          );
        })}
      </span>
    </button>
  );
}
