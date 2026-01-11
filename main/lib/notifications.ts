// lib/notifications.ts
import type { messaging } from 'firebase-admin';

let adminMessaging: messaging.Messaging | null = null;

async function getMessaging() {
  if (adminMessaging) return adminMessaging;

  const admin = await import('firebase-admin');

  if (!admin.default.apps.length) {
    admin.default.initializeApp({
      credential: admin.default.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
    });
  }

  adminMessaging = admin.default.messaging();
  return adminMessaging;
}

/* ---------------- TYPES ---------------- */

export type PushMessage = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

/* ---------------- SINGLE TOKEN ---------------- */

export async function sendPushToToken(
  token: string,
  message: PushMessage
) {
  const messaging = await getMessaging();

  await messaging.send({
    token,
    notification: {
      title: message.title,
      body: message.body,
    },
    data: message.data,
  });
}

/* ---------------- MULTIPLE TOKENS ---------------- */

export async function sendPushToTokens(
  tokens: string[],
  message: PushMessage
) {
  if (tokens.length === 0) return;

  const messaging = await getMessaging();

  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title: message.title,
      body: message.body,
    },
    data: message.data,
  });

  // cleanup invalid tokens (important)
  const invalidTokens: string[] = [];

  response.responses.forEach((res, index) => {
    if (!res.success) {
      const code = res.error?.code;
      if (
        code === 'messaging/registration-token-not-registered' ||
        code === 'messaging/invalid-registration-token'
      ) {
        invalidTokens.push(tokens[index]);
      }
    }
  });

  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
    invalidTokens,
  };
}
