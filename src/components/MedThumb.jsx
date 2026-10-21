import { IcPill } from "../icons.jsx";

/* お薬の写真。写真がないときは錠剤のアイコンを出します */
export default function MedThumb({ med, small }) {
  const box = small ? "w-14 h-14" : "w-16 h-16";
  return med.image ? (
    <img src={med.image} alt={med.name} className={box + " object-cover rounded-2xl border border-gray-200 shadow-sm flex-shrink-0"} />
  ) : (
    <div className={box + " bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0"}>
      <IcPill size={22} />
    </div>
  );
}
