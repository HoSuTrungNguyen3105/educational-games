/* eslint-disable no-undef */
// Firebase Messaging Service Worker
// This file handles push notifications when the app is in the background or closed.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_PROJECT.firebaseapp.com",
  // projectId: "YOUR_PROJECT",
  // storageBucket: "YOUR_PROJECT.appspot.com",
  // messagingSenderId: "000000000000",
  // appId: "1:000000000000:web:000000000000",
  apiKey: "AIzaSyDPu6j3eT-AJ2JztbmPzAxXUjUK8rGWbCA",
  authDomain: "eduplay-74301.firebaseapp.com",
  projectId: "eduplay-74301",
  storageBucket: "eduplay-74301.firebasestorage.app",
  messagingSenderId: "906308269770",
  appId: "1:906308269770:web:d3da03a6be412710666633",
  measurementId: "G-L41PW0PQ45"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  const data = payload.data || {};

  self.registration.showNotification(title || "Educational Games", {
    body: body || "",
    icon: icon || "/educational-games/pwa-192x192.svg",
    badge: "/educational-games/pwa-192x192.svg",
    data,
    actions: [
      { action: "open", title: "Mở app" },
      { action: "dismiss", title: "Để sau" },
    ],
  });
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const urlToOpen = new URL("/educational-games/", self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // If app is already open, focus it
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return clients.openWindow(urlToOpen);
    })
  );
});
