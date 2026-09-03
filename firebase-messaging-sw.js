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

  const { title, body, icon } = payload.notification || {};
  const data = payload.data || {};

  const iconUrl = icon || (self.location.origin + "/educational-games/eduplay-icon-192x192.png");
  const badgeUrl = self.location.origin + "/educational-games/eduplay-icon-192x192.png";

  const notificationTitle = title || "EduPlay";
  const notificationOptions = {
    body: body || "",
    icon: iconUrl,
    badge: badgeUrl,
    data,
    tag: data.type || "general",
    renotify: true,
    vibrate: [200, 100, 200],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Fallback native push event listener
self.addEventListener("push", (event) => {
  console.log("[SW] Push event received");
  if (!event.data) return;

  try {
    const payload = event.data.json();
    console.log("[SW] Push data:", payload);
    const notification = payload.notification || {};
    const data = payload.data || {};
    const title = notification.title || data.title || "EduPlay";
    const iconUrl = notification.icon || (self.location.origin + "/educational-games/eduplay-icon-192x192.png");
    const badgeUrl = self.location.origin + "/educational-games/eduplay-icon-192x192.png";

    const options = {
      body: notification.body || data.body || "",
      icon: iconUrl,
      badge: badgeUrl,
      data,
      tag: data.type || "general",
      renotify: true,
      vibrate: [200, 100, 200],
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.warn("[SW] Push payload not JSON:", err);
  }
});

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
  } else if (data?.type === "ASSIGNMENT" && data?.assignmentId) {
    urlToOpen = `/educational-games/#/assignment/${data.assignmentId}`;
  } else if (data?.type === "CHAT" && data?.conversationId) {
    urlToOpen = `/educational-games/#/chat`;
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
