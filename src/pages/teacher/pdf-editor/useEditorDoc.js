/**
 * useEditorDoc.js — trạng thái tài liệu + lịch sử thao tác (Undo/Redo).
 *
 * Một file = một "bản chụp" (plain object) nên lịch sử chỉ là mảng tham chiếu:
 *   • snapshot  — chụp trạng thái TRƯỚC khi kéo/thao tác liên tục (1 lần/drag);
 *   • commit    — thao tác dứt điểm (thêm/xoá/sửa 1 lần) — vừa ghi lịch sử
 *                 vừa áp dụng;
 *   • live      — cập nhật KHÔNG ghi lịch sử (đang kéo chuột);
 *   • undo/redo — lùi/tiến trong `past`/`future`.
 *
 * `original` là bản gốc sau khi mở file — không bao giờ bị sửa nên "Khôi phục
 * file gốc" luôn trả về đúng tài liệu ban đầu, file trên đĩa không đổi.
 */
import { useCallback, useReducer } from "react";

const HISTORY_LIMIT = 100;

function cloneDoc(doc) {
  if (!doc) return doc;
  if (typeof structuredClone === "function") return structuredClone(doc);
  return JSON.parse(JSON.stringify(doc));
}

const initialState = {
  doc: null,
  original: null,
  past: [],
  future: [],
  dirty: false,
};

function pushPast(past, doc) {
  const next = [...past, doc];
  return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next;
}

function reducer(state, action) {
  switch (action.type) {
    case "load":
      return { doc: action.doc, original: action.doc, past: [], future: [], dirty: false };

    case "snapshot":
      if (!state.doc) return state;
      return { ...state, past: pushPast(state.past, state.doc), future: [], dirty: true };

    case "commit":
      if (!state.doc || action.doc === state.doc) return state;
      return {
        ...state,
        doc: action.doc,
        past: pushPast(state.past, state.doc),
        future: [],
        dirty: true,
      };

    case "live":
      if (!state.doc || action.doc === state.doc) return state;
      return { ...state, doc: action.doc, dirty: true };

    case "undo": {
      if (!state.past.length) return state;
      const past = state.past.slice(0, -1);
      const doc = state.past[state.past.length - 1];
      return {
        ...state,
        past,
        doc,
        future: [state.doc, ...state.future].slice(0, HISTORY_LIMIT),
        dirty: true,
      };
    }

    case "redo": {
      if (!state.future.length) return state;
      const [doc, ...future] = state.future;
      return {
        ...state,
        doc,
        future,
        past: pushPast(state.past, state.doc),
        dirty: true,
      };
    }

    case "reset":
      if (!state.original) return state;
      return { ...state, doc: cloneDoc(state.original), past: [], future: [], dirty: false };

    case "mark-exported":
      return { ...state, dirty: false };

    default:
      return state;
  }
}

export function useEditorDoc() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const load = useCallback((doc) => dispatch({ type: "load", doc }), []);
  const commit = useCallback((doc) => dispatch({ type: "commit", doc }), []);
  const live = useCallback((doc) => dispatch({ type: "live", doc }), []);
  const snapshot = useCallback(() => dispatch({ type: "snapshot" }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const markExported = useCallback(() => dispatch({ type: "mark-exported" }), []);

  return {
    state,
    doc: state.doc,
    dirty: state.dirty,
    load,
    commit,
    live,
    snapshot,
    undo,
    redo,
    reset,
    markExported,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
