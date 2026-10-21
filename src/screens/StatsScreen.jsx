import { IcCheck, IcClip, IcEdit, IcFire, IcPlus } from "../icons.jsx";
import { formatDateTime } from "../lib/date.js";
import { CARD } from "../ui.js";

// 履歴が長くなりすぎると画面が重くなるため、新しいものから順にこの件数まで表示します
const MAX_LOGS_SHOWN = 200;

const barColor = (rate) =>
  rate === null ? "bg-gray-200" : rate >= 100 ? "bg-green-500" : rate >= 50 ? "bg-blue-500" : "bg-red-400";

/* 「記録」タブ：服用できた割合のグラフと、服用の履歴です */
export default function StatsScreen({ stats, range, onRangeChange, logs, onAddLog, onEditLog }) {
  const narrow = range === 7;
  return (
    <div className="space-y-5">
      <div className={CARD + " p-6"}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-gray-700">服用できた割合</p>
          <div className="flex bg-gray-100 rounded-full p-1">
            {[7, 30].map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={
                  "px-3.5 py-1.5 rounded-full text-xs font-bold " +
                  (range === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")
                }
              >
                {r}日
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-6 mb-6">
          <div>
            <p className="text-[11px] font-bold text-gray-400 tracking-wider">達成率</p>
            <p className="text-4xl font-extrabold text-blue-600 leading-none mt-1">
              {stats.overall === null ? "—" : stats.overall}
              <span className="text-lg">%</span>
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-1">
              {stats.totalTaken} / {stats.totalExpected} 回
            </p>
          </div>
          <div className="border-l border-gray-100 pl-6">
            <p className="text-[11px] font-bold text-gray-400 tracking-wider">連続達成</p>
            <p className="text-4xl font-extrabold text-orange-500 leading-none mt-1 flex items-center gap-1">
              <IcFire size={26} className="text-orange-400" />
              {stats.streak}
              <span className="text-lg">日</span>
            </p>
          </div>
        </div>

        <div className={"flex items-end justify-between h-36 border-b border-gray-100 pb-1 " + (narrow ? "gap-2" : "gap-[2px]")}>
          {stats.days.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full">
              {narrow && <span className="text-[9px] font-bold text-gray-400 mb-1">{d.rate === null ? "—" : d.rate}</span>}
              <div
                className={"w-full rounded-t-md transition-all duration-500 " + barColor(d.rate)}
                style={{
                  height: (d.rate === null ? 0 : Math.max(d.rate, 4)) + "%",
                  minHeight: d.rate === null ? "4px" : undefined,
                }}
              />
            </div>
          ))}
        </div>
        <div className={"flex justify-between mt-2 " + (narrow ? "gap-2" : "gap-[2px]")}>
          {stats.days.map((d, i) => (
            <div key={d.label} className="flex-1 text-center overflow-hidden">
              <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">
                {narrow ? d.weekday : i % 7 === 0 ? d.label : ""}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 font-medium mt-4 leading-relaxed">
          緑は予定どおり全部飲めた日、青は半分以上飲めた日、赤は半分未満だった日です。灰色は服用予定がなかった日を表します。
        </p>
      </div>

      <button
        onClick={onAddLog}
        className="w-full py-4 rounded-2xl bg-blue-600 active:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
      >
        <IcPlus size={19} /> 飲み忘れ分をあとから記録する
      </button>

      <div className={CARD + " overflow-hidden"}>
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-700">服用の履歴</p>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">記録をタップすると、日時や使用量を直せます。</p>
        </div>
        {logs.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <IcClip size={44} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium">まだ服用の記録がありません。</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {logs.slice(0, MAX_LOGS_SHOWN).map((log) => (
              <li key={log.id}>
                <button onClick={() => onEditLog(log)} className="w-full p-5 flex items-center gap-4 text-left active:bg-gray-50">
                  <div className="bg-green-50 text-green-600 p-2.5 rounded-full flex-shrink-0">
                    <IcCheck size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                        {log.timingLabel}
                      </span>
                      {log.manual && (
                        <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                          後から追加
                        </span>
                      )}
                      <p className="font-bold text-gray-900 truncate">{log.medName}</p>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      {formatDateTime(log.timestamp)}
                      <span className="ml-2">
                        （{log.amount}
                        {log.unit}）
                      </span>
                    </p>
                  </div>
                  <IcEdit size={18} className="text-gray-300 flex-shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
