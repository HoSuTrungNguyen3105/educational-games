import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig, VAPID_KEY } from "./firebaseConfig.js";

let messaging = null;
let token = null;

/**
 * Initialize Firebase Messaging.
 * Returns the messaging instance or null if not supported.
 */
export function initMessaging() {
  if (messaging) return messaging;
  try {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    return messaging;
  } catch {
    return null;
  }
}

/**
 * Request notification permission and get FCM token.
 * Returns the token string or null.
 */
export async function requestNotificationPermission() {
  try {
    if (!("Notification" in window)) return null;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    const msg = initMessaging();

    if (!msg) {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    token = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.error("FCM error:", error);
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
  const msg = initMessaging();
  if (!msg) return () => { };

  return onMessage(msg, (payload) => {
    callback(payload);
  });
}
