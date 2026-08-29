export default function TaskProgress({ progress, target, completed, claimed }) {
  const pct = Math.min(100, (progress / target) * 100);

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-2 bg-ink/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            claimed ? "bg-gray-300" : completed ? "bg-gradient-to-r from-amber-400 to-orange-400" : "bg-gradient-to-r from-emerald-400 to-teal-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-mono text-[#8A7C63] tabular-nums shrink-0">
        {progress}/{target}
      </span>
    </div>
  );
}
