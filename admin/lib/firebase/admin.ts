/**
 * Firebase Admin SDK Initialization
 * Handles Firebase Admin setup for sending push notifications
 */

import * as admin from 'firebase-admin';

let firebaseAdmin: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK
 * Should be called once at application startup
 */
export function initializeFirebaseAdmin(): admin.app.App {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      firebaseAdmin = admin.apps[0] as admin.app.App;
      return firebaseAdmin;
    }

    // Get service account credentials
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (!serviceAccountKey && !serviceAccountPath) {
      throw new Error(
        'Firebase Admin credentials not found. Please set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_PATH environment variable.'
      );
    }

    let credential: admin.credential.Credential;

    if (serviceAccountKey) {
      // Parse JSON string from environment variable
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        credential = admin.credential.cert(serviceAccount);
      } catch (error) {
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format. Must be valid JSON string.');
      }
    } else if (serviceAccountPath) {
      // Use file path (for local development)
      const serviceAccount = require(serviceAccountPath);
      credential = admin.credential.cert(serviceAccount);
    } else {
      throw new Error('Firebase Admin credentials not configured.');
    }

    // Initialize Firebase Admin
    firebaseAdmin = admin.initializeApp({
      credential,
    });

    console.log('✅ Firebase Admin initialized successfully');
    return firebaseAdmin;
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    throw error;
  }
}

/**
 * Get Firebase Admin instance
 * Initializes if not already initialized
 */
export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseAdmin) {
    return initializeFirebaseAdmin();
  }
  return firebaseAdmin;
}

/**
 * Send push notification to FCM tokens
 */
export async function sendPushNotification(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<{ successCount: number; failureCount: number }> {
  try {
    const admin = getFirebaseAdmin();

    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    // Prepare data payload (all values must be strings)
    const dataPayload: Record<string, string> = data
      ? Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      : {};

    // Prepare notification payload
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
      },
      data: dataPayload,
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default',
          ...(data?.imageUrl && { imageUrl: data.imageUrl }),
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            ...(data?.imageUrl && { mutableContent: true }),
          },
        },
        ...(data?.imageUrl && {
          fcmOptions: {
            imageUrl: data.imageUrl,
          },
        }),
      },
      tokens,
    };

    // Send to multiple tokens
    const response = await admin.messaging().sendEachForMulticast(message);

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('Error sending Firebase notifications:', error);
    return { successCount: 0, failureCount: tokens.length };
  }
}
