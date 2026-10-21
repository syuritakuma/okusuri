import { useEffect, useRef, useState } from "react";
import { dayKey } from "./lib/date.js";

/* 今日の日付（"2026-10-21" の形）を返します。
   ホーム画面のアプリは開いたまま日をまたぐことが多いため、
   画面に戻ってきたときと1分ごとに日付を確かめ直し、変わっていれば画面を描き直します。 */
export function useToday() {
  const [today, setToday] = useState(() => dayKey(new Date()));
  useEffect(() => {
    const check = () => setToday(dayKey(new Date()));
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    const timer = setInterval(check, 60 * 1000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
      clearInterval(timer);
    };
  }, []);
  return today;
}

const TYPING_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const NOT_TYPING_INPUTS = new Set(["file", "checkbox", "radio", "button", "submit"]);

const isTypingTarget = (el) =>
  !!el && TYPING_TAGS.has(el.tagName) && !(el.tagName === "INPUT" && NOT_TYPING_INPUTS.has(el.type));

/* 入力欄に文字を打っている最中かどうかを返します。
   iPhoneではキーボードが出ると下のタブが入力欄に重なるため、その間はタブを隠すのに使います。 */
export function useTyping() {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    let timer = null;
    const onFocusIn = (e) => {
      clearTimeout(timer);
      if (isTypingTarget(e.target)) setTyping(true);
    };
    // 入力欄から入力欄へ移るときに一瞬タブが出ないよう、少し待ってから確かめます
    const onFocusOut = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setTyping(isTypingTarget(document.activeElement)), 200);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);
  return typing;
}

// 画面の上に少しの間だけ出るお知らせ（トースト）の中身と、出すための関数を返します
export function useToast(duration = 2800) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);
  const notify = (text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), duration);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return [message, notify];
}
