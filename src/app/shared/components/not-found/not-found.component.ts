import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <button class="btn btn-primary" [routerLink]="['/']">
          <i class="fas fa-home"></i>
          Go Home
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      text-align: center;
      padding: var(--space-8);
    }

    .not-found-content {
      max-width: 500px;
    }

    h1 {
      font-size: 5rem;
      color: var(--accent);
      margin: 0;
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1;
    }

    h2 {
      font-size: var(--text-h2);
      color: var(--text-primary);
      margin: var(--space-4) 0;
      font-weight: 600;
    }

    p {
      color: var(--text-secondary);
      font-size: var(--text-body);
      margin-bottom: var(--space-6);
    }

    .btn {
      background: var(--accent);
      color: var(--accent-text-on);
      border: none;
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: var(--text-body);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      transition: background var(--duration-micro) var(--ease-out);
    }

    .btn:hover {
      background: var(--accent-hover);
    }
  `]
})
export class NotFoundComponent { }