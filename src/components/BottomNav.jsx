import { IcChart, IcHome, IcPill, IcPlus } from "../icons.jsx";

export const TABS = [
  { key: "today", label: "今日", title: "今日の服用", Icon: IcHome },
  { key: "meds", label: "お薬", title: "お薬と在庫", Icon: IcPill },
  { key: "stats", label: "記録", title: "服用の記録", Icon: IcChart },
  { key: "add", label: "登録", title: "新しいお薬の登録", Icon: IcPlus },
];

/* 画面の下のタブです */
export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around pt-3 px-2 shadow-lg z-40 safe-bottom">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-current={active === key ? "page" : undefined}
          className={"flex flex-col items-center px-4 py-1.5 rounded-2xl " + (active === key ? "text-blue-600" : "text-gray-400")}
        >
          <Icon size={23} />
          <span className="text-[10px] mt-1 font-bold">{label}</span>
        </button>
      ))}
    </nav>
  );
}
