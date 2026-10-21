import { useState } from "react";
import MedThumb from "../components/MedThumb.jsx";
import { IcAlert, IcDown, IcEdit, IcInfo, IcRefill, IcSort, IcTrash, IcUp } from "../icons.jsx";
import { estimateDaysLeft, isLowStock, scheduleLabel } from "../lib/medicine.js";
import { CARD, EMPTY_BOX } from "../ui.js";

/* 「お薬」タブ：登録したお薬と在庫の一覧です。並び順の入れ替えもここで行います。 */
export default function MedsScreen({ medicines, onRefill, onEdit, onDelete, onMove, onGoAdd }) {
  const [sortMode, setSortMode] = useState(false);

  if (medicines.length === 0) {
    return (
      <div className={EMPTY_BOX}>
        <IcAlert size={44} className="mx-auto mb-4 opacity-40" />
        <p className="font-medium mb-4">まだお薬が登録されていません。</p>
        <button onClick={onGoAdd} className="text-sm font-bold text-blue-600 underline">
          お薬を登録する
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {medicines.length > 1 && (
        <button
          onClick={() => setSortMode((v) => !v)}
          className={
            "w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border " +
            (sortMode ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-600 border-gray-200")
          }
        >
          <IcSort size={17} />
          {sortMode ? "並び替えを終わる" : "並び順を変える"}
        </button>
      )}

      {sortMode ? (
        <div className="space-y-2.5">
          <p className="text-xs text-gray-500 font-medium leading-relaxed px-1">
            上下のボタンで、お薬の表示順を自分の飲む順番に並べ替えられます。
          </p>
          {medicines.map((med, i) => (
            <SortRow key={med.id} med={med} index={i} last={i === medicines.length - 1} onMove={onMove} />
          ))}
        </div>
      ) : (
        medicines.map((med) => (
          <MedCard key={med.id} med={med} onRefill={onRefill} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}

function SortRow({ med, index, last, onMove }) {
  const arrowCls = (disabled) =>
    "w-12 h-12 rounded-xl border flex items-center justify-center " +
    (disabled ? "border-gray-100 text-gray-200" : "border-gray-200 text-gray-600 active:bg-gray-100");
  return (
    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 font-bold text-xs flex items-center justify-center flex-shrink-0">
        {index + 1}
      </span>
      <p className="flex-1 font-bold text-gray-900 truncate">{med.name}</p>
      <button onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="上へ移動" className={arrowCls(index === 0)}>
        <IcUp size={20} />
      </button>
      <button onClick={() => onMove(index, 1)} disabled={last} aria-label="下へ移動" className={arrowCls(last)}>
        <IcDown size={20} />
      </button>
    </div>
  );
}

function MedCard({ med, onRefill, onEdit, onDelete }) {
  const daysLeft = estimateDaysLeft(med);
  const low = isLowStock(med);
  return (
    <div className={CARD + " p-6 flex flex-col gap-4"}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-4 min-w-0">
          <MedThumb med={med} />
          <div className="min-w-0">
            <span
              className={
                "inline-block text-[10px] px-2 py-0.5 rounded-full font-bold " +
                (med.type === "weekly" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")
              }
            >
              {scheduleLabel(med)}
            </span>
            <h2 className="text-lg font-bold text-gray-900 leading-tight mt-1.5 break-words">{med.name}</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              1回 {med.dose}
              {med.unit}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-bold text-gray-400 mb-0.5 tracking-wider">在庫</p>
          <p className={"text-3xl font-extrabold leading-none " + (low ? "text-red-500" : "text-gray-900")}>
            {med.stock}
            <span className="text-xs font-semibold text-gray-500 ml-1">{med.unit}</span>
          </p>
          {daysLeft !== null && (
            <p className={"text-[11px] font-bold mt-1 " + (low ? "text-red-500" : "text-gray-400")}>あと約{daysLeft}日分</p>
          )}
        </div>
      </div>

      {med.efficacy && (
        <div className="bg-amber-50/60 p-3.5 rounded-2xl flex items-start gap-3">
          <IcInfo size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-gray-700 leading-relaxed break-words">{med.efficacy}</p>
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onRefill(med)}
          className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-1.5 active:bg-gray-700"
        >
          <IcRefill size={17} /> 補充
        </button>
        <button
          onClick={() => onEdit(med)}
          className="flex-1 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center gap-1.5 active:bg-gray-100"
        >
          <IcEdit size={16} /> 編集
        </button>
        <button
          onClick={() => onDelete(med)}
          aria-label="削除"
          className="w-14 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-400 active:text-red-500 flex items-center justify-center"
        >
          <IcTrash size={18} />
        </button>
      </div>
    </div>
  );
}
