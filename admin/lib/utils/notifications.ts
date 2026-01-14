/**
 * Notification Helper Utilities
 * Functions to create notifications for users
 * Also sends Firebase push notifications
 */

import { createServerClient } from '@/lib/supabase/client';

/**
 * Send Firebase push notification via API
 */
async function sendPushNotification(
  user_id?: string,
  user_ids?: string[],
  role?: 'reader' | 'author' | 'admin',
  title: string = '',
  body: string = '',
  data?: any
) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin-orcin-omega.vercel.app';
    const response = await fetch(`${API_BASE_URL}/api/notifications/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        user_ids,
        role,
        title,
        body,
        data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error sending push notification:', error);
      return false;
    }

    const result = await response.json();
    console.log('Push notification sent:', result);
    return true;
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    return false;
  }
}

/**
 * Send notification to a single user
 * Also sends Firebase push notification
 */
export async function sendNotificationToUser(
  userId: string,
  title: string,
  message: string,
  options?: {
    icon?: string;
    type?: string;
    action_type?: string;
    action_screen?: string;
    action_params?: any;
  }
) {
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      icon: options?.icon || '🔔',
      type: options?.type || 'info',
      action_type: options?.action_type,
      action_screen: options?.action_screen,
      action_params: options?.action_params,
    });

    if (error) {
      console.error('Error sending notification to user:', error);
      return false;
    }

    // Also send Firebase push notification
    await sendPushNotification(
      userId,
      undefined,
      undefined,
      title,
      message,
      {
        icon: options?.icon || '🔔',
        type: options?.type || 'info',
        action_type: options?.action_type,
        action_screen: options?.action_screen,
        ...options?.action_params,
      }
    );

    return true;
  } catch (error) {
    console.error('Error in sendNotificationToUser:', error);
    return false;
  }
}

/**
 * Send notification to all users with a specific role
 * Also sends Firebase push notifications
 */
export async function sendNotificationToRole(
  role: 'reader' | 'author' | 'admin',
  title: string,
  message: string,
  options?: {
    icon?: string;
    type?: string;
    action_type?: string;
    action_screen?: string;
    action_params?: any;
  }
) {
  try {
    const supabase = createServerClient();
    
    // Get all users with the specified role
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('role', role);

    if (usersError) {
      console.error('Error fetching users for notification:', usersError);
      return false;
    }

    if (!users || users.length === 0) {
      console.log(`No users found with role: ${role}`);
      return true; // Not an error, just no users to notify
    }

    // Create notifications for all users
    const notifications = users.map((user) => ({
      user_id: user.id,
      title,
      message,
      icon: options?.icon || '🔔',
      type: options?.type || 'info',
      action_type: options?.action_type,
      action_screen: options?.action_screen,
      action_params: options?.action_params,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);

    if (error) {
      console.error('Error sending notifications to role:', error);
      return false;
    }

    // Also send Firebase push notification to all users with this role
    await sendPushNotification(
      undefined,
      undefined,
      role,
      title,
      message,
      {
        icon: options?.icon || '🔔',
        type: options?.type || 'info',
        action_type: options?.action_type,
        action_screen: options?.action_screen,
        ...options?.action_params,
      }
    );

    console.log(`✅ Sent ${notifications.length} notifications to ${role} users`);
    return true;
  } catch (error) {
    console.error('Error in sendNotificationToRole:', error);
    return false;
  }
}

/**
 * Send notification to all customers (readers) about a new book
 */
export async function notifyCustomersAboutNewBook(
  bookTitle: string,
  authorName: string,
  bookId: string
) {
  return sendNotificationToRole(
    'reader',
    '📚 New Book Available',
    `${authorName} has published "${bookTitle}". Check it out now!`,
    {
      icon: '📚',
      type: 'info',
      action_type: 'navigate',
      action_screen: 'BookDetail',
      action_params: { bookId },
    }
  );
}

/**
 * Send notification to all customers about a verified book
 */
export async function notifyCustomersAboutVerifiedBook(
  bookTitle: string,
  authorName: string,
  bookId: string
) {
  return sendNotificationToRole(
    'reader',
    '✅ New Book Verified',
    `"${bookTitle}" by ${authorName} is now available!`,
    {
      icon: '✅',
      type: 'success',
      action_type: 'navigate',
      action_screen: 'BookDetail',
      action_params: { bookId },
    }
  );
}

/**
 * Send notification to author about book verification
 */
export async function notifyAuthorAboutBookVerification(
  authorId: string,
  bookTitle: string,
  bookId: string
) {
  return sendNotificationToUser(
    authorId,
    '✅ Your Book is Verified',
    `Your book "${bookTitle}" has been verified and published!`,
    {
      icon: '✅',
      type: 'success',
      action_type: 'navigate',
      action_screen: 'BookDetail',
      action_params: { bookId },
    }
  );
}
