import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notificationService.js";
import { requestNotificationPermission, onForegroundMessage } from "../firebase/messaging.js";

export function useNotifications(userAuth) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!userAuth?.token) return;
    setLoading(true);
    try {
      const [notifs, countRes] = await Promise.all([
        notificationService.list().catch(() => []),
        notificationService.unreadCount().catch(() => ({ count: 0 })),
      ]);
      setNotifications(Array.isArray(notifs) ? notifs : notifs?.data || []);
      setUnreadCount(countRes?.count || 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [userAuth?.token]);

  // Register FCM token with backend
  const registerFCMToken = useCallback(async () => {
    if (!userAuth?.token) return;
    try {
      const fcmToken = await requestNotificationPermission();
      console.log("🔥 FCM TOKEN:", fcmToken);
      if (fcmToken) {
        await notificationService.registerDevice(fcmToken, "WEB");
      }
    } catch {
      // ignore
    }
  }, [userAuth?.token]);

  // Listen for foreground messages
  useEffect(() => {
    if (!userAuth?.token) return;

    const unsubscribe = onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      const data = payload.data || {};
      // Add to local state
      const newNotif = {
        id: `fg-${Date.now()}`,
        title: title || "Thông báo",
        message: body || "",
        type: data.type || "SYSTEM",
        data,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    return unsubscribe;
  }, [userAuth?.token]);

  // Initial load + FCM registration
  useEffect(() => {
    if (!userAuth?.token) return;
    loadNotifications();
    registerFCMToken();
  }, [userAuth?.token, loadNotifications, registerFCMToken]);

  // Mark as read
  const markRead = useCallback(async (id) => {
    await notificationService.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  // Mark all as read
  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    refresh: loadNotifications,
  };
}
