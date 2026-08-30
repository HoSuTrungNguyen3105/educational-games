import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { firebaseConfig, VAPID_KEY } from "./firebaseConfig.js";

let messaging = null;
let token = null;
let initialized = false;

/**
 * Initialize Firebase Messaging (singleton).
 */
async function initMessaging() {
  if (messaging) return messaging;
  if (initialized) return null;
  initialized = true;

  try {
    // Check if messaging is supported in this browser
    const supported = await isSupported();
    if (!supported) {
      console.warn("[FCM] Messaging not supported in this browser");
      return null;
    }

    // Reuse existing Firebase app if already initialized
    let app;
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(firebaseConfig);
    }

    messaging = getMessaging(app);
    return messaging;
  } catch (error) {
    console.error("[FCM] Init error:", error);
    return null;
  }
}

/**
 * Request notification permission and get FCM token.
 * Returns the token string or null.
 */
export async function requestNotificationPermission() {
  try {
    if (!("Notification" in window)) {
      console.warn("[FCM] Notification API not available");
      return null;
    }

    // Check current permission state first
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      console.warn("[FCM] Notification permission:", permission);
      return null;
    }

    const msg = await initMessaging();
    if (!msg) {
      console.warn("[FCM] Messaging not available");
      return null;
    }

    // Wait for service worker to be ready
    let registration;
    try {
      registration = await navigator.serviceWorker.ready;
    } catch (swError) {
      console.error("[FCM] Service worker not ready:", swError);
      return null;
    }

    if (!registration) {
      console.warn("[FCM] No service worker registration");
      return null;
    }

    // Get token
    token = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("[FCM] Token obtained:", token.substring(0, 20) + "...");
    } else {
      console.warn("[FCM] No token returned - check Firebase console VAPID key");
    }

    return token;
  } catch (error) {
    console.error("[FCM] Permission/Token error:", error);
    // Common errors:
    // - "messaging/permission-blocked": User denied notification
    // - "messaging/failed-service-worker-registration": SW not properly registered
    // - "messaging/vapid-key-not-available": VAPID key mismatch
    return null;
  }
}

/**
 * Get the current FCM token (cached).
 */
export function getTokenValue() {
  return token;
}

/**
 * Listen for foreground messages.
 * Returns an unsubscribe function.
 */
export function onForegroundMessage(callback) {
  let unsubscribe = () => {};

  initMessaging().then((msg) => {
    if (!msg) return;
    try {
      unsubscribe = onMessage(msg, (payload) => {
        callback(payload);
      });
    } catch (error) {
      console.error("[FCM] onMessage error:", error);
    }
  });

  return () => unsubscribe();
}
