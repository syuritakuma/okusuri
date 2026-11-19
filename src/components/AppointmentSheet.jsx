import { useState } from "react";
import { IcTrash } from "../icons.jsx";
import { dayKey } from "../lib/date.js";
import { BTN_CANCEL, BTN_DANGER_OUTLINE, BTN_PRIMARY, INPUT_CLS, LABEL_CLS } from "../ui.js";
import Modal from "./Modal.jsx";

/* 次回の通院日を登録・編集する画面です。日付だけは必ず入れてもらい、時刻・病院・メモは任意です。
   登録した内容は、お薬の記録と同じように端末の中だけに保存します。 */
export default function AppointmentSheet({ initial, onSave, onDelete, onClose, notify }) {
  const [date, setDate] = useState(initial ? initial.date : "");
  const [time, setTime] = useState(initial ? initial.time || "" : "");
  const [place, setPlace] = useState(initial ? initial.place || "" : "");
  const [memo, setMemo] = useState(initial ? initial.memo || "" : "");

  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return notify("通院日を選んでください。");
    onSave({ date, time, place: place.trim(), memo: memo.trim() });
  };

  return (
    <Modal title="次回の通院日" onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        <div className="flex gap-3">
          <div className="flex-[3]">
            <label className={LABEL_CLS} htmlFor="appt-date">
              通院日
            </label>
            <input
              id="appt-date"
              type="date"
              value={date}
              min={dayKey(new Date())}
              onChange={(e) => setDate(e.target.value)}
              className={INPUT_CLS}
              required
            />
          </div>
          <div className="flex-[2]">
            <label className={LABEL_CLS} htmlFor="appt-time">
              時刻（任意）
            </label>
            <input id="appt-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={INPUT_CLS} />
          </div>
        </div>

        <div>
          <label className={LABEL_CLS} htmlFor="appt-place">
            病院（任意）
          </label>
          <input
            id="appt-place"
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="例：○○病院 糖尿病科"
            className={INPUT_CLS}
          />
        </div>

        <div>
          <label className={LABEL_CLS} htmlFor="appt-memo">
            メモ（任意）
          </label>
          <textarea
            id="appt-memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例：11時から検査。保険証と診察券を持っていく"
            rows="2"
            className={INPUT_CLS + " resize-none"}
          />
        </div>

        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
          登録した内容は、この端末の中だけに保存されます。バックアップを書き出すと、通院日も一緒に保存されます。
        </p>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className={BTN_CANCEL}>
            やめる
          </button>
          <button type="submit" className={BTN_PRIMARY}>
            保存する
          </button>
        </div>
      </form>

      {initial && (
        <button onClick={onDelete} className={BTN_DANGER_OUTLINE}>
          <IcTrash size={17} /> 通院日の登録を消す
        </button>
      )}
    </Modal>
  );
}
