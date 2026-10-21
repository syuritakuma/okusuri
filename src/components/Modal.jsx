import { useEffect } from "react";
import { IcClose } from "../icons.jsx";

/* 下から出てくるシート型の画面です */
export default function Modal({ title, onClose, children }) {
  // シートを開いている間は、後ろの画面がスクロールしないようにします
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-gray-50 rounded-t-3xl max-h-[92dvh] overflow-y-auto shadow-2xl modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sticky top-0 bg-gray-50/95 backdrop-blur px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-100 z-10">
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 active:text-gray-700 rounded-full" aria-label="閉じる">
            <IcClose size={22} />
          </button>
        </div>
        <div className="px-6 pt-6 safe-modal-bottom">{children}</div>
      </div>
    </div>
  );
}
