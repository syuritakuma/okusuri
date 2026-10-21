import { IcCheck } from "../icons.jsx";

/* 画面の上に少しの間だけ出るお知らせです */
export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-6 py-3 rounded-2xl shadow-xl z-[80] flex items-center gap-2.5 w-[90%] max-w-sm toast-pos"
      role="status"
    >
      <IcCheck size={18} className="text-green-400 flex-shrink-0" />
      <span className="text-sm font-medium leading-snug">{message}</span>
    </div>
  );
}
