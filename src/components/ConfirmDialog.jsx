/* 削除など、取り消せない操作の前に出す確認の画面です */
export default function ConfirmDialog({ title, message, okLabel = "OK", onOk, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-6" role="alertdialog" aria-modal="true">
      <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl">
        <h3 className="text-lg font-extrabold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 font-medium leading-relaxed mb-7">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-3.5 rounded-2xl active:bg-gray-100"
          >
            やめる
          </button>
          <button onClick={onOk} className="flex-1 bg-red-600 active:bg-red-700 text-white font-bold py-3.5 rounded-2xl shadow-lg">
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
