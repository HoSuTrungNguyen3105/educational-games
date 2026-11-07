import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view";
import { minimalSetup } from "codemirror";
import { indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { formatHtmlText, formatJsonText } from "../../../lib/documents/format.js";

// CodeEditor — trình soạn mã nguồn của Teacher Document Studio, dựng trên
// CodeMirror 6 (nhẹ hơn Monaco, hợp bundle PWA): syntax highlighting,
// số dòng, undo/redo tích hợp (Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y), lint
// gutter cho JSON. KHÔNG thực thi mã của giáo viên — đây chỉ là trình
// soạn văn bản có cấu trúc.
//
// Props: value (mã nguồn), onChange(text), language: "html" | "json".
// Ref: format() — định dạng lại toàn bộ mã nguồn hiện tại.
const CodeEditor = forwardRef(function CodeEditor({ value, onChange, language }, ref) {
  const hostRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const lastEmittedRef = useRef(value);

  useImperativeHandle(ref, () => ({
    format() {
      const view = viewRef.current;
      if (!view) return { ok: false };
      const current = view.state.doc.toString();
      const result = language === "json"
        ? formatJsonText(current)
        : { ok: true, text: formatHtmlText(current) };
      if (!result.ok) return result;
      if (result.text !== current) {
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: result.text } });
      }
      return { ok: true };
    },
  }), [language]);

  // Tạo editor khi mount / khi đổi ngôn ngữ (mỗi chế độ soạn một ngôn ngữ).
  useEffect(() => {
    if (!hostRef.current) return undefined;
    // minimalSetup (history undo/redo + highlight + keymap mặc định) thay
    // cho basicSetup để nhẹ bundle PWA — autocomplete/fold/search của
    // basicSetup không cần cho việc soạn tài liệu. Thêm tay: số dòng,
    // highlight dòng hiện tại, Tab thụt lề.
    const extensions = [
      minimalSetup,
      lineNumbers(),
      highlightActiveLineGutter(),
      keymap.of([indentWithTab]),
      language === "json" ? json() : html(),
      EditorView.theme({
        "&": { height: "100%", fontSize: "13px", backgroundColor: "#fffdf7" },
        ".cm-scroller": { overflow: "auto", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
        ".cm-content": { padding: "10px 0" },
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const text = update.state.doc.toString();
          lastEmittedRef.current = text;
          onChangeRef.current?.(text);
        }
      }),
    ];
    if (language === "json") extensions.push(lintGutter(), linter(jsonParseLinter(), { delay: 400 }));
    const view = new EditorView({
      state: EditorState.create({ doc: lastEmittedRef.current || "", extensions }),
      parent: hostRef.current,
    });
    viewRef.current = view;
    return () => { view.destroy(); viewRef.current = null; };
  }, [language]);

  // Đồng bộ khi value đổi từ BÊN NGOÀI (nạp tài liệu, nạp mẫu, chuyển
  // đổi chế độ) — thay đổi do chính editor phát ra đã khớp, bỏ qua.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (value !== lastEmittedRef.current && value !== view.state.doc.toString()) {
      lastEmittedRef.current = value;
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value || "" } });
    }
  }, [value]);

  return <div ref={hostRef} className="docstudio-codeeditor h-full min-h-0 overflow-hidden rounded-xl border border-ink/15" />;
});

export default CodeEditor;
