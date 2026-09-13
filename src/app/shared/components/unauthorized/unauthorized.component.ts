import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <h1 class="error-title">403</h1>
        <h2 class="error-subtitle">Acceso No Autorizado</h2>
        <p class="error-description">
          No tienes permisos para acceder a esta página. 
          Contacta al administrador si crees que esto es un error.
        </p>
        <div class="error-actions">
          <a routerLink="/" class="btn btn-primary">
            <i class="fas fa-home"></i>
            Volver al Inicio
          </a>
          <button onclick="history.back()" class="btn btn-outline">
            <i class="fas fa-arrow-left"></i>
            Regresar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-base);
      padding: var(--space-8);
    }

    .error-content {
      text-align: center;
      max-width: 500px;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: var(--space-6);
      color: var(--accent);
      background: var(--accent-subtle);
      width: 80px;
      height: 80px;
      border-radius: var(--radius-full);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .error-title {
      font-size: 4rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .error-subtitle {
      font-size: var(--text-h2);
      margin: var(--space-4) 0;
      font-weight: 600;
      color: var(--text-primary);
    }

    .error-description {
      font-size: var(--text-body);
      margin: var(--space-6) 0;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .error-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: center;
      flex-wrap: wrap;
      margin-top: var(--space-8);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: var(--text-body);
      text-decoration: none;
      transition:
        background var(--duration-micro) var(--ease-out),
        border-color var(--duration-micro) var(--ease-out);
      cursor: pointer;
    }

    .btn-primary {
      background: var(--accent);
      color: var(--accent-text-on);
      border: 1px solid var(--accent);
    }

    .btn-primary:hover {
      background: var(--accent-hover);
      border-color: var(--accent-hover);
    }

    .btn-outline {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
    }

    .btn-outline:hover {
      background: var(--surface-2);
      border-color: var(--border-strong);
      color: var(--text-primary);
    }

    @media (max-width: 640px) {
      .error-title {
        font-size: 3rem;
      }

      .error-subtitle {
        font-size: var(--text-h3);
      }

      .error-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 250px;
        justify-content: center;
      }
    }
  `]
})
export class UnauthorizedComponent {}