import { uid } from '../services/api.js';

export function getRoute() {
  const p = (window.location.pathname || "").toLowerCase().replace(/\/+$/, "");
  const h = (window.location.hash || "").toLowerCase();
  return p.endsWith("/admin") || h.includes("/admin") ? "admin" : "home";
}

export function navigate(route) {
  if (route === "admin") {
    if (window.location.hash !== "/admin") window.location.hash = "/admin";
  } else if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

export function shortName(full) {
  const parts = full.trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(-2).join(" ") : full;
}

export function rankMedal(rank) {
  if (rank === 1) return { icon: "🥇", ring: "#F4B942" };
  if (rank === 2) return { icon: "🥈", ring: "#9CA3AF" };
  if (rank === 3) return { icon: "🥉", ring: "#B5651D" };
  return { icon: rank, ring: "#E7D9BE" };
}

export function emptyQuestion() {
  return {
    id: uid("question"), content: "",
    options: [{ id: uid("answer"), content: "" }, { id: uid("answer"), content: "" }, { id: uid("answer"), content: "" }],
    correctAnswer: null, timeLimit: 20, points: 100,
  };
}