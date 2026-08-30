import { getRoleLabel } from "../../../config/roles.js";
import { timeAgo } from "./utils.js";

export default function HeroHeader({ user, level }) {
  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
      {/* Gradient backdrop */}
      <div className="absolute inset-0 opacity-[0.07]" style={{ background: "linear-gradient(135deg, var(--accent), var(--purple, #8b5cf6), var(--pink, #ec4899), var(--accent))" }} />
      <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.04] rounded-full blur-3xl" style={{ background: "var(--purple, #8b5cf6)" }} />

      <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative shrink-0 group">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-4xl sm:text-5xl text-white font-display shadow-xl ring-4 ring-white/10 transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--purple, #8b5cf6))" }}
          >
            {user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-lg ring-2 ring-white/20"
            style={{ background: "var(--card)" }}
          >
            {level >= 10 ? "👑" : level >= 5 ? "⭐" : "🌱"}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl text-ink mb-0.5 truncate">{user.name}</h1>
          <p className="text-sm font-mono mb-2" style={{ color: "var(--muted)" }}>@{user.username}</p>
          {user.email && (
            <p className="text-xs mb-3 flex items-center justify-center sm:justify-start gap-1" style={{ color: "var(--muted)" }}>
              <span className="inline-block w-3.5 text-center">📧</span> {user.email}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent)" }}>
              {getRoleLabel(user.role)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#fef3c7", color: "#d97706" }}>
              Level {level}
            </span>
            {user.createdAt && (
              <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                Tham gia {timeAgo(user.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
