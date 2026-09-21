/* eslint-disable no-undef */
// Firebase Messaging Service Worker
// Handles push notifications when app is in background or closed.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Firebase config - must match firebaseConfig.js
const firebaseConfig = {
  apiKey: "AIzaSyDPu6j3eT-AJ2JztbmPzAxXUjUK8rGWbCA",
  authDomain: "eduplay-74301.firebaseapp.com",
  projectId: "eduplay-74301",
  storageBucket: "eduplay-74301.firebasestorage.app",
  messagingSenderId: "906308269770",
  appId: "1:906308269770:web:d3da03a6be412710666633",
  measurementId: "G-L41PW0PQ45"
};

// Initialize Firebase (only once)
let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
  console.log("[SW] Firebase initialized:", app.name);
} else {
  app = firebase.apps[0];
}

const messaging = firebase.messaging();

// Handle background messages via FCM SDK
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received via FCM:", payload);

  // Data-only messages: title/body are in payload.data, not payload.notification
  const data = payload.data || {};
  const title = data.title || payload.notification?.title || "EduPlay";
  const body = data.body || payload.notification?.body || "";
  const icon = data.icon || payload.notification?.icon;

  const iconUrl = icon || (self.location.origin + "/educational-games/eduplay-icon-192x192.png");
  const badgeUrl = self.location.origin + "/educational-games/eduplay-icon-192x192.png";

  const notificationTitle = title;
  const notificationOptions = {
    body,
    icon: iconUrl,
    badge: badgeUrl,
    data,
    tag: data.type || "general",
    renotify: true,
    vibrate: data.vibrate === "false" ? undefined : [200, 100, 200],
  };

  // Play sound for reminder notifications
  if (data.sound !== "false" && (data.type === "REMINDER" || data.type === "REMINDER_CREATED")) {
    try {
      const audioCtx = new (self.AudioContext || self.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.5);
    } catch { /* ignore audio errors */ }
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// NOTE: Do NOT add a separate push event listener here.
// onBackgroundMessage above already handles all push messages.
// Having both causes duplicate notifications.

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click:", event.notification.tag, event.action);
  event.notification.close();

  if (event.action === "dismiss") return;

  // Determine URL to open
  let urlToOpen = "/educational-games/";
  const data = event.notification.data;

  if (data?.link) {
    urlToOpen = `/educational-games${data.link}`;
  } else if ((data?.type === "ASSIGNMENT" || data?.type === "DEADLINE_REMINDER") && data?.assignmentId) {
    urlToOpen = `/educational-games/#/assignment/${data.assignmentId}`;
  } else if (data?.type === "CHAT" && data?.conversationId) {
    urlToOpen = `/educational-games/#/chat`;
  } else if (data?.type === "REMINDER" || data?.type === "REMINDER_CREATED") {
    urlToOpen = `/educational-games/#/admin/reminders`;
  } else if (data?.gameId) {
    urlToOpen = `/educational-games/#/play/${data.gameId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Check if app is already open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          // Focus existing window and navigate if needed
          if (data?.link || data?.assignmentId) {
            client.navigate(urlToOpen);
          }
          return client.focus();
        }
      }
      // Open new window
      return clients.openWindow(urlToOpen);
    })
  );
});

// Handle notification close (for analytics/logging)
self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Notification closed:", event.notification.tag);
});
