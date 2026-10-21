import { IcShare, IcUpload } from "../icons.jsx";
import Modal from "./Modal.jsx";

/* 設定とバックアップの画面です */
export default function SettingsSheet({ medCount, logCount, onExport, onImportFile, onReset, onClose }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (file) onImportFile(file);
  };

  return (
    <Modal title="設定とバックアップ" onClose={onClose}>
      <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
        このアプリのデータは、お使いの端末の中だけに保存されています。機種を変えたりSafariの履歴を消したりすると消えてしまうため、ときどきバックアップを書き出しておくと安心です。
      </p>
      <div className="space-y-3">
        <button
          onClick={onExport}
          className="w-full bg-gray-900 active:bg-gray-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
        >
          <IcShare size={19} /> バックアップを書き出す
        </button>
        <label className="w-full bg-white border border-gray-200 active:bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer">
          <IcUpload size={19} /> バックアップを読み込む
          <input type="file" accept="application/json,.json" onChange={handleFile} className="hidden" />
        </label>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs font-bold text-gray-400 mb-3">今の登録状況</p>
        <div className="grid grid-cols-2 gap-3">
          <CountBox label="登録中のお薬" value={medCount} />
          <CountBox label="服用の記録" value={logCount} />
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full mt-8 py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold text-sm active:bg-red-50"
      >
        すべてのデータを削除する
      </button>
      <p className="text-[11px] text-gray-400 leading-relaxed mt-8">
        このアプリは服用の記録を助けるための道具です。服用量や飲み方については、必ず医師や薬剤師の指示に従ってください。
      </p>
    </Modal>
  );
}

function CountBox({ label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <p className="text-[11px] font-bold text-gray-400">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900 mt-1">
        {value}
        <span className="text-xs ml-1 text-gray-400">件</span>
      </p>
    </div>
  );
}
