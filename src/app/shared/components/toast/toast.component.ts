import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (notification of notifications(); track notification.id) {
        <div class="toast" [class]="'toast-' + notification.type">
          <div class="toast-icon">
            @switch (notification.type) {
              @case ('success') { <i class="fas fa-check-circle"></i> }
              @case ('error') { <i class="fas fa-times-circle"></i> }
              @case ('warning') { <i class="fas fa-exclamation-triangle"></i> }
              @case ('info') { <i class="fas fa-info-circle"></i> }
            }
          </div>
          <span class="toast-message">{{ notification.message }}</span>
          <button class="toast-close" (click)="dismiss(notification.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-container {
      position: fixed;
      top: var(--space-4);
      right: var(--space-4);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      max-width: min(400px, calc(100vw - 32px));
    }

    @media (max-width: 640px) {
      .toast-container {
        top: auto;
        bottom: var(--space-4);
        right: var(--space-4);
        left: var(--space-4);
        max-width: none;
      }
    }

    .toast {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      background: var(--surface-2);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-dropdown);
      animation: slideIn 240ms var(--ease-spring) both;
      color: var(--text-primary);
      font-weight: 500;
      font-size: var(--text-body);
      border-left: 3px solid;
    }

    .toast-success {
      border-left-color: var(--status-available);
      .toast-icon { color: var(--status-available); }
    }
    .toast-error {
      border-left-color: var(--status-maintenance);
      .toast-icon { color: var(--status-maintenance); }
    }
    .toast-warning {
      border-left-color: var(--status-occupied);
      .toast-icon { color: var(--status-occupied); }
    }
    .toast-info {
      border-left-color: var(--accent);
      .toast-icon { color: var(--accent); }
    }

    .toast-icon {
      font-size: 1rem;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      min-width: 0;
    }

    .toast-close {
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
      min-height: auto;
      transition: color var(--duration-micro) var(--ease-out);
    }

    .toast-close:hover {
      color: var(--text-primary);
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @media (max-width: 640px) {
      @keyframes slideIn {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    }
  `,
})
export class ToastComponent {
  private notificationService = inject(NotificationService);
  notifications = this.notificationService.notifications;

  dismiss(id: number) {
    this.notificationService.dismiss(id);
  }
}
