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
      padding: 2rem;
    }

    .not-found-content {
      max-width: 500px;
    }

    h1 {
      font-size: 6rem;
      color: #667eea;
      margin: 0;
      font-weight: bold;
    }

    h2 {
      font-size: 2rem;
      color: #333;
      margin: 1rem 0;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent { }