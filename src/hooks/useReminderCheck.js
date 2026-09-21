import { useEffect, useState, useCallback } from "react";
import { reminderService } from "../services/api.js";

/**
 * useReminderCheck — Polls for due reminders every 30s and shows an alert.
 * Returns { dueReminder, dismissDue }.
 */
export default function useReminderCheck(authToken) {
  const [dueReminder, setDueReminder] = useState(null);

  const dismissDue = useCallback(async () => {
    if (!dueReminder) return;
    try {
      await reminderService.trigger(dueReminder.id);
    } catch { /* ignore */ }
    setDueReminder(null);
  }, [dueReminder]);

  useEffect(() => {
    if (!authToken) return;

    let active = true;
    const check = async () => {
      try {
        const due = await reminderService.getDue();
        if (active && due && due.length > 0) {
          setDueReminder((prev) => prev || due[0]);
        }
      } catch { /* ignore */ }
    };

    check();
    const interval = setInterval(check, 30000);
    return () => { active = false; clearInterval(interval); };
  }, [authToken]);

  return { dueReminder, dismissDue };
}
