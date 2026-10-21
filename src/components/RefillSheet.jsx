import { useState } from "react";
import { BTN_CANCEL, BTN_PRIMARY } from "../ui.js";
import Modal from "./Modal.jsx";

// よく使う補充数をワンタップで入れられるようにしています
const PRESETS = [7, 14, 28, 30];

/* 在庫を補充する画面です */
export default function RefillSheet({ med, onApply, onClose }) {
  const [amount, setAmount] = useState("");
  return (
    <Modal title="在庫を補充する" onClose={onClose}>
      <p className="text-sm text-gray-600 font-medium mb-5 leading-relaxed">
        「{med.name}」を薬局などで受け取った数を入力してください。今の在庫（{med.stock}
        {med.unit}）に足されます。
      </p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {PRESETS.map((n) => (
          <button
            key={n}
            onClick={() => setAmount(String(n))}
            className={
              "py-3 rounded-2xl border-2 font-bold text-sm " +
              (amount === String(n) ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500")
            }
          >
            +{n}
          </button>
        ))}
      </div>
      <div className="relative mb-6">
        <input
          type="number"
          inputMode="numeric"
          value={amount}
          min="1"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="補充する数を入力"
          aria-label="補充する数"
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg pr-16"
        />
        <span className="absolute right-5 top-4 text-gray-400 font-bold">{med.unit}</span>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className={BTN_CANCEL}>
          やめる
        </button>
        <button onClick={() => onApply(parseInt(amount, 10))} className={BTN_PRIMARY}>
          補充する
        </button>
      </div>
    </Modal>
  );
}
