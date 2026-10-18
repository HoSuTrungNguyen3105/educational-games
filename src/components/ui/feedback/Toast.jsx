
export function Toast({ toast }) {
  if (!toast) return null;
  const cls = toast.type === "error" ? "bg-ticket text-white" : toast.type === "success" ? "bg-teal text-white" : "bg-ink text-paper";
  return <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg font-body text-sm anim-pop ${cls}`}>{toast.message}</div>;
}
