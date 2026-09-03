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
    // Dynamically import firebase to keep main bundle lean
    const { isSupported, getMessaging } = await import("firebase/messaging");
    const supported = await isSupported();
    if (!supported) {
      console.warn("[FCM] Messaging not supported in this browser");
      return null;
    }

    const { initializeApp, getApps } = await import("firebase/app");
    // Reuse existing Firebase app if already initialized
    let app;
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(firebaseConfig);
      console.log("Firebase initialized:", app.name);
    }

    messaging = getMessaging(app);
    return messaging;
  } catch (error) {
    console.error("[FCM] Init error:", error);
    return null;
  }
}

/**
 * Check push notification compatibility on current device (especially iOS/Android).
 */
export function getPushSupportStatus() {
  const isIOS = typeof navigator !== "undefined" && (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
  const isStandalone = typeof window !== "undefined" && (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );

  if (isIOS && !isStandalone) {
    return {
      supported: false,
      reason: "ios_not_standalone",
      message: "Trên iPhone/iPad, bạn cần nhấn nút 'Chia sẻ' trong Safari rồi chọn 'Thêm vào Màn hình chính' để nhận được thông báo đẩy.",
    };
  }

  if (typeof window === "undefined" || !("Notification" in window)) {
    return {
      supported: false,
      reason: "no_notification_api",
      message: "Trình duyệt này không hỗ trợ Web Notification.",
    };
  }

  if (!("serviceWorker" in navigator)) {
    return {
      supported: false,
      reason: "no_service_worker",
      message: "Trình duyệt không hỗ trợ Service Worker.",
    };
  }

  return {
    supported: true,
    permission: Notification.permission,
  };
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
    console.log("[FCM] VAPID:", VAPID_KEY);
    console.log("[FCM] SW:", registration.active?.scriptURL);

    const { getToken } = await import("firebase/messaging");
    token = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("[FCM] TOKEN:", token);

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
  let unsubscribe = () => { };

  initMessaging().then(async (msg) => {
    if (!msg) return;
    try {
      const { onMessage } = await import("firebase/messaging");
      unsubscribe = onMessage(msg, (payload) => {
        callback(payload);
      });
    } catch (error) {
      console.error("[FCM] onMessage error:", error);
    }
  });

  return () => unsubscribe();
}
