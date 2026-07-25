/* お薬管理アプリ — src/app.jsx から自動生成されたファイルです。直接編集しないでください。 */
/* =========================================================================
   お薬管理アプリ
   ------------------------------------------------------------------------
   このファイルはJSXで書かれた「もとの原稿」です。
   実際にiPhoneで動くのは、これを変換した app.js のほうです。
   内容を直したあとは、変換をやり直して app.js を作り直してください。
   ========================================================================= */
const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;

/* ============================================================
   アイコン（外部ライブラリに頼らず自前のSVGで用意しています）
   ============================================================ */
const Svg = ({
  children,
  size = 24,
  className = "",
  sw = 2
}) => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: className
}, children);
const IcPill = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m8.5 8.5 7 7"
}));
const IcHome = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M9 22V12h6v10"
}));
const IcChart = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 3v18h18"
}), /*#__PURE__*/React.createElement("rect", {
  x: "7",
  y: "12",
  width: "3",
  height: "6",
  rx: "1"
}), /*#__PURE__*/React.createElement("rect", {
  x: "12.5",
  y: "8",
  width: "3",
  height: "10",
  rx: "1"
}), /*#__PURE__*/React.createElement("rect", {
  x: "18",
  y: "5",
  width: "3",
  height: "13",
  rx: "1"
}));
const IcPlus = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M8 12h8M12 8v8"
}));
const IcCheck = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("path", {
  d: "m9 12 2 2 4-4"
}));
const IcAlert = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 8v4M12 16h.01"
}));
const IcImage = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "3",
  width: "18",
  height: "18",
  rx: "2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "9",
  cy: "9",
  r: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "m21 15-4.5-4.5L3 21"
}));
const IcTrash = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10 11v6M14 11v6"
}));
const IcSunrise = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 2v6M4.9 10.9l1.4 1.4M2 18h2M20 18h2M17.7 12.3l1.4-1.4M22 22H2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M8 18a4 4 0 0 1 8 0"
}));
const IcSun = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
}));
const IcMoon = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
}));
const IcCalendar = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "4",
  width: "18",
  height: "18",
  rx: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 2v4M8 2v4M3 10h18"
}));
const IcInfo = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 16v-4M12 8h.01"
}));
const IcEdit = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
}), /*#__PURE__*/React.createElement("path", {
  d: "M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"
}));
const IcRefill = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 7v10M7 12h10"
}));
const IcGear = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "3"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
}));
const IcUpload = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M17 8l-5-5-5 5M12 3v12"
}));
const IcClose = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M18 6 6 18M6 6l12 12"
}));
const IcClip = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
  x: "8",
  y: "2",
  width: "8",
  height: "4",
  rx: "1"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
}));
const IcFire = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C9 9 9 6 12 2Z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 22a6 6 0 0 0 6-6c0-2-1-3.5-2-5-.5 2-2 3-3 3.5.5-2-1-4.5-1-4.5S8 13 8 16a4 4 0 0 0 4 6Z"
}));
const IcUp = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "m18 15-6-6-6 6"
}));
const IcDown = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "m6 9 6 6 6-6"
}));
const IcSort = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 6h13M3 12h9M3 18h5"
}), /*#__PURE__*/React.createElement("path", {
  d: "m17 14 3 3 3-3M20 17V7"
}));
const IcShare = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 16V3"
}), /*#__PURE__*/React.createElement("path", {
  d: "m8 7 4-4 4 4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
}));

/* ============================================================
   共通の定数と小さな道具
   ============================================================ */
const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"];
const TIMING_DEFS = [{
  key: "morning",
  label: "朝",
  Icon: IcSunrise
}, {
  key: "noon",
  label: "昼",
  Icon: IcSun
}, {
  key: "evening",
  label: "夜",
  Icon: IcMoon
}];
const TIMING_STYLE = {
  morning: {
    on: "bg-blue-600 active:bg-blue-700",
    soft: "border-blue-500 bg-blue-50 text-blue-700"
  },
  noon: {
    on: "bg-orange-500 active:bg-orange-600",
    soft: "border-orange-500 bg-orange-50 text-orange-700"
  },
  evening: {
    on: "bg-indigo-600 active:bg-indigo-700",
    soft: "border-indigo-500 bg-indigo-50 text-indigo-700"
  },
  weekly: {
    on: "bg-purple-600 active:bg-purple-700",
    soft: "border-purple-500 bg-purple-50 text-purple-700"
  }
};
const startOfDay = d => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const dayKey = d => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
const sameDay = (a, b) => dayKey(a) === dayKey(b);
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// 指定した曜日について「直近に訪れた（今日を含む）その曜日の午前0時」を返します
const lastOccurrenceOfWeekday = (weekdayStr, base = new Date()) => {
  const target = WEEK_DAYS.indexOf(weekdayStr);
  const d = startOfDay(base);
  const diff = (d.getDay() - target + 7) % 7;
  return addDays(d, -diff);
};

// <input type="datetime-local"> に渡せる文字列に変換します
const toLocalInput = d => {
  const x = new Date(d);
  const p = n => String(n).padStart(2, "0");
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}T${p(x.getHours())}:${p(x.getMinutes())}`;
};
const formatDateTime = d => {
  const x = new Date(d);
  return `${x.getFullYear()}/${x.getMonth() + 1}/${x.getDate()}（${WEEK_DAYS[x.getDay()]}） ` + `${String(x.getHours()).padStart(2, "0")}:${String(x.getMinutes()).padStart(2, "0")}`;
};
const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};
const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
};
const dailyTimingCount = med => TIMING_DEFS.filter(t => med.timings && med.timings[t.key]).length;

// 在庫があと何日もつかの目安を計算します
const estimateDaysLeft = med => {
  if (med.type === "weekly") return Math.floor(med.stock / med.dose) * 7;
  const perDay = dailyTimingCount(med) * med.dose;
  if (perDay <= 0) return null;
  return Math.floor(med.stock / perDay);
};

// その薬で選べるタイミングの一覧を返します
const timingOptionsFor = med => {
  if (!med) return TIMING_DEFS.map(t => ({
    key: t.key,
    label: t.label
  }));
  if (med.type === "weekly") return [{
    key: "weekly",
    label: `毎週${med.weeklyDay}曜`
  }];
  return TIMING_DEFS.map(t => ({
    key: t.key,
    label: t.label
  }));
};
const DEFAULT_MEDS = [{
  id: 1,
  name: "ロキソプロフェン錠",
  stock: 12,
  dose: 1,
  unit: "錠",
  image: null,
  type: "daily",
  createdAt: new Date(2026, 0, 1).toISOString(),
  efficacy: "頭痛や関節痛などの痛みや、発熱を抑えるお薬です。なるべく空腹時を避けて服用してください。",
  timings: {
    morning: true,
    noon: true,
    evening: true
  }
}, {
  id: 2,
  name: "マンジャロ皮下注",
  stock: 4,
  dose: 1,
  unit: "本",
  image: null,
  type: "weekly",
  createdAt: new Date(2026, 0, 1).toISOString(),
  efficacy: "血糖値を下げるお薬です。週に1回、同じ曜日に注射します。",
  weeklyDay: "日"
}];
const INPUT_CLS = "w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-base";

/* ============================================================
   お薬の入力フォーム（新規登録と編集の両方で使います）
   ============================================================ */
function MedicineForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  onFocusInput,
  onBlurInput,
  notify
}) {
  const [name, setName] = useState(initial ? initial.name : "");
  const [efficacy, setEfficacy] = useState(initial && initial.efficacy ? initial.efficacy : "");
  const [stock, setStock] = useState(initial ? String(initial.stock) : "");
  const [dose, setDose] = useState(initial ? String(initial.dose) : "1");
  const [unit, setUnit] = useState(initial ? initial.unit : "錠");
  const [image, setImage] = useState(initial ? initial.image : null);
  const [type, setType] = useState(initial ? initial.type : "daily");
  const [timings, setTimings] = useState(initial && initial.timings ? {
    ...initial.timings
  } : {
    morning: false,
    noon: false,
    evening: false
  });
  const [weeklyDay, setWeeklyDay] = useState(initial && initial.weeklyDay ? initial.weeklyDay : WEEK_DAYS[new Date().getDay()]);
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      notify("画像が大きすぎます。8MB以下の画像を選んでください。");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      // 写真はそのままだと容量を使いすぎるため、長辺600pxに縮めて保存します
      const img = new Image();
      img.onload = () => {
        const max = 600;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round(img.width * scale));
        cv.height = Math.max(1, Math.round(img.height * scale));
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        try {
          setImage(cv.toDataURL("image/jpeg", 0.8));
        } catch (err) {
          setImage(reader.result);
        }
      };
      img.onerror = () => setImage(reader.result);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
  const submit = e => {
    e.preventDefault();
    const stockNum = parseInt(stock, 10);
    const doseNum = parseInt(dose, 10);
    if (!name.trim()) {
      notify("お薬の名前を入力してください。");
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      notify("在庫数は0以上の数字で入力してください。");
      return;
    }
    if (isNaN(doseNum) || doseNum < 1) {
      notify("1回の使用量は1以上の数字で入力してください。");
      return;
    }
    if (type === "daily" && !timings.morning && !timings.noon && !timings.evening) {
      notify("服用するタイミングを1つ以上選んでください。");
      return;
    }
    onSubmit({
      name: name.trim(),
      efficacy: efficacy.trim(),
      stock: stockNum,
      dose: doseNum,
      unit,
      image,
      type,
      ...(type === "daily" ? {
        timings
      } : {
        weeklyDay
      })
    });
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "お薬の画像（任意）"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "プレビュー",
    className: "w-20 h-20 object-cover rounded-2xl border border-gray-200 shadow-sm"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400"
  }, /*#__PURE__*/React.createElement(IcImage, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block cursor-pointer bg-white border border-gray-200 active:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-2xl text-center shadow-sm text-sm"
  }, "写真を撮る・選ぶ", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: handleImageChange,
    className: "hidden"
  })), image && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setImage(null),
    className: "w-full text-xs font-bold text-gray-400 active:text-red-500 py-1"
  }, "画像を外す")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "お薬の名前"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: name,
    onChange: e => setName(e.target.value),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    placeholder: "例：マンジャロ皮下注",
    className: INPUT_CLS,
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "効能・メモ（任意）"), /*#__PURE__*/React.createElement("textarea", {
    value: efficacy,
    onChange: e => setEfficacy(e.target.value),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    placeholder: "例：血糖値を下げるお薬です。朝食後に服用します。",
    className: INPUT_CLS + " resize-none",
    rows: "2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "服用スタイル"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setType("daily"),
    className: "py-3.5 rounded-2xl border-2 font-bold text-sm " + (type === "daily" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500")
  }, "毎日飲む薬"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setType("weekly"),
    className: "py-3.5 rounded-2xl border-2 font-bold text-sm " + (type === "weekly" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 bg-white text-gray-500")
  }, "週1回のお薬"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "今ある在庫数"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "numeric",
    value: stock,
    onChange: e => setStock(e.target.value),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    placeholder: "例：28",
    className: INPUT_CLS + " pr-24",
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute right-2 top-3"
  }, /*#__PURE__*/React.createElement("select", {
    value: unit,
    onChange: e => setUnit(e.target.value),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    className: "bg-transparent border-none text-gray-600 font-medium text-base focus:outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: "錠"
  }, "錠"), /*#__PURE__*/React.createElement("option", {
    value: "本"
  }, "本"), /*#__PURE__*/React.createElement("option", {
    value: "包"
  }, "包"), /*#__PURE__*/React.createElement("option", {
    value: "カプセル"
  }, "カプセル"), /*#__PURE__*/React.createElement("option", {
    value: "mL"
  }, "mL"), /*#__PURE__*/React.createElement("option", {
    value: "回"
  }, "回"))))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "1回の使用量"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "numeric",
    value: dose,
    onChange: e => setDose(e.target.value),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    min: "1",
    className: INPUT_CLS + " pr-16",
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute right-4 top-3.5 text-gray-400 font-medium text-sm"
  }, unit))))), type === "daily" ? /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-gray-100"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-3"
  }, "いつ飲みますか？（複数選べます）"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, TIMING_DEFS.map(({
    key,
    label,
    Icon
  }) => /*#__PURE__*/React.createElement("label", {
    key: key,
    className: "flex-1 flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 " + (timings[key] ? TIMING_STYLE[key].soft : "border-gray-200 bg-white text-gray-400")
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    className: "hidden",
    checked: !!timings[key],
    onChange: () => setTimings(p => ({
      ...p,
      [key]: !p[key]
    }))
  }), /*#__PURE__*/React.createElement(Icon, {
    size: 24,
    className: "mb-1.5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-bold"
  }, label))))) : /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-gray-100"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-3"
  }, "何曜日に使いますか？"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-7 gap-1.5"
  }, WEEK_DAYS.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    type: "button",
    onClick: () => setWeeklyDay(d),
    className: "py-3 rounded-xl border font-bold text-sm " + (weeklyDay === d ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-white text-gray-500 border-gray-200")
  }, d)))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex gap-3"
  }, onCancel && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCancel,
    className: "flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl active:bg-gray-100"
  }, "やめる"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "flex-[2] bg-gray-900 active:bg-gray-700 text-white font-bold py-4 rounded-2xl shadow-lg"
  }, submitLabel)));
}

/* ============================================================
   下から出てくるモーダル
   ============================================================ */
function Modal({
  title,
  onClose,
  children
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end justify-center bg-black/40",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md bg-gray-50 rounded-t-3xl max-h-[92dvh] overflow-y-auto shadow-2xl modal-sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 bg-gray-50/95 backdrop-blur px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-100 z-10"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-gray-900"
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "p-2 -mr-2 text-gray-400 active:text-gray-700 rounded-full",
    "aria-label": "閉じる"
  }, /*#__PURE__*/React.createElement(IcClose, {
    size: 22
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-6 pt-6 safe-modal-bottom"
  }, children)));
}

/* ============================================================
   服用記録の入力（あとから追加・記録の修正で共用します）
   ============================================================ */
function LogForm({
  medicines,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  onFocusInput,
  onBlurInput,
  notify
}) {
  const firstMed = medicines[0];
  const [medId, setMedId] = useState(initial ? initial.medId : firstMed ? firstMed.id : null);
  const med = medicines.find(m => m.id === medId);
  const options = timingOptionsFor(med);
  const [timingKey, setTimingKey] = useState(initial && options.some(o => o.key === initial.timingKey) ? initial.timingKey : options[0] ? options[0].key : "morning");
  const [when, setWhen] = useState(toLocalInput(initial ? initial.timestamp : new Date()));
  const [amount, setAmount] = useState(String(initial ? initial.amount : med ? med.dose : 1));

  // 薬を変えたときは、その薬で選べるタイミングと使用量に合わせ直します
  const changeMed = id => {
    const next = medicines.find(m => m.id === id);
    setMedId(id);
    const opts = timingOptionsFor(next);
    if (!opts.some(o => o.key === timingKey)) setTimingKey(opts[0].key);
    if (next) setAmount(String(next.dose));
  };
  const submit = e => {
    e.preventDefault();
    const amountNum = parseInt(amount, 10);
    const target = medicines.find(m => m.id === medId);
    if (!target) {
      notify("お薬を選んでください。");
      return;
    }
    if (isNaN(amountNum) || amountNum < 1) {
      notify("使用量は1以上の数字で入力してください。");
      return;
    }
    const ts = new Date(when);
    if (isNaN(ts.getTime())) {
      notify("日時を正しく入力してください。");
      return;
    }
    if (ts.getTime() > Date.now() + 60 * 1000) {
      notify("未来の日時は記録できません。");
      return;
    }
    const opt = timingOptionsFor(target).find(o => o.key === timingKey) || {
      key: timingKey,
      label: timingKey
    };
    onSubmit({
      medId: target.id,
      medName: target.name,
      unit: target.unit,
      amount: amountNum,
      timingKey: opt.key,
      timingLabel: opt.label,
      timestamp: ts.toISOString()
    });
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "お薬"), /*#__PURE__*/React.createElement("select", {
    value: medId === null ? "" : String(medId),
    onChange: e => changeMed(Number(e.target.value)),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    className: INPUT_CLS
  }, medicines.map(m => /*#__PURE__*/React.createElement("option", {
    key: m.id,
    value: String(m.id)
  }, m.name)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "タイミング"), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2 " + (options.length === 1 ? "grid-cols-1" : "grid-cols-3")
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.key,
    type: "button",
    onClick: () => setTimingKey(o.key),
    className: "py-3 rounded-2xl border-2 font-bold text-sm " + (timingKey === o.key ? (TIMING_STYLE[o.key] || TIMING_STYLE.weekly).soft : "border-gray-200 bg-white text-gray-500")
  }, o.label)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "飲んだ日時"), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    value: when,
    onChange: e => setWhen(e.target.value),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    className: INPUT_CLS
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setWhen(toLocalInput(new Date())),
    className: "flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-xs"
  }, "今にする"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setWhen(toLocalInput(addDays(new Date(when), -1))),
    className: "flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-xs"
  }, "1日前へ"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setWhen(toLocalInput(addDays(new Date(when), 1))),
    className: "flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-xs"
  }, "1日後へ"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold text-gray-700 mb-2"
  }, "使用量"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "numeric",
    min: "1",
    value: amount,
    onChange: e => setAmount(e.target.value),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    className: INPUT_CLS + " pr-16"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute right-4 top-3.5 text-gray-400 font-medium text-sm"
  }, med ? med.unit : "")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-400 font-medium mt-2 leading-relaxed"
  }, "記録を保存すると、その分だけ在庫が自動で減ります。使用量を直した場合は、差の分だけ在庫が調整されます。")), /*#__PURE__*/React.createElement("div", {
    className: "pt-1 flex gap-3"
  }, onCancel && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCancel,
    className: "flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl active:bg-gray-100"
  }, "やめる"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "flex-[2] bg-gray-900 active:bg-gray-700 text-white font-bold py-4 rounded-2xl shadow-lg"
  }, submitLabel)));
}

/* ============================================================
   本体
   ============================================================ */
function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [toast, setToast] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const toastTimer = useRef(null);
  const notify = message => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };
  const onFocusInput = () => setIsInputFocused(true);
  const onBlurInput = () => setTimeout(() => setIsInputFocused(false), 200);
  const [medicines, setMedicines] = useState(() => {
    const saved = loadJSON("med_app_medicines_v2", null);
    return Array.isArray(saved) ? saved : DEFAULT_MEDS;
  });
  const [logs, setLogs] = useState(() => {
    const saved = loadJSON("med_app_logs_v2", null);
    return Array.isArray(saved) ? saved : [];
  });
  useEffect(() => {
    if (!saveJSON("med_app_medicines_v2", medicines)) {
      notify("保存できませんでした。画像の枚数を減らすか、不要なお薬を削除してください。");
    }
  }, [medicines]);
  useEffect(() => {
    saveJSON("med_app_logs_v2", logs);
  }, [logs]);
  const [editingMed, setEditingMed] = useState(null);
  const [refillMed, setRefillMed] = useState(null);
  const [refillAmount, setRefillAmount] = useState("");
  const [editingLog, setEditingLog] = useState(null);
  const [addingLog, setAddingLog] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sortMode, setSortMode] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [statsRange, setStatsRange] = useState(7);

  /* ---------- 服用状況の判定 ---------- */
  const isTakenToday = (medId, timingKey) => logs.some(l => l.medId === medId && l.timingKey === timingKey && sameDay(new Date(l.timestamp), new Date()));
  const isTakenThisCycle = med => {
    const since = lastOccurrenceOfWeekday(med.weeklyDay);
    return logs.some(l => l.medId === med.id && new Date(l.timestamp) >= since);
  };
  const sortLogs = list => [...list].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  /* ---------- 服用の記録 ---------- */
  const takeMedicine = (med, timingKey, timingLabel) => {
    if (med.stock < med.dose) {
      notify("在庫が足りません。先に補充してください。");
      return;
    }
    setMedicines(prev => prev.map(m => m.id === med.id ? {
      ...m,
      stock: m.stock - m.dose
    } : m));
    setLogs(prev => [{
      id: Date.now() + Math.random(),
      medId: med.id,
      medName: med.name,
      amount: med.dose,
      unit: med.unit,
      timingKey,
      timingLabel,
      timestamp: new Date().toISOString()
    }, ...prev]);
    notify(`${med.name}（${timingLabel}）を記録しました。`);
  };
  const addLogManually = data => {
    const med = medicines.find(m => m.id === data.medId);
    if (med && med.stock < data.amount) {
      notify("在庫が足りません。先に補充してください。");
      return;
    }
    setMedicines(prev => prev.map(m => m.id === data.medId ? {
      ...m,
      stock: m.stock - data.amount
    } : m));
    setLogs(prev => sortLogs([{
      id: Date.now() + Math.random(),
      manual: true,
      ...data
    }, ...prev]));
    setAddingLog(false);
    notify("服用の記録を追加しました。");
  };
  const updateLog = (logId, data) => {
    const before = logs.find(l => l.id === logId);
    if (!before) return;
    // 在庫は「元の分を戻してから、新しい分を引く」形で調整します
    setMedicines(prev => prev.map(m => {
      let stock = m.stock;
      if (m.id === before.medId) stock += before.amount;
      if (m.id === data.medId) stock -= data.amount;
      return stock === m.stock ? m : {
        ...m,
        stock
      };
    }));
    setLogs(prev => sortLogs(prev.map(l => l.id === logId ? {
      ...l,
      ...data
    } : l)));
    setEditingLog(null);
    notify("記録を修正しました。");
  };
  const deleteLog = logId => {
    const target = logs.find(l => l.id === logId);
    if (!target) return;
    setLogs(prev => prev.filter(l => l.id !== logId));
    setMedicines(prev => prev.map(m => m.id === target.medId ? {
      ...m,
      stock: m.stock + target.amount
    } : m));
    setEditingLog(null);
    notify("記録を取り消して、在庫を元に戻しました。");
  };

  /* ---------- お薬の登録・編集・削除・補充・並び替え ---------- */
  const addMedicine = data => {
    setMedicines(prev => [...prev, {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...data
    }]);
    setFormKey(k => k + 1);
    notify("新しいお薬を登録しました。");
    setActiveTab("meds");
    window.scrollTo(0, 0);
  };
  const updateMedicine = (id, data) => {
    setMedicines(prev => prev.map(m => {
      if (m.id !== id) return m;
      const next = {
        ...m,
        ...data
      };
      if (next.type === "daily") delete next.weeklyDay;else delete next.timings;
      return next;
    }));
    setEditingMed(null);
    notify("お薬の情報を更新しました。");
  };
  const deleteMedicine = med => {
    setConfirmState({
      title: "このお薬を削除しますか？",
      message: `「${med.name}」を一覧から削除します。これまでの服用履歴はそのまま残ります。`,
      okLabel: "削除する",
      onOk: () => {
        setMedicines(prev => prev.filter(m => m.id !== med.id));
        setEditingMed(null);
        notify("お薬を削除しました。");
      }
    });
  };
  const moveMedicine = (index, dir) => {
    const to = index + dir;
    if (to < 0 || to >= medicines.length) return;
    setMedicines(prev => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(to, 0, item);
      return next;
    });
  };
  const applyRefill = () => {
    const n = parseInt(refillAmount, 10);
    if (isNaN(n) || n <= 0) {
      notify("補充する数を正しく入力してください。");
      return;
    }
    setMedicines(prev => prev.map(m => m.id === refillMed.id ? {
      ...m,
      stock: m.stock + n
    } : m));
    notify(`${refillMed.name}の在庫を${n}${refillMed.unit}増やしました。`);
    setRefillMed(null);
    setRefillAmount("");
  };

  /* ---------- 服用率の集計 ---------- */
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const medIds = new Set(medicines.map(m => m.id));
    const takenByDay = {};
    logs.forEach(l => {
      if (!medIds.has(l.medId)) return;
      const k = dayKey(new Date(l.timestamp));
      takenByDay[k] = (takenByDay[k] || 0) + 1;
    });
    const expectedOn = d => {
      let n = 0;
      medicines.forEach(med => {
        const created = startOfDay(med.createdAt ? new Date(med.createdAt) : today);
        if (d < created) return;
        if (med.type === "daily") n += dailyTimingCount(med);else if (WEEK_DAYS[d.getDay()] === med.weeklyDay) n += 1;
      });
      return n;
    };
    const days = [];
    for (let i = statsRange - 1; i >= 0; i--) {
      const d = addDays(today, -i);
      const expected = expectedOn(d);
      const raw = takenByDay[dayKey(d)] || 0;
      const taken = expected > 0 ? Math.min(raw, expected) : raw;
      days.push({
        date: d,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        weekday: WEEK_DAYS[d.getDay()],
        expected,
        taken,
        rate: expected > 0 ? Math.round(taken / expected * 100) : null
      });
    }
    const totalExpected = days.reduce((s, d) => s + d.expected, 0);
    const totalTaken = days.reduce((s, d) => s + (d.expected > 0 ? d.taken : 0), 0);
    const overall = totalExpected > 0 ? Math.round(totalTaken / totalExpected * 100) : null;
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = addDays(today, -i);
      const expected = expectedOn(d);
      if (expected === 0) continue;
      const taken = takenByDay[dayKey(d)] || 0;
      if (taken >= expected) streak++;else if (i === 0) continue;else break;
    }
    return {
      days,
      overall,
      totalExpected,
      totalTaken,
      streak
    };
  }, [medicines, logs, statsRange]);

  /* ---------- 今日のやること ---------- */
  const todayTasks = useMemo(() => {
    const list = [];
    medicines.forEach(med => {
      if (med.type === "daily") {
        TIMING_DEFS.forEach(({
          key,
          label
        }) => {
          if (med.timings && med.timings[key]) {
            list.push({
              med,
              timingKey: key,
              timingLabel: label,
              done: isTakenToday(med.id, key)
            });
          }
        });
      } else {
        const isTargetDay = WEEK_DAYS[new Date().getDay()] === med.weeklyDay;
        const done = isTakenThisCycle(med);
        if (isTargetDay || !done) {
          list.push({
            med,
            timingKey: "weekly",
            timingLabel: `毎週${med.weeklyDay}曜`,
            done,
            overdue: !done && !isTargetDay
          });
        }
      }
    });
    const order = {
      morning: 0,
      noon: 1,
      evening: 2,
      weekly: 3
    };
    return list.sort((a, b) => order[a.timingKey] - order[b.timingKey]);
  }, [medicines, logs]);
  const todayDone = todayTasks.filter(t => t.done).length;
  const todayTotal = todayTasks.length;
  const todayRate = todayTotal > 0 ? Math.round(todayDone / todayTotal * 100) : 0;
  const lowStockMeds = medicines.filter(m => {
    const d = estimateDaysLeft(m);
    return d !== null && d <= 7;
  });

  /* ---------- バックアップ ---------- */
  const exportBackup = async () => {
    const text = JSON.stringify({
      app: "okusuri",
      version: 2,
      exportedAt: new Date().toISOString(),
      medicines,
      logs
    }, null, 2);
    const fileName = `okusuri-backup-${dayKey(new Date())}.json`;
    // iPhoneではダウンロードより共有シートのほうが確実に保存できます
    try {
      const file = new File([text], fileName, {
        type: "application/json"
      });
      if (navigator.canShare && navigator.canShare({
        files: [file]
      })) {
        await navigator.share({
          files: [file],
          title: "お薬管理のバックアップ"
        });
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    const url = URL.createObjectURL(new Blob([text], {
      type: "application/json"
    }));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("バックアップファイルを書き出しました。");
  };
  const importBackup = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data.medicines) || !Array.isArray(data.logs)) throw new Error("形式が違います");
        setConfirmState({
          title: "バックアップを読み込みますか？",
          message: `今のデータは上書きされます。お薬${data.medicines.length}件、履歴${data.logs.length}件を復元します。`,
          okLabel: "読み込む",
          onOk: () => {
            setMedicines(data.medicines);
            setLogs(sortLogs(data.logs));
            setShowSettings(false);
            notify("バックアップから復元しました。");
          }
        });
      } catch (err) {
        notify("ファイルを読み込めませんでした。正しいバックアップを選んでください。");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const resetAll = () => {
    setConfirmState({
      title: "すべてのデータを消しますか？",
      message: "登録したお薬と服用履歴がすべて消えます。この操作は元に戻せません。",
      okLabel: "すべて消す",
      onOk: () => {
        setMedicines([]);
        setLogs([]);
        setShowSettings(false);
        notify("データをすべて削除しました。");
      }
    });
  };

  /* ---------- 画面の部品 ---------- */
  const MedThumb = ({
    med,
    small
  }) => {
    const box = small ? "w-14 h-14" : "w-16 h-16";
    return med.image ? /*#__PURE__*/React.createElement("img", {
      src: med.image,
      alt: med.name,
      className: box + " object-cover rounded-2xl border border-gray-200 shadow-sm flex-shrink-0"
    }) : /*#__PURE__*/React.createElement("div", {
      className: box + " bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0"
    }, /*#__PURE__*/React.createElement(IcPill, {
      size: 22
    }));
  };
  const TABS = [{
    key: "today",
    label: "今日",
    Icon: IcHome
  }, {
    key: "meds",
    label: "お薬",
    Icon: IcPill
  }, {
    key: "stats",
    label: "記録",
    Icon: IcChart
  }, {
    key: "add",
    label: "登録",
    Icon: IcPlus
  }];
  const TITLES = {
    today: "今日の服用",
    meds: "お薬と在庫",
    stats: "服用の記録",
    add: "新しいお薬の登録"
  };
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEK_DAYS[d.getDay()]}）`;
  })();
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full app-min-h bg-gray-50 relative font-sans text-gray-800 flex flex-col"
  }, toast && /*#__PURE__*/React.createElement("div", {
    className: "fixed left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-6 py-3 rounded-2xl shadow-xl z-[80] flex items-center gap-2.5 w-[90%] max-w-sm toast-pos"
  }, /*#__PURE__*/React.createElement(IcCheck, {
    size: 18,
    className: "text-green-400 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium leading-snug"
  }, toast)), /*#__PURE__*/React.createElement("header", {
    className: "bg-white/95 backdrop-blur-md px-5 pb-4 shadow-sm sticky top-0 z-30 flex items-end justify-between safe-top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-gray-400 mb-0.5"
  }, todayStr), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-gray-900 tracking-tight"
  }, TITLES[activeTab])), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSettings(true),
    className: "p-2 text-gray-400 active:text-gray-700 rounded-full",
    "aria-label": "設定"
  }, /*#__PURE__*/React.createElement(IcGear, {
    size: 22
  }))), /*#__PURE__*/React.createElement("main", {
    className: "p-5 flex-1 main-pad"
  }, activeTab === "today" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-gray-400 tracking-wider"
  }, "今日の進み具合"), /*#__PURE__*/React.createElement("p", {
    className: "text-3xl font-extrabold text-gray-900 mt-1"
  }, todayDone, /*#__PURE__*/React.createElement("span", {
    className: "text-base font-bold text-gray-400"
  }, " / ", todayTotal, " 回"))), /*#__PURE__*/React.createElement("p", {
    className: "text-4xl font-extrabold " + (todayRate === 100 ? "text-green-500" : "text-blue-600")
  }, todayRate, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "h-3 bg-gray-100 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all duration-500 " + (todayRate === 100 ? "bg-green-500" : "bg-blue-600"),
    style: {
      width: todayRate + "%"
    }
  })), todayTotal > 0 && todayRate === 100 && /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-green-600 mt-3"
  }, "今日の分はすべて飲み終わりました。")), lowStockMeds.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "bg-red-50 border border-red-100 p-5 rounded-3xl flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(IcAlert, {
    size: 20,
    className: "text-red-500 flex-shrink-0 mt-0.5"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-red-700 mb-1"
  }, "在庫が少なくなっています"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-red-600 leading-relaxed font-medium"
  }, lowStockMeds.map(m => `${m.name}（あと約${estimateDaysLeft(m)}日分）`).join("、"), "。早めに受診や薬局での受け取りをご検討ください。"))), todayTasks.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-14 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200"
  }, /*#__PURE__*/React.createElement(IcCalendar, {
    size: 44,
    className: "mx-auto mb-4 opacity-40"
  }), /*#__PURE__*/React.createElement("p", {
    className: "font-medium"
  }, "今日飲むお薬は登録されていません。")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, todayTasks.map((task, i) => {
    const {
      med,
      timingKey,
      timingLabel,
      done,
      overdue
    } = task;
    const def = TIMING_DEFS.find(t => t.key === timingKey);
    const Icon = def ? def.Icon : IcCalendar;
    const style = TIMING_STYLE[timingKey] || TIMING_STYLE.weekly;
    const notEnough = med.stock < med.dose;
    return /*#__PURE__*/React.createElement("div", {
      key: med.id + "-" + timingKey + "-" + i,
      className: "bg-white p-4 rounded-3xl shadow-sm border flex items-center gap-3.5 " + (done ? "border-green-200 bg-green-50/40" : "border-gray-100")
    }, /*#__PURE__*/React.createElement(MedThumb, {
      med: med,
      small: true
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-600"
    }, timingLabel), overdue && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-600"
    }, "未実施")), /*#__PURE__*/React.createElement("p", {
      className: "font-bold text-gray-900 truncate"
    }, med.name), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500 font-medium mt-0.5"
    }, "1回 ", med.dose, med.unit, " ／ 残り ", med.stock, med.unit)), /*#__PURE__*/React.createElement("button", {
      onClick: () => takeMedicine(med, timingKey, timingLabel),
      disabled: done || notEnough,
      className: "flex-shrink-0 w-[86px] py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-white shadow-md " + (done ? "bg-green-100 text-green-700 shadow-none" : notEnough ? "bg-gray-200 text-gray-400 shadow-none" : style.on)
    }, done ? /*#__PURE__*/React.createElement(IcCheck, {
      size: 20
    }) : /*#__PURE__*/React.createElement(Icon, {
      size: 20
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] font-bold"
    }, done ? "済み" : notEnough ? "在庫なし" : "飲んだ")));
  }))), activeTab === "meds" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, medicines.length > 1 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setSortMode(v => !v),
    className: "w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border " + (sortMode ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-600 border-gray-200")
  }, /*#__PURE__*/React.createElement(IcSort, {
    size: 17
  }), sortMode ? "並び替えを終わる" : "並び順を変える"), medicines.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-14 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200"
  }, /*#__PURE__*/React.createElement(IcAlert, {
    size: 44,
    className: "mx-auto mb-4 opacity-40"
  }), /*#__PURE__*/React.createElement("p", {
    className: "font-medium mb-4"
  }, "まだお薬が登録されていません。"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab("add"),
    className: "text-sm font-bold text-blue-600 underline"
  }, "お薬を登録する")) : sortMode ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 font-medium leading-relaxed px-1"
  }, "上下のボタンで、お薬の表示順を自分の飲む順番に並べ替えられます。"), medicines.map((med, i) => /*#__PURE__*/React.createElement("div", {
    key: med.id,
    className: "bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-7 h-7 rounded-full bg-gray-100 text-gray-500 font-bold text-xs flex items-center justify-center flex-shrink-0"
  }, i + 1), /*#__PURE__*/React.createElement("p", {
    className: "flex-1 font-bold text-gray-900 truncate"
  }, med.name), /*#__PURE__*/React.createElement("button", {
    onClick: () => moveMedicine(i, -1),
    disabled: i === 0,
    "aria-label": "上へ移動",
    className: "w-12 h-12 rounded-xl border flex items-center justify-center " + (i === 0 ? "border-gray-100 text-gray-200" : "border-gray-200 text-gray-600 active:bg-gray-100")
  }, /*#__PURE__*/React.createElement(IcUp, {
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => moveMedicine(i, 1),
    disabled: i === medicines.length - 1,
    "aria-label": "下へ移動",
    className: "w-12 h-12 rounded-xl border flex items-center justify-center " + (i === medicines.length - 1 ? "border-gray-100 text-gray-200" : "border-gray-200 text-gray-600 active:bg-gray-100")
  }, /*#__PURE__*/React.createElement(IcDown, {
    size: 20
  }))))) : medicines.map(med => {
    const daysLeft = estimateDaysLeft(med);
    const low = daysLeft !== null && daysLeft <= 7;
    return /*#__PURE__*/React.createElement("div", {
      key: med.id,
      className: "bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-start gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-4 min-w-0"
    }, /*#__PURE__*/React.createElement(MedThumb, {
      med: med
    }), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-block text-[10px] px-2 py-0.5 rounded-full font-bold " + (med.type === "weekly" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")
    }, med.type === "weekly" ? `週1回（${med.weeklyDay}曜）` : `毎日 ${TIMING_DEFS.filter(t => med.timings && med.timings[t.key]).map(t => t.label).join("・")}`), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold text-gray-900 leading-tight mt-1.5 break-words"
    }, med.name), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-gray-500 mt-1 font-medium"
    }, "1回 ", med.dose, med.unit))), /*#__PURE__*/React.createElement("div", {
      className: "text-right flex-shrink-0"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] font-bold text-gray-400 mb-0.5 tracking-wider"
    }, "在庫"), /*#__PURE__*/React.createElement("p", {
      className: "text-3xl font-extrabold leading-none " + (low ? "text-red-500" : "text-gray-900")
    }, med.stock, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-semibold text-gray-500 ml-1"
    }, med.unit)), daysLeft !== null && /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] font-bold mt-1 " + (low ? "text-red-500" : "text-gray-400")
    }, "あと約", daysLeft, "日分"))), med.efficacy && /*#__PURE__*/React.createElement("div", {
      className: "bg-amber-50/60 p-3.5 rounded-2xl flex items-start gap-3"
    }, /*#__PURE__*/React.createElement(IcInfo, {
      size: 18,
      className: "text-amber-600 flex-shrink-0 mt-0.5"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-medium text-gray-700 leading-relaxed break-words"
    }, med.efficacy)), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 pt-3 border-t border-gray-100"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setRefillMed(med);
        setRefillAmount("");
      },
      className: "flex-1 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-1.5 active:bg-gray-700"
    }, /*#__PURE__*/React.createElement(IcRefill, {
      size: 17
    }), " 補充"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditingMed(med),
      className: "flex-1 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center gap-1.5 active:bg-gray-100"
    }, /*#__PURE__*/React.createElement(IcEdit, {
      size: 16
    }), " 編集"), /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteMedicine(med),
      "aria-label": "削除",
      className: "w-14 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-400 active:text-red-500 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement(IcTrash, {
      size: 18
    }))));
  })), activeTab === "stats" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-gray-700"
  }, "服用できた割合"), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-gray-100 rounded-full p-1"
  }, [7, 30].map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => setStatsRange(r),
    className: "px-3.5 py-1.5 rounded-full text-xs font-bold " + (statsRange === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")
  }, r, "日")))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end gap-6 mb-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold text-gray-400 tracking-wider"
  }, "達成率"), /*#__PURE__*/React.createElement("p", {
    className: "text-4xl font-extrabold text-blue-600 leading-none mt-1"
  }, stats.overall === null ? "—" : stats.overall, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "%")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-400 font-medium mt-1"
  }, stats.totalTaken, " / ", stats.totalExpected, " 回")), /*#__PURE__*/React.createElement("div", {
    className: "border-l border-gray-100 pl-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold text-gray-400 tracking-wider"
  }, "連続達成"), /*#__PURE__*/React.createElement("p", {
    className: "text-4xl font-extrabold text-orange-500 leading-none mt-1 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(IcFire, {
    size: 26,
    className: "text-orange-400"
  }), stats.streak, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "日")))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-between h-36 border-b border-gray-100 pb-1 " + (statsRange === 7 ? "gap-2" : "gap-[2px]")
  }, stats.days.map((d, i) => {
    const h = d.rate === null ? 0 : Math.max(d.rate, 4);
    const color = d.rate === null ? "bg-gray-200" : d.rate >= 100 ? "bg-green-500" : d.rate >= 50 ? "bg-blue-500" : "bg-red-400";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex-1 flex flex-col items-center justify-end h-full"
    }, statsRange === 7 && /*#__PURE__*/React.createElement("span", {
      className: "text-[9px] font-bold text-gray-400 mb-1"
    }, d.rate === null ? "—" : d.rate), /*#__PURE__*/React.createElement("div", {
      className: "w-full rounded-t-md transition-all duration-500 " + color,
      style: {
        height: h + "%",
        minHeight: d.rate === null ? "4px" : undefined
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mt-2 " + (statsRange === 7 ? "gap-2" : "gap-[2px]")
  }, stats.days.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex-1 text-center overflow-hidden"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-bold text-gray-400 whitespace-nowrap"
  }, statsRange === 7 ? d.weekday : i % 7 === 0 ? d.label : "")))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-400 font-medium mt-4 leading-relaxed"
  }, "緑は予定どおり全部飲めた日、青は半分以上飲めた日、赤は半分未満だった日です。灰色は服用予定がなかった日を表します。")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (medicines.length === 0) {
        notify("先にお薬を登録してください。");
        return;
      }
      setAddingLog(true);
    },
    className: "w-full py-4 rounded-2xl bg-blue-600 active:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(IcPlus, {
    size: 19
  }), " 飲み忘れ分をあとから記録する"), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-6 pt-5 pb-3 border-b border-gray-100"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-gray-700"
  }, "服用の履歴"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-400 font-medium mt-0.5"
  }, "記録をタップすると、日時や使用量を直せます。")), logs.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-14 text-gray-400"
  }, /*#__PURE__*/React.createElement(IcClip, {
    size: 44,
    className: "mx-auto mb-4 opacity-40"
  }), /*#__PURE__*/React.createElement("p", {
    className: "font-medium"
  }, "まだ服用の記録がありません。")) : /*#__PURE__*/React.createElement("ul", {
    className: "divide-y divide-gray-100"
  }, logs.slice(0, 200).map(log => /*#__PURE__*/React.createElement("li", {
    key: log.id
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditingLog(log),
    className: "w-full p-5 flex items-center gap-4 text-left active:bg-gray-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-50 text-green-600 p-2.5 rounded-full flex-shrink-0"
  }, /*#__PURE__*/React.createElement(IcCheck, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
  }, log.timingLabel), log.manual && /*#__PURE__*/React.createElement("span", {
    className: "bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
  }, "後から追加"), /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-gray-900 truncate"
  }, log.medName)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 font-medium"
  }, formatDateTime(log.timestamp), /*#__PURE__*/React.createElement("span", {
    className: "ml-2"
  }, "（", log.amount, log.unit, "）"))), /*#__PURE__*/React.createElement(IcEdit, {
    size: 18,
    className: "text-gray-300 flex-shrink-0"
  }))))))), activeTab === "add" && /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 mb-6 leading-relaxed font-medium"
  }, "新しいお薬の情報を入力し、毎日飲むのか週に1回使うのかを選んでください。"), /*#__PURE__*/React.createElement(MedicineForm, {
    key: formKey,
    submitLabel: "この内容で登録する",
    onSubmit: addMedicine,
    onFocusInput: onFocusInput,
    onBlurInput: onBlurInput,
    notify: notify
  }))), !isInputFocused && /*#__PURE__*/React.createElement("nav", {
    className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around pt-3 px-2 shadow-lg z-40 safe-bottom"
  }, TABS.map(({
    key,
    label,
    Icon
  }) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => {
      setActiveTab(key);
      setSortMode(false);
      window.scrollTo(0, 0);
    },
    className: "flex flex-col items-center px-4 py-1.5 rounded-2xl " + (activeTab === key ? "text-blue-600" : "text-gray-400")
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 23
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] mt-1 font-bold"
  }, label)))), editingMed && /*#__PURE__*/React.createElement(Modal, {
    title: "お薬の内容を編集",
    onClose: () => setEditingMed(null)
  }, /*#__PURE__*/React.createElement(MedicineForm, {
    key: "edit-" + editingMed.id,
    initial: editingMed,
    submitLabel: "変更を保存する",
    onSubmit: data => updateMedicine(editingMed.id, data),
    onCancel: () => setEditingMed(null),
    onFocusInput: onFocusInput,
    onBlurInput: onBlurInput,
    notify: notify
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteMedicine(editingMed),
    className: "w-full mt-4 py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold text-sm active:bg-red-50 flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(IcTrash, {
    size: 17
  }), " このお薬を削除する")), addingLog && /*#__PURE__*/React.createElement(Modal, {
    title: "服用の記録を追加",
    onClose: () => setAddingLog(false)
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 font-medium mb-5 leading-relaxed"
  }, "飲んだのに記録し忘れた分を、日時をさかのぼって追加できます。"), /*#__PURE__*/React.createElement(LogForm, {
    medicines: medicines,
    submitLabel: "この内容で記録する",
    onSubmit: addLogManually,
    onCancel: () => setAddingLog(false),
    onFocusInput: onFocusInput,
    onBlurInput: onBlurInput,
    notify: notify
  })), editingLog && /*#__PURE__*/React.createElement(Modal, {
    title: "記録を修正する",
    onClose: () => setEditingLog(null)
  }, medicines.some(m => m.id === editingLog.medId) ? /*#__PURE__*/React.createElement(LogForm, {
    key: "log-" + editingLog.id,
    medicines: medicines,
    initial: editingLog,
    submitLabel: "変更を保存する",
    onSubmit: data => updateLog(editingLog.id, data),
    onCancel: () => setEditingLog(null),
    onFocusInput: onFocusInput,
    onBlurInput: onBlurInput,
    notify: notify
  }) : /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 font-medium leading-relaxed"
  }, "この記録のお薬はすでに削除されているため、内容の修正はできません。記録を取り消すことだけができます。"), /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteLog(editingLog.id),
    className: "w-full mt-4 py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold text-sm active:bg-red-50 flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(IcTrash, {
    size: 17
  }), " この記録を取り消す")), refillMed && /*#__PURE__*/React.createElement(Modal, {
    title: "在庫を補充する",
    onClose: () => setRefillMed(null)
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 font-medium mb-5 leading-relaxed"
  }, "「", refillMed.name, "」を薬局などで受け取った数を入力してください。今の在庫（", refillMed.stock, refillMed.unit, "）に足されます。"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mb-4"
  }, [7, 14, 28, 30].map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => setRefillAmount(String(n)),
    className: "py-3 rounded-2xl border-2 font-bold text-sm " + (refillAmount === String(n) ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500")
  }, "+", n))), /*#__PURE__*/React.createElement("div", {
    className: "relative mb-6"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "numeric",
    value: refillAmount,
    min: "1",
    onChange: e => setRefillAmount(e.target.value),
    onFocus: onFocusInput,
    onBlur: onBlurInput,
    placeholder: "補充する数を入力",
    className: "w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg pr-16"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute right-5 top-4 text-gray-400 font-bold"
  }, refillMed.unit)), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setRefillMed(null),
    className: "flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl active:bg-gray-100"
  }, "やめる"), /*#__PURE__*/React.createElement("button", {
    onClick: applyRefill,
    className: "flex-[2] bg-gray-900 active:bg-gray-700 text-white font-bold py-4 rounded-2xl shadow-lg"
  }, "補充する"))), showSettings && /*#__PURE__*/React.createElement(Modal, {
    title: "設定とバックアップ",
    onClose: () => setShowSettings(false)
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 font-medium leading-relaxed mb-6"
  }, "このアプリのデータは、お使いの端末の中だけに保存されています。機種を変えたりSafariの履歴を消したりすると消えてしまうため、ときどきバックアップを書き出しておくと安心です。"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: exportBackup,
    className: "w-full bg-gray-900 active:bg-gray-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(IcShare, {
    size: 19
  }), " バックアップを書き出す"), /*#__PURE__*/React.createElement("label", {
    className: "w-full bg-white border border-gray-200 active:bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
  }, /*#__PURE__*/React.createElement(IcUpload, {
    size: 19
  }), " バックアップを読み込む", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "application/json,.json",
    onChange: importBackup,
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 pt-6 border-t border-gray-200"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-gray-400 mb-3"
  }, "今の登録状況"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-gray-100 rounded-2xl p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold text-gray-400"
  }, "登録中のお薬"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-gray-900 mt-1"
  }, medicines.length, /*#__PURE__*/React.createElement("span", {
    className: "text-xs ml-1 text-gray-400"
  }, "件"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-gray-100 rounded-2xl p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold text-gray-400"
  }, "服用の記録"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-gray-900 mt-1"
  }, logs.length, /*#__PURE__*/React.createElement("span", {
    className: "text-xs ml-1 text-gray-400"
  }, "件"))))), /*#__PURE__*/React.createElement("button", {
    onClick: resetAll,
    className: "w-full mt-8 py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold text-sm active:bg-red-50"
  }, "すべてのデータを削除する"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-400 leading-relaxed mt-8"
  }, "このアプリは服用の記録を助けるための道具です。服用量や飲み方については、必ず医師や薬剤師の指示に従ってください。")), confirmState && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-extrabold text-gray-900 mb-2"
  }, confirmState.title), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 font-medium leading-relaxed mb-7"
  }, confirmState.message), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setConfirmState(null),
    className: "flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-3.5 rounded-2xl active:bg-gray-100"
  }, "やめる"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      confirmState.onOk();
      setConfirmState(null);
    },
    className: "flex-1 bg-red-600 active:bg-red-700 text-white font-bold py-3.5 rounded-2xl shadow-lg"
  }, confirmState.okLabel || "OK")))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));