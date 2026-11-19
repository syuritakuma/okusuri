import AppointmentCard from "../components/AppointmentCard.jsx";
import CalendarView from "../components/CalendarView.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
import MedThumb from "../components/MedThumb.jsx";
import { IcAlert, IcCalendar, IcCheck, IcList } from "../icons.jsx";
import { estimateDaysLeft, locationLabel, otherLocation, stockAt } from "../lib/medicine.js";
import { CARD, EMPTY_BOX, TIMING_ICONS, TIMING_STYLE } from "../ui.js";

const VIEWS = [
  { key: "list", label: "リスト", Icon: IcList },
  { key: "calendar", label: "カレンダー", Icon: IcCalendar },
];

/* 「今日」タブ：今日飲むお薬の一覧と、進み具合・在庫の警告を表示します。
   「飲んだ」を押すと、上で選んでいる「今いる場所」の在庫が減ります。
   飲み終えた項目の「済み」を押すと、その記録を取り消せます（間違えて押したとき用）。
   「リスト｜カレンダー」で、今日の一覧と月カレンダーを切り替えられます。
   カレンダーで日付を押すと onSelectDay が呼ばれ、その日の分をまとめて記録する画面が開きます。
   いちばん上には、次回の通院日までの日数を表示します（押すと onEditAppointment で登録・編集）。 */
export default function TodayScreen({
  tasks,
  lowStockMeds,
  lowHereMeds,
  location,
  onLocationChange,
  onTake,
  onUndo,
  view,
  onViewChange,
  medicines,
  logs,
  today,
  onSelectDay,
  appointment,
  shortMeds,
  onEditAppointment,
}) {
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const rate = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && rate === 100;

  return (
    <div className="space-y-5">
      <AppointmentCard appointment={appointment} shortMeds={shortMeds} onEdit={onEditAppointment} />

      <div className={CARD + " p-5"}>
        <p className="text-xs font-bold text-gray-400 tracking-wider mb-3">今いる場所</p>
        <LocationPicker value={location} onChange={onLocationChange} label="今いる場所" />
      </div>

      <div className="flex bg-gray-200/70 rounded-2xl p-1" role="radiogroup" aria-label="表示の切り替え">
        {VIEWS.map(({ key, label, Icon }) => (
          <button
            key={key}
            role="radio"
            aria-checked={view === key}
            onClick={() => onViewChange(key)}
            className={
              "flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 " +
              (view === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")
            }
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {view === "list" && (
        <div className={CARD + " p-6"}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider">今日の進み具合</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">
                {done}
                <span className="text-base font-bold text-gray-400"> / {total} 回</span>
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
      )}

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

      {lowHereMeds.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-start gap-3">
          <IcAlert size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 mb-1">{locationLabel(location)}にある分が少なくなっています</p>
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              {lowHereMeds.map((m) => `${m.name}（残り${stockAt(m, location)}${m.unit}）`).join("、")}。
              {locationLabel(otherLocation(location))}から持ってきたら、「お薬」タブの「移動」で記録してください。
            </p>
          </div>
        </div>
      )}

      {view === "calendar" ? (
        <CalendarView medicines={medicines} logs={logs} today={today} onSelectDay={onSelectDay} />
      ) : tasks.length === 0 ? (
        <div className={EMPTY_BOX}>
          <IcCalendar size={44} className="mx-auto mb-4 opacity-40" />
          <p className="font-medium">今日飲むお薬は登録されていません。</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskRow key={task.med.id + "-" + task.timingKey} task={task} location={location} onTake={onTake} onUndo={onUndo} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, location, onTake, onUndo }) {
  const { med, timingKey, timingLabel, done, overdue } = task;
  const Icon = TIMING_ICONS[timingKey] || IcCalendar;
  const style = TIMING_STYLE[timingKey] || TIMING_STYLE.weekly;
  const here = stockAt(med, location);
  const notEnough = here < med.dose;

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
          {med.unit} ／ {locationLabel(location)}の残り {here}
          {med.unit}
        </p>
      </div>
      {done ? (
        <button
          onClick={() => onUndo(task)}
          aria-label={`${med.name}（${timingLabel}）の記録を取り消す`}
          className="flex-shrink-0 w-[86px] py-2.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 bg-green-100 active:bg-green-200 text-green-700"
        >
          <IcCheck size={20} />
          <span className="text-[11px] font-bold">済み</span>
          <span className="text-[9px] font-bold text-green-600/80">タップで取消</span>
        </button>
      ) : (
        <button
          onClick={() => onTake(med, timingKey, timingLabel)}
          disabled={notEnough}
          className={
            "flex-shrink-0 w-[86px] py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-white shadow-md " +
            (notEnough ? "bg-gray-200 text-gray-400 shadow-none" : style.on)
          }
        >
          <Icon size={20} />
          <span className="text-[11px] font-bold">{notEnough ? "在庫なし" : "飲んだ"}</span>
        </button>
      )}
    </div>
  );
}
