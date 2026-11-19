import { useState } from "react";
import { IcTrash } from "../icons.jsx";
import { parseAppointmentText } from "../lib/appointment.js";
import { dayKey } from "../lib/date.js";
import { BTN_CANCEL, BTN_DANGER_OUTLINE, BTN_PRIMARY, INPUT_CLS, LABEL_CLS } from "../ui.js";
import Modal from "./Modal.jsx";

/* 次回の通院日を登録・編集する画面です。日付だけは必ず入れてもらい、時刻・病院・メモは任意です。
   登録した内容は、お薬の記録と同じように端末の中だけに保存します。
   毎朝の報告や予約票の文章を貼り付けると、日付・時刻・病院名を読み取って入力します。
   病院の欄には、前回登録した病院の名前（lastPlace）を最初から入れておきます。 */
export default function AppointmentSheet({ initial, lastPlace, onSave, onDelete, onClose, notify }) {
  const [date, setDate] = useState(initial ? initial.date : "");
  const [time, setTime] = useState(initial ? initial.time || "" : "");
  const [place, setPlace] = useState((initial && initial.place) || lastPlace || "");
  const [memo, setMemo] = useState(initial ? initial.memo || "" : "");
  const [pasteText, setPasteText] = useState("");

  const applyText = (text) => {
    const found = parseAppointmentText(text);
    if (!found) {
      notify("文章の中に、今日以降の日付が見つかりませんでした。");
      return;
    }
    setDate(found.date);
    if (found.time) setTime(found.time);
    if (found.place) setPlace(found.place);
    const items = ["日付", found.time && "時刻", found.place && "病院名"].filter(Boolean).join("・");
    notify(`${items}を読み取りました。内容を確かめて「保存する」を押してください。`);
  };

  // iPhone では、ボタンを押すと「ペースト」の確認が出て、コピーした文章を読み込めます
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPasteText(text);
      applyText(text);
    } catch (e) {
      notify("貼り付けできませんでした。下の欄を長押しして「ペースト」を選んでください。");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return notify("通院日を選んでください。");
    onSave({ date, time, place: place.trim(), memo: memo.trim() });
  };

  return (
    <Modal title="次回の通院日" onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        <div className="bg-teal-50/70 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-bold text-teal-800">文章から読み取る</p>
          <p className="text-[11px] text-teal-700 font-medium leading-relaxed">
            毎朝の報告や予約票の文章をコピーしておき、下のボタンを押すと、日付・時刻・病院名を自動で入力します。
          </p>
          <button
            type="button"
            onClick={pasteFromClipboard}
            className="w-full py-3 rounded-xl bg-teal-600 active:bg-teal-700 text-white font-bold text-sm"
          >
            コピーした文章を貼り付けて読み取る
          </button>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="ここに文章を貼り付けることもできます"
            aria-label="読み取る文章"
            rows="2"
            className={INPUT_CLS + " resize-none bg-white"}
          />
          {pasteText.trim() && (
            <button
              type="button"
              onClick={() => applyText(pasteText)}
              className="w-full py-2.5 rounded-xl bg-white border border-teal-300 active:bg-teal-50 text-teal-700 font-bold text-sm"
            >
              この文章から読み取る
            </button>
          )}
        </div>

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
