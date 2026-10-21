/* 画面の見た目に関する共通の設定です */
import { IcMoon, IcSun, IcSunrise } from "./icons.jsx";

export const TIMING_ICONS = { morning: IcSunrise, noon: IcSun, evening: IcMoon };

export const TIMING_STYLE = {
  morning: { on: "bg-blue-600 active:bg-blue-700", soft: "border-blue-500 bg-blue-50 text-blue-700" },
  noon: { on: "bg-orange-500 active:bg-orange-600", soft: "border-orange-500 bg-orange-50 text-orange-700" },
  evening: { on: "bg-indigo-600 active:bg-indigo-700", soft: "border-indigo-500 bg-indigo-50 text-indigo-700" },
  weekly: { on: "bg-purple-600 active:bg-purple-700", soft: "border-purple-500 bg-purple-50 text-purple-700" },
};

export const INPUT_CLS =
  "w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-base";

export const LABEL_CLS = "block text-sm font-bold text-gray-700 mb-2";

export const BTN_PRIMARY = "flex-[2] bg-gray-900 active:bg-gray-700 text-white font-bold py-4 rounded-2xl shadow-lg";
export const BTN_CANCEL = "flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl active:bg-gray-100";
export const BTN_DANGER_OUTLINE =
  "w-full mt-4 py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold text-sm active:bg-red-50 flex items-center justify-center gap-2";
export const CARD = "bg-white rounded-3xl shadow-sm border border-gray-100";
export const EMPTY_BOX = "text-center py-14 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200";
