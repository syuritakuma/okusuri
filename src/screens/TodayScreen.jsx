import MedThumb from "../components/MedThumb.jsx";
import { IcAlert, IcCalendar, IcCheck } from "../icons.jsx";
import { estimateDaysLeft } from "../lib/medicine.js";
import { CARD, EMPTY_BOX, TIMING_ICONS, TIMING_STYLE } from "../ui.js";

/* 「今日」タブ：今日飲むお薬の一覧と、進み具合・在庫の警告を表示します */
export default function TodayScreen({ tasks, lowStockMeds, onTake }) {
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const rate = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && rate === 100;

  return (
    <div className="space-y-5">
      <div className={CARD + " p-6"}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider">今日の進み具合</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              {done}
              <span className="text-base font-bold text-gray-400">
                {" "}
                / {total} 回
              </span>
            </p>
          </div>
          <p className={"text-4xl font-extrabold " + (complete ? "text-green-500" : "text-blue-600")}>
            {rate}
            <span className="text-lg">%</span>
          </p>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={"h-full rounded-full transition-all duration-500 " + (complete ? "bg-green-500" : "bg-blue-600")}
            style={{ width: rate + "%" }}
          />
        </div>
        {complete && <p className="text-sm font-bold text-green-600 mt-3">今日の分はすべて飲み終わりました。</p>}
      </div>

      {lowStockMeds.length > 0 && (
        <div className="bg-red-50 border border-red-100 p-5 rounded-3xl flex items-start gap-3">
          <IcAlert size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700 mb-1">在庫が少なくなっています</p>
            <p className="text-xs text-red-600 leading-relaxed font-medium">
              {lowStockMeds.map((m) => `${m.name}（あと約${estimateDaysLeft(m)}日分）`).join("、")}
              。早めに受診や薬局での受け取りをご検討ください。
            </p>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className={EMPTY_BOX}>
          <IcCalendar size={44} className="mx-auto mb-4 opacity-40" />
          <p className="font-medium">今日飲むお薬は登録されていません。</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskRow key={task.med.id + "-" + task.timingKey} task={task} onTake={onTake} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onTake }) {
  const { med, timingKey, timingLabel, done, overdue } = task;
  const Icon = TIMING_ICONS[timingKey] || IcCalendar;
  const style = TIMING_STYLE[timingKey] || TIMING_STYLE.weekly;
  const notEnough = med.stock < med.dose;

  return (
    <div
      className={
        "bg-white p-4 rounded-3xl shadow-sm border flex items-center gap-3.5 " +
        (done ? "border-green-200 bg-green-50/40" : "border-gray-100")
      }
    >
      <MedThumb med={med} small />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-600">{timingLabel}</span>
          {overdue && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-600">未実施</span>}
        </div>
        <p className="font-bold text-gray-900 truncate">{med.name}</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          1回 {med.dose}
          {med.unit} ／ 残り {med.stock}
          {med.unit}
        </p>
      </div>
      <button
        onClick={() => onTake(med, timingKey, timingLabel)}
        disabled={done || notEnough}
        className={
          "flex-shrink-0 w-[86px] py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-white shadow-md " +
          (done ? "bg-green-100 text-green-700 shadow-none" : notEnough ? "bg-gray-200 text-gray-400 shadow-none" : style.on)
        }
      >
        {done ? <IcCheck size={20} /> : <Icon size={20} />}
        <span className="text-[11px] font-bold">{done ? "済み" : notEnough ? "在庫なし" : "飲んだ"}</span>
      </button>
    </div>
  );
}
