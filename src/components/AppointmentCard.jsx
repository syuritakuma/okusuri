import { IcAlert, IcEdit, IcHospital } from "../icons.jsx";
import { daysUntil, formatAppointment } from "../lib/appointment.js";
import { CARD } from "../ui.js";

/* 「今日」タブのいちばん上に出す、次回の通院日までの日数です。
   通院日を登録していないときは、登録をうながす小さな案内を出します。
   shortMeds には、通院日の前日までに在庫が足りなくなりそうなお薬（medsShortBefore の結果）を渡します。 */
export default function AppointmentCard({ appointment, shortMeds, onEdit }) {
  if (!appointment) {
    return (
      <button onClick={onEdit} className={CARD + " w-full p-4 flex items-center gap-3 text-left active:bg-gray-50"}>
        <span className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
          <IcHospital size={20} />
        </span>
        <span className="flex-1 text-sm text-gray-600 font-medium leading-relaxed">
          次回の通院日を登録すると、ここに通院日までの日数を表示します。
        </span>
        <span className="text-sm font-bold text-teal-600 flex-shrink-0">登録</span>
      </button>
    );
  }

  const days = daysUntil(appointment.date);
  return (
    <div className={CARD + " p-5"}>
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
          <IcHospital size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-400 tracking-wider">次回の通院</p>
          <p className="mt-0.5 font-extrabold text-gray-900">
            {days > 1 && (
              <>
                あと<span className="text-3xl text-teal-600 mx-1">{days}</span>日
              </>
            )}
            {days === 1 && <span className="text-2xl text-teal-600">明日です</span>}
            {days === 0 && <span className="text-2xl text-teal-600">今日です</span>}
            {days < 0 && <span className="text-base text-gray-500">登録した通院日が過ぎました</span>}
          </p>
          <p className="text-sm font-bold text-gray-700 mt-1">{formatAppointment(appointment)}</p>
          {appointment.place && <p className="text-sm text-gray-600 font-medium break-words">{appointment.place}</p>}
          {appointment.memo && (
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed whitespace-pre-wrap break-words">
              {appointment.memo}
            </p>
          )}
        </div>
        <button
          onClick={onEdit}
          aria-label="通院日を編集"
          className="p-2 -mr-1 -mt-1 rounded-xl text-gray-400 active:text-gray-700 active:bg-gray-100 flex-shrink-0"
        >
          <IcEdit size={18} />
        </button>
      </div>

      {days < 0 && (
        <button
          onClick={onEdit}
          className="w-full mt-4 py-3 rounded-2xl bg-teal-600 active:bg-teal-700 text-white font-bold text-sm"
        >
          次の通院日を登録する
        </button>
      )}

      {shortMeds.length > 0 && (
        <div className="mt-4 bg-red-50 rounded-2xl p-3.5 flex items-start gap-2.5">
          <IcAlert size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-medium leading-relaxed">
            通院日までに足りなくなりそうなお薬があります。
            {shortMeds.map(({ med, shortBy }) => `${med.name}があと${shortBy}${med.unit}`).join("、")}
            たりません。
          </p>
        </div>
      )}
    </div>
  );
}
