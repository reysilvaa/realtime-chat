import { writable } from 'svelte/store';
import type { Notification, NotificationType } from '$lib/types';

export const notifications = writable<Notification[]>([]);

let notificationId = 0;

export function showNotification(message: string, type: NotificationType = 'success'): void {
  const id = notificationId++;
  const notification: Notification = { message, type, id };
  
  notifications.update(n => [...n, notification]);
  
  setTimeout(() => {
    removeNotification(id);
  }, 3000);
}

export function removeNotification(id: number): void {
  notifications.update(n => n.filter(notif => notif.id !== id));
}
