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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .error-content {
      text-align: center;
      color: white;
      max-width: 500px;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 2rem;
      opacity: 0.8;
    }

    .error-title {
      font-size: 6rem;
      font-weight: 900;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .error-subtitle {
      font-size: 2rem;
      margin: 1rem 0;
      font-weight: 700;
    }

    .error-description {
      font-size: 1.1rem;
      margin: 2rem 0;
      opacity: 0.9;
      line-height: 1.6;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 3rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      font-size: 1rem;
    }

    .btn-primary {
      background: rgba(255,255,255,0.2);
      color: white;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.3);
    }

    .btn-primary:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .btn-outline {
      background: transparent;
      color: white;
      border: 2px solid rgba(255,255,255,0.5);
    }

    .btn-outline:hover {
      background: rgba(255,255,255,0.1);
      border-color: white;
    }

    @media (max-width: 768px) {
      .error-title {
        font-size: 4rem;
      }
      
      .error-subtitle {
        font-size: 1.5rem;
      }
      
      .error-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .btn {
        width: 100%;
        max-width: 250px;
      }
    }
  `]
})
export class UnauthorizedComponent {}