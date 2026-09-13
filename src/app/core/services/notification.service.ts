import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private counter = 0;
  notifications = signal<Notification[]>([]);

  show(message: string, type: Notification['type'] = 'info', duration = 5000) {
    const id = ++this.counter;
    this.notifications.update((n) => [...n, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
    return id;
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  dismiss(id: number) {
    this.notifications.update((n) => n.filter((notif) => notif.id !== id));
  }
}
