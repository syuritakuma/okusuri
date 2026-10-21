import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// index.html の「読み込んでいます…」の表示を、アプリの画面に置き換えます
createRoot(document.getElementById("root")).render(<App />);
