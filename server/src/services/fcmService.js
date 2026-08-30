/**
 * Firebase Cloud Messaging service for sending push notifications.
 *
 * To enable FCM push:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Go to Project Settings > Service Accounts > Generate New Private Key
 * 3. Save the JSON key as server/firebase-service-account.json
 * 4. Set FIREBASE_PROJECT_ID env var (or it reads from the JSON key)
 *
 * For web push, also add the VAPID key to frontend Firebase config.
 */

let messaging = null;

async function getMessaging() {
  if (messaging) return messaging;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json";

  if (!projectId && !serviceAccountPath) {
    // FCM not configured — silently skip
    return null;
  }

  try {
    // Dynamic import so server doesn't crash if firebase-admin isn't installed
    const admin = await import("firebase-admin");

    if (!admin.apps.length) {
      const serviceAccount = await import(serviceAccountPath).catch(() => null);
      admin.initializeApp({
        credential: serviceAccount?.default
          ? admin.credential.cert(serviceAccount.default)
          : admin.credential.applicationDefault(),
        projectId,
      });
    }

    messaging = admin.messaging();
    return messaging;
  } catch {
    // firebase-admin not installed or config missing — silently skip
    return null;
  }
}

/**
 * Send push notification to a list of FCM tokens.
 */
export async function sendToTokens(tokens, { title, body, type, data = {} }) {
  if (!tokens || tokens.length === 0) return { sent: 0, failed: 0 };

  const msg = await getMessaging();
  if (!msg) return { sent: 0, failed: 0, reason: "fcm_not_configured" };

  const message = {
    notification: { title, body },
    data: { type, ...data },
    tokens,
  };

  try {
    const response = await msg.sendEachForMulticast(message);
    return {
      sent: response.successCount,
      failed: response.failureCount,
    };
  } catch {
    return { sent: 0, failed: tokens.length };
  }
}

/**
 * Send push notification to a specific user (all their devices).
 */
export async function sendPushToUser(userId, { title, body, type, data = {} }) {
  try {
    const { getActiveTokensByUser } = await import("./userDeviceService.js");
    const tokens = await getActiveTokensByUser(userId);
    if (tokens.length === 0) return { sent: 0, reason: "no_devices" };
    return sendToTokens(tokens, { title, body, type, data });
  } catch {
    return { sent: 0, reason: "error" };
  }
}
