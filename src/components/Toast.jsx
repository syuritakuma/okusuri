import { IcCheck } from "../icons.jsx";

/* 画面の上に少しの間だけ出るお知らせです。toast.action があれば、右端にボタンを出します。 */
export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={
        "fixed left-1/2 -translate-x-1/2 bg-gray-900/95 text-white pl-6 py-3 rounded-2xl shadow-xl z-[80] flex items-center gap-2.5 w-[90%] max-w-sm toast-pos " +
        (toast.action ? "pr-3" : "pr-6")
      }
      role="status"
    >
      <IcCheck size={18} className="text-green-400 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium leading-snug">{toast.message}</span>
      {toast.action && (
        <button
          onClick={toast.action.onClick}
          className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white/15 active:bg-white/25 text-sm font-bold text-amber-300"
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
}
