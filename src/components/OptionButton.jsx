export default function OptionButton({ o, i, revealed, selected, correctId, onSelect, hover = "border-ink/12 hover:border-ticket/40", icon = null, correctMark = "✓", contentCls = "" }) {
  let stateCls = hover;
  if (revealed) {
    if (o.id === correctId) stateCls = "border-teal bg-teal/10";
    else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
    else stateCls = "border-ink/10 opacity-50";
  } else if (o.id === selected) stateCls = "border-ticket bg-ticket/5";
  return (
    <button key={o.id} disabled={revealed} onClick={() => onSelect(o.id)}
      className={`w-full text-left flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition font-body ${stateCls}`}>
      {icon || <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-mono flex-shrink-0">{String.fromCharCode(65 + i)}</span>}
      <span className={`flex-1 ${contentCls}`}>{o.content}</span>
      {revealed && o.id === correctId && <span>{correctMark}</span>}
    </button>
  );
}