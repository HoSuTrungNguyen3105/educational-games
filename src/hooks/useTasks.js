import { useState, useCallback } from "react";
import { taskService } from "../services/taskService.js";

/**
 * Hook to fetch and manage task data.
 * Returns { tasks, loading, error, refresh, claimReward }.
 *
 * @param {string} scope - "DAILY" | "WEEKLY" | "TOTAL"
 */
export function useTasks(scope = "DAILY") {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getTasks(scope);
      setTasks(result?.tasks || []);
    } catch (e) {
      setError(e.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  const claimReward = useCallback(async (taskId) => {
    const result = await taskService.claimReward(taskId);
    // Refresh tasks after claim
    await fetchTasks();
    return result;
  }, [fetchTasks]);

  return { tasks, loading, error, refresh: fetchTasks, claimReward };
}
