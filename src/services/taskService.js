import { apiFetch, uid } from "./api.js";

export const taskService = {
  async getTasks(scope = "DAILY") {
    return apiFetch(`/tasks/me?scope=${encodeURIComponent(scope)}`);
  },

  async getAllTasks() {
    return apiFetch("/tasks/me/all");
  },

  async claimReward(taskId) {
    return apiFetch(`/tasks/${encodeURIComponent(taskId)}/claim`, { method: "POST" });
  },

  async adminStats() {
    return apiFetch("/tasks/admin/stats");
  },

  async adminCreateTask(data) {
    return apiFetch("/tasks/admin/tasks", { method: "POST", body: data });
  },

  async adminUpdateTask(taskId, data) {
    return apiFetch(`/tasks/admin/tasks/${encodeURIComponent(taskId)}`, { method: "PUT", body: data });
  },

  async adminDeleteTask(taskId) {
    return apiFetch(`/tasks/admin/tasks/${encodeURIComponent(taskId)}`, { method: "DELETE" });
  },
};

/**
 * Track a task event — games call this to report player actions.
 * Backend processes events and updates task progress.
 */
export async function trackTaskEvent(type, data = {}) {
  const eventId = uid("evt");
  return apiFetch("/tasks/events", {
    method: "POST",
    body: { eventId, type, ...data },
  });
}
