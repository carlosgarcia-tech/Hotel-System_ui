import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { icon: 'fab fa-facebook-f', url: '#', name: 'Facebook' },
    { icon: 'fab fa-twitter', url: '#', name: 'Twitter' },
    { icon: 'fab fa-instagram', url: '#', name: 'Instagram' },
    { icon: 'fab fa-linkedin-in', url: '#', name: 'LinkedIn' }
  ];

  quickLinks = [
    { title: 'Hoteles', route: '/hotels' },
    { title: 'Promociones', route: '/promotions' },
    { title: 'Reservas', route: '/reservations' },
    { title: 'Contacto', route: '/contact' }
  ];

  supportLinks = [
    { title: 'Centro de Ayuda', route: '/help' },
    { title: 'Términos y Condiciones', route: '/terms' },
    { title: 'Política de Privacidad', route: '/privacy' },
    { title: 'FAQ', route: '/faq' }
  ];

  contactInfo = {
    address: '123 Hotel Avenue, Ciudad Turística, CT 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@hotelmanager.com'
  };
}