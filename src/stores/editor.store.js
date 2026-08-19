import { create } from "zustand";
import { defaultCanvas, defaultElements, createElement } from "../games/elementUtils.js";

// Game Builder Editor store.
// Template = { canvas, elements }. Mọi thao tác đều cập nhật Zustand + hỗ trợ undo/redo.

const initialState = {
  template: null, // { canvas, elements }
  selectedId: null,
  zoom: 0.6,
  past: [],
  future: [],
};

const clone = (v) => (v ? JSON.parse(JSON.stringify(v)) : v);

const clampZoom = (z) => Math.min(1.5, Math.max(0.25, z));

export const useEditorStore = create((set, get) => ({
  ...initialState,

  loadTemplate: (template) =>
    set({
      template: template ? clone(template) : { canvas: defaultCanvas(), elements: defaultElements() },
      selectedId: null,
      past: [],
      future: [],
      zoom: 0.6,
    }),

  // Snapshot hiện tại → past, xóa future
  commit: (mutator) => {
    const { template, past } = get();
    if (!template) return;
    const next = mutator(clone(template));
    set({ template: next, past: [...past, clone(template)], future: [] });
  },

  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  zoomIn: () => set((s) => ({ zoom: clampZoom(s.zoom + 0.1) })),
  zoomOut: () => set((s) => ({ zoom: clampZoom(s.zoom - 0.1) })),
  resetZoom: () => set({ zoom: 0.6 }),

  selectElement: (id) => set({ selectedId: id }),
  select: (id) => set({ selectedId: id }),
  clearSelection: () => set({ selectedId: null }),

  setCanvas: (patch) =>
    get().commit((tpl) => ({ ...tpl, canvas: { ...tpl.canvas, ...patch } })),

  addElement: (type, x, y, props) => {
    const tpl = get().template;
    if (!tpl) return null;
    const maxZ = tpl.elements.length ? Math.max(...tpl.elements.map(e => e.zIndex)) : 0;
    const el = createElement(type, x, y, props);
    el.zIndex = maxZ + 1;
    get().commit((t) => ({ ...t, elements: [...t.elements, el] }));
    set({ selectedId: el.id });
    return el;
  },

  // Không lưu history — dùng trong lúc drag/resize liên tục
  updateElementLive: (id, patch) => {
    const tpl = get().template;
    if (!tpl) return;
    set({
      template: {
        ...tpl,
        elements: tpl.elements.map(e => (e.id === id ? { ...e, ...patch } : e)),
      },
    });
  },

  updateElement: (id, patch) =>
    get().commit((tpl) => ({
      ...tpl,
      elements: tpl.elements.map(e => (e.id === id ? { ...e, ...patch } : e)),
    })),

  updateProperties: (id, propsPatch) =>
    get().commit((tpl) => ({
      ...tpl,
      elements: tpl.elements.map(e =>
        e.id === id ? { ...e, properties: { ...e.properties, ...propsPatch } } : e
      ),
    })),

  moveElement: (id, x, y) => get().updateElementLive(id, { x, y }),
  resizeElement: (id, patch) => get().updateElementLive(id, patch),

  duplicateElement: (id) => {
    const tpl = get().template;
    const el = tpl.elements.find(e => e.id === id);
    if (!el) return;
    const copy = clone(el);
    copy.id = `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    copy.x += 24;
    copy.y += 24;
    copy.zIndex = Math.max(...tpl.elements.map(e => e.zIndex)) + 1;
    get().commit((t) => ({ ...t, elements: [...t.elements, copy] }));
    set({ selectedId: copy.id });
  },

  deleteElement: (id) =>
    get().commit((tpl) => ({
      ...tpl,
      elements: tpl.elements.filter(e => e.id !== id),
    })),

  bringForward: (id) =>
    get().commit((tpl) => {
      const sorted = [...tpl.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex(e => e.id === id);
      if (idx < 0 || idx >= sorted.length - 1) return tpl;
      const next = sorted.slice(1).map((e, i) => ({ ...e, zIndex: i + 1 }));
      next.push({ ...sorted[0], zIndex: sorted.length });
      return { ...tpl, elements: next };
    }),

  sendBackward: (id) =>
    get().commit((tpl) => {
      const sorted = [...tpl.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex(e => e.id === id);
      if (idx <= 0) return tpl;
      const head = sorted.slice(0, idx).map((e, i) => ({ ...e, zIndex: i + 1 }));
      const rest = sorted.slice(idx + 1).map((e, i) => ({ ...e, zIndex: idx + 1 + i }));
      return { ...tpl, elements: [...head, { ...sorted[idx], zIndex: idx + 1 }, ...rest].map((e, i) => ({ ...e, zIndex: i + 1 })) };
    }),

  alignElement: (id, mode) => {
    const tpl = get().template;
    const el = tpl.elements.find(e => e.id === id);
    if (!el) return;
    const { width: cw, height: ch } = tpl.canvas;
    const patch = {};
    if (mode === "left") patch.x = 0;
    if (mode === "center") patch.x = Math.round((cw - el.width) / 2);
    if (mode === "right") patch.x = cw - el.width;
    if (mode === "top") patch.y = 0;
    if (mode === "middle") patch.y = Math.round((ch - el.height) / 2);
    if (mode === "bottom") patch.y = ch - el.height;
    get().commit((t) => ({ ...t, elements: t.elements.map(e => e.id === id ? { ...e, ...patch } : e) }));
  },

  undo: () => {
    const { past, future, template } = get();
    if (!past.length) return;
    const prev = past[past.length - 1];
    set({
      template: clone(prev),
      past: past.slice(0, -1),
      future: [clone(template), ...future],
    });
  },

  redo: () => {
    const { past, future, template } = get();
    if (!future.length) return;
    const next = future[0];
    set({
      template: clone(next),
      past: [...past, clone(template)],
      future: future.slice(1),
    });
  },

  resetEditor: () => set({ ...initialState }),
}));