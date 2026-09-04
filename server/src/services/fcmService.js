import fs from "fs";
import path from "path";
import { getCollection } from "../db.js";

/**
 * Firebase Cloud Messaging service for sending push notifications.
 *
 * Configuration options:
 * 1. FIREBASE_SERVICE_ACCOUNT: Full JSON string of service account key (recommended on Render/Cloud)
 * 2. FIREBASE_SERVICE_ACCOUNT_PATH: Path to local JSON file (e.g. ./firebase-service-account.json)
 * 3. FIREBASE_PROJECT_ID: e.g. "eduplay-74301"
 */

let messaging = null;
let initialized = false;

async function getMessaging() {
  if (messaging) return messaging;
  if (initialized) return null; // Already attempted and failed — don't retry

  // Mark as attempted immediately to prevent concurrent init
  initialized = true;

  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  console.log(
    "[FCM] FIREBASE_SERVICE_ACCOUNT:",
    serviceAccountEnv ? `ĐÃ CÓ (${serviceAccountEnv.length} ký tự)` : "KHÔNG CÓ"
  );
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json";
  const projectId = process.env.FIREBASE_PROJECT_ID || "eduplay-74301";

  try {
    const { getApps, initializeApp, cert } =
      await import("firebase-admin/app");

    const { getMessaging } =
      await import("firebase-admin/messaging");

    if (getApps().length > 0) {
      messaging = getMessaging();
      return messaging;
    }

    let credential = null;

    // 1. Check if full JSON string is in FIREBASE_SERVICE_ACCOUNT env var (Render setup)
    if (serviceAccountEnv) {
      try {
        let rawJson = serviceAccountEnv.trim();

        // If Base64-encoded, decode first
        if (!rawJson.startsWith("{")) {
          rawJson = Buffer.from(rawJson, "base64").toString("utf8");
        }

        // Fix common Render issue: escaped newlines in private_key
        // Render sometimes double-escapes \n → \\n inside env vars
        const parsed = JSON.parse(rawJson);
        if (parsed.private_key) {
          // Normalize: replace literal \\n with actual newline
          parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
        }

        credential = cert(parsed);
        console.log("[FCM] ✅ Loaded service account from FIREBASE_SERVICE_ACCOUNT env var.");
      } catch (e) {
        console.error("[FCM] ❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", e.message);
        console.error("[FCM] Hint: Make sure the env var contains the full JSON from Firebase Console.");
        console.error("[FCM] First 100 chars of env var:", serviceAccountEnv?.slice(0, 100));
      }
    } else {
      console.warn("[FCM] FIREBASE_SERVICE_ACCOUNT env var is not set on Render.");
    }

    // 2. Check local file if exists
    if (!credential) {
      const resolvedPath = path.resolve(serviceAccountPath);
      if (fs.existsSync(resolvedPath)) {
        try {
          const content = fs.readFileSync(resolvedPath, "utf8");
          const parsed = JSON.parse(content);
          if (parsed.private_key) {
            parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
          }
          credential = cert(parsed);
          console.log("[FCM] Loaded service account credential from file:", resolvedPath);
        } catch (e) {
          console.error("[FCM] Failed to read service account file:", e.message);
        }
      }
    }

    // 3. Fallback to Google Application Default credentials
    if (!credential && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        credential = admin.credential.applicationDefault();
        console.log("[FCM] Using Google Application Default Credentials");
      } catch (e) {
        console.error("[FCM] Application Default Credentials failed:", e.message);
      }
    }

    if (!credential) {
      console.warn(
        "[FCM] ❌ No Firebase credentials found. Push notifications disabled.\n" +
        "--> On Render: Set Environment Variable 'FIREBASE_SERVICE_ACCOUNT' with the full JSON content."
      );
      return null;
    }

    initializeApp({
      credential,
      projectId,
    });
    messaging = getMessaging();
    console.log("[FCM] ✅ Firebase Admin initialized for project:", projectId);
    return messaging;
  } catch (err) {
    console.error("[FCM] Fatal error during Firebase Admin init:", err.message);
    return null;
  }
}


/**
 * Send push notification to a list of FCM tokens.
 */
export async function sendToTokens(tokens, { title, body, type, data = {} }) {
  if (!tokens || tokens.length === 0) return { sent: 0, failed: 0, reason: "no_tokens" };

  const msg = await getMessaging();
  if (!msg) {
    console.warn("[FCM] Cannot send push: FCM Admin is not initialized.");
    return {
      sent: 0,
      failed: tokens.length,
      reason: "fcm_not_configured",
      hint: "Configure FIREBASE_SERVICE_ACCOUNT in Render environment variables",
    };
  }

  // Convert all data values to string (FCM restriction: data fields must be strings)
  const stringData = {};
  if (data && typeof data === "object") {
    for (const [k, v] of Object.entries(data)) {
      stringData[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
    }
  }
  stringData.type = String(type || "SYSTEM");
  stringData.click_action = "/educational-games/";

  const message = {
    notification: {
      title: title || "EduPlay",
      body: body || "",
    },
    data: stringData,
    webpush: {
      headers: {
        Urgency: "high",
      },
      notification: {
        title: title || "EduPlay",
        body: body || "",
        icon: "/educational-games/eduplay-icon-192x192.png",
        badge: "/educational-games/eduplay-icon-192x192.png",
        vibrate: [200, 100, 200],
        requireInteraction: true,
      },
      fcmOptions: {
        link: "/educational-games/",
      },
    },
    tokens,
  };

  const INVALID_TOKEN_ERRORS = [
    "registration-token-not-registered",
    "invalid-registration",
];

try {
    const response = await msg.sendEachForMulticast(message);
    console.log(`[FCM] Multicast result: ${response.successCount} sent, ${response.failureCount} failed`);

    const invalidTokens = [];
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code || resp.error?.message;
          console.warn(`[FCM] Token ${tokens[idx]?.slice(0, 15)}... error:`, errorCode);
          if (INVALID_TOKEN_ERRORS.some((e) => errorCode.includes(e))) {
            invalidTokens.push(tokens[idx]);
          }
        }
      });
    }

    // Xóa các token không còn đăng ký hợp lệ
    if (invalidTokens.length > 0) {
      const { ObjectId } = await import("mongodb");
      const collection = getCollection("user_devices");
      for (const token of invalidTokens) {
        await collection.deleteOne({ token });
        console.log(`[FCM] Token ${token?.slice(0, 15)}... is no longer registered. Removing from database.`);
      }
      // Re-send after removing invalid tokens (optional: có thể gửi lại hoặc trả về kết quả)
      // Ở đây chúng ta chỉ log và cập database, caller có thể quyết định gửi lại
    }

    return {
      sent: response.successCount,
      failed: response.failureCount,
      invalidTokensRemoved: invalidTokens.length,
    };
  } catch (err) {
    console.error("[FCM] sendEachForMulticast error:", err);
    return { sent: 0, failed: tokens.length, error: err.message };
  }
}

/**
 * Send push notification to a specific user (all their active devices).
 */
export async function sendPushToUser(userId, { title, body, type, data = {} }) {
  try {
    const { getActiveTokensByUser } = await import("./userDeviceService.js");
    const tokens = await getActiveTokensByUser(userId);
    if (!tokens || tokens.length === 0) {
      console.log(`[FCM] User ${userId} has no registered devices.`);
      return { sent: 0, reason: "no_registered_devices" };
    }
    console.log(`[FCM] Sending push to user ${userId} across ${tokens.length} device(s)`);
    return sendToTokens(tokens, { title, body, type, data });
  } catch (err) {
    console.error("[FCM] sendPushToUser error:", err);
    return { sent: 0, reason: "error", error: err.message };
  }
}
