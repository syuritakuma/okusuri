/* お薬管理アプリの本体です。
   データ（お薬と服用記録）をここで持ち、各タブの画面と、下から出てくるシートに渡します。
   データを書き換える処理そのものは lib/records.js にあります。 */
import { useEffect, useMemo, useState } from "react";
import BottomNav, { TABS } from "./components/BottomNav.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import LogForm from "./components/LogForm.jsx";
import MedicineForm from "./components/MedicineForm.jsx";
import Modal from "./components/Modal.jsx";
import RefillSheet from "./components/RefillSheet.jsx";
import SettingsSheet from "./components/SettingsSheet.jsx";
import Toast from "./components/Toast.jsx";
import { useToast, useToday, useTyping } from "./hooks.js";
import { IcGear, IcTrash } from "./icons.jsx";
import { formatLongDate } from "./lib/date.js";
import { isLowStock } from "./lib/medicine.js";
import * as records from "./lib/records.js";
import { computeStats, computeTodayTasks } from "./lib/schedule.js";
import { backupFile, loadData, parseBackup, saveLogs, saveMedicines } from "./lib/storage.js";
import MedsScreen from "./screens/MedsScreen.jsx";
import StatsScreen from "./screens/StatsScreen.jsx";
import TodayScreen from "./screens/TodayScreen.jsx";
import { BTN_DANGER_OUTLINE, CARD } from "./ui.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [toast, notify] = useToast();
  const typing = useTyping();
  const today = useToday();

  const [data, setData] = useState(loadData);
  const { medicines, logs } = data;

  useEffect(() => {
    if (!saveMedicines(medicines)) {
      notify("保存できませんでした。画像の枚数を減らすか、不要なお薬を削除してください。");
    }
  }, [medicines]);
  useEffect(() => {
    if (!saveLogs(logs)) notify("記録を保存できませんでした。端末の空き容量を確認してください。");
  }, [logs]);

  // 開いているシートや確認画面です（どれも開いていなければ null）
  const [editingMed, setEditingMed] = useState(null);
  const [refillMed, setRefillMed] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [addingLog, setAddingLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [statsRange, setStatsRange] = useState(7);

  /* records.js の処理結果を画面に反映します。
     うまくいけば message を表示して true を、だめなら理由を表示して false を返します。 */
  const apply = (result, message) => {
    if (result.error) {
      notify(result.error);
      return false;
    }
    setData(result.data);
    if (message) notify(message);
    return true;
  };

  const goTab = (key) => {
    setActiveTab(key);
    window.scrollTo(0, 0);
  };

  /* ---------- 服用の記録 ---------- */
  const takeMedicine = (med, timingKey, timingLabel) =>
    apply(
      records.recordDose(data, {
        medId: med.id,
        amount: med.dose,
        timingKey,
        timingLabel,
        timestamp: new Date().toISOString(),
      }),
      `${med.name}（${timingLabel}）を記録しました。`,
    );

  const addLogManually = (entry) => {
    if (apply(records.recordDose(data, { ...entry, manual: true }), "服用の記録を追加しました。")) setAddingLog(false);
  };

  const updateLog = (logId, changes) => {
    if (apply(records.updateLog(data, logId, changes), "記録を修正しました。")) setEditingLog(null);
  };

  const deleteLog = (logId) => {
    apply(records.deleteLog(data, logId), "記録を取り消して、在庫を元に戻しました。");
    setEditingLog(null);
  };

  /* ---------- お薬の登録・編集・削除・補充・並び替え ---------- */
  const addMedicine = (fields) => {
    apply(records.addMedicine(data, fields), "新しいお薬を登録しました。");
    setFormKey((k) => k + 1);
    goTab("meds");
  };

  const updateMedicine = (id, fields) => {
    apply(records.updateMedicine(data, id, fields), "お薬の情報を更新しました。");
    setEditingMed(null);
  };

  const deleteMedicine = (med) =>
    setConfirmState({
      title: "このお薬を削除しますか？",
      message: `「${med.name}」を一覧から削除します。これまでの服用履歴はそのまま残ります。`,
      okLabel: "削除する",
      onOk: () => {
        // 確認しているあいだに他の操作でデータが変わっていても大丈夫なよう、最新のデータに対して行います
        setData((d) => records.deleteMedicine(d, med.id).data);
        setEditingMed(null);
        notify("お薬を削除しました。");
      },
    });

  const moveMedicine = (index, dir) => apply(records.moveMedicine(data, index, dir));

  const applyRefill = (amount) => {
    const med = refillMed;
    if (apply(records.refill(data, med.id, amount), `${med.name}の在庫を${amount}${med.unit}増やしました。`)) {
      setRefillMed(null);
    }
  };

  /* ---------- 集計 ---------- */
  // today を含めることで、日付が変わったときに「今日」の内容が作り直されます
  const todayTasks = useMemo(() => computeTodayTasks(medicines, logs, new Date()), [medicines, logs, today]);
  const stats = useMemo(() => computeStats(medicines, logs, statsRange, new Date()), [medicines, logs, statsRange, today]);
  const lowStockMeds = medicines.filter(isLowStock);

  /* ---------- バックアップ ---------- */
  const exportBackup = async () => {
    const { text, fileName } = backupFile(data);
    // iPhoneではダウンロードより共有シートのほうが確実に保存できます
    try {
      const file = new File([text], fileName, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "お薬管理のバックアップ" });
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("バックアップファイルを書き出しました。");
  };

  const importBackup = async (file) => {
    const restored = parseBackup(await file.text().catch(() => ""));
    if (!restored) {
      notify("ファイルを読み込めませんでした。正しいバックアップを選んでください。");
      return;
    }
    setConfirmState({
      title: "バックアップを読み込みますか？",
      message: `今のデータは上書きされます。お薬${restored.medicines.length}件、履歴${restored.logs.length}件を復元します。`,
      okLabel: "読み込む",
      onOk: () => {
        setData(restored);
        setShowSettings(false);
        notify("バックアップから復元しました。");
      },
    });
  };

  const resetAll = () =>
    setConfirmState({
      title: "すべてのデータを消しますか？",
      message: "登録したお薬と服用履歴がすべて消えます。この操作は元に戻せません。",
      okLabel: "すべて消す",
      onOk: () => {
        setData({ medicines: [], logs: [] });
        setShowSettings(false);
        notify("データをすべて削除しました。");
      },
    });

  const openAddLog = () => {
    if (medicines.length === 0) {
      notify("先にお薬を登録してください。");
      return;
    }
    setAddingLog(true);
  };

  const title = TABS.find((t) => t.key === activeTab).title;

  return (
    <div className="w-full app-min-h bg-gray-50 relative font-sans text-gray-800 flex flex-col">
      <Toast message={toast} />

      <header className="bg-white/95 backdrop-blur-md px-5 pb-4 shadow-sm sticky top-0 z-30 flex items-end justify-between safe-top">
        <div>
          <p className="text-xs font-bold text-gray-400 mb-0.5">{formatLongDate(new Date())}</p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 active:text-gray-700 rounded-full" aria-label="設定">
          <IcGear size={22} />
        </button>
      </header>

      <main className="p-5 flex-1 main-pad">
        {activeTab === "today" && <TodayScreen tasks={todayTasks} lowStockMeds={lowStockMeds} onTake={takeMedicine} />}
        {activeTab === "meds" && (
          <MedsScreen
            medicines={medicines}
            onRefill={setRefillMed}
            onEdit={setEditingMed}
            onDelete={deleteMedicine}
            onMove={moveMedicine}
            onGoAdd={() => goTab("add")}
          />
        )}
        {activeTab === "stats" && (
          <StatsScreen
            stats={stats}
            range={statsRange}
            onRangeChange={setStatsRange}
            logs={logs}
            onAddLog={openAddLog}
            onEditLog={setEditingLog}
          />
        )}
        {activeTab === "add" && (
          <div className={CARD + " p-6"}>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed font-medium">
              新しいお薬の情報を入力し、毎日飲むのか週に1回使うのかを選んでください。
            </p>
            <MedicineForm key={formKey} submitLabel="この内容で登録する" onSubmit={addMedicine} notify={notify} />
          </div>
        )}
      </main>

      {!typing && <BottomNav active={activeTab} onChange={goTab} />}

      {editingMed && (
        <Modal title="お薬の内容を編集" onClose={() => setEditingMed(null)}>
          <MedicineForm
            key={"edit-" + editingMed.id}
            initial={editingMed}
            submitLabel="変更を保存する"
            onSubmit={(fields) => updateMedicine(editingMed.id, fields)}
            onCancel={() => setEditingMed(null)}
            notify={notify}
          />
          <button onClick={() => deleteMedicine(editingMed)} className={BTN_DANGER_OUTLINE}>
            <IcTrash size={17} /> このお薬を削除する
          </button>
        </Modal>
      )}

      {addingLog && (
        <Modal title="服用の記録を追加" onClose={() => setAddingLog(false)}>
          <p className="text-sm text-gray-600 font-medium mb-5 leading-relaxed">
            飲んだのに記録し忘れた分を、日時をさかのぼって追加できます。
          </p>
          <LogForm
            medicines={medicines}
            submitLabel="この内容で記録する"
            onSubmit={addLogManually}
            onCancel={() => setAddingLog(false)}
            notify={notify}
          />
        </Modal>
      )}

      {editingLog && (
        <Modal title="記録を修正する" onClose={() => setEditingLog(null)}>
          {medicines.some((m) => m.id === editingLog.medId) ? (
            <LogForm
              key={"log-" + editingLog.id}
              medicines={medicines}
              initial={editingLog}
              submitLabel="変更を保存する"
              onSubmit={(changes) => updateLog(editingLog.id, changes)}
              onCancel={() => setEditingLog(null)}
              notify={notify}
            />
          ) : (
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              この記録のお薬はすでに削除されているため、内容の修正はできません。記録を取り消すことだけができます。
            </p>
          )}
          <button onClick={() => deleteLog(editingLog.id)} className={BTN_DANGER_OUTLINE}>
            <IcTrash size={17} /> この記録を取り消す
          </button>
        </Modal>
      )}

      {refillMed && <RefillSheet med={refillMed} onApply={applyRefill} onClose={() => setRefillMed(null)} />}

      {showSettings && (
        <SettingsSheet
          medCount={medicines.length}
          logCount={logs.length}
          onExport={exportBackup}
          onImportFile={importBackup}
          onReset={resetAll}
          onClose={() => setShowSettings(false)}
        />
      )}

      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          message={confirmState.message}
          okLabel={confirmState.okLabel}
          onOk={() => {
            confirmState.onOk();
            setConfirmState(null);
          }}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </div>
  );
}
