import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private notificationService = inject(NotificationService);
  protected readonly title = "HotelManager";
  
  sampleHotels = [
    {
      id: 1,
      title: 'Hotel Paradise',
      subtitle: 'Resort de Lujo',
      description: 'Disfruta de una experiencia única en nuestro resort de lujo frente al mar.',
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
      imageAlt: 'Hotel Paradise',
      price: 299.99,
      currency: '$',
      rating: 4.8,
      badges: [
        { text: 'Nuevo', variant: 'success' as const },
        { text: 'Mejor Precio', variant: 'warning' as const }
      ],
      actions: [
        {
          label: 'Ver Detalles',
          icon: 'fas fa-eye',
          action: 'view-details',
          variant: 'primary' as const
        },
        {
          label: 'Reservar',
          icon: 'fas fa-calendar-check',
          action: 'book-now',
          variant: 'success' as const
        }
      ]
    },
    {
      id: 2,
      title: 'Hotel Boutique Central',
      subtitle: 'En el Centro de la Ciudad',
      description: 'Ubicado estratégicamente en el corazón de la ciudad, ideal para viajes de negocios.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      imageAlt: 'Hotel Boutique Central',
      price: 199.99,
      currency: '$',
      rating: 4.5,
      badges: [
        { text: 'Popular', variant: 'primary' as const }
      ],
      actions: [
        {
          label: 'Ver Detalles',
          icon: 'fas fa-eye',
          action: 'view-details',
          variant: 'primary' as const
        },
        {
          label: 'Reservar',
          icon: 'fas fa-calendar-check',
          action: 'book-now',
          variant: 'success' as const
        }
      ]
    },
    {
      id: 3,
      title: 'Hotel Montaña Serena',
      subtitle: 'Escapada Natural',
      description: 'Relájate en la tranquilidad de las montañas con vistas espectaculares.',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      imageAlt: 'Hotel Montaña Serena',
      price: 149.99,
      currency: '$',
      rating: 4.7,
      badges: [
        { text: 'Eco-Friendly', variant: 'success' as const },
        { text: 'Vista Montaña', variant: 'secondary' as const }
      ],
      actions: [
        {
          label: 'Ver Detalles',
          icon: 'fas fa-eye',
          action: 'view-details',
          variant: 'primary' as const
        },
        {
          label: 'Reservar',
          icon: 'fas fa-calendar-check',
          action: 'book-now',
          variant: 'success' as const
        }
      ]
    }
  ];

  trackByHotelId(index: number, hotel: any): number {
    return hotel.id;
  }

  onCardClick(hotelId: number) {
    // Handle card click
  }

  onActionClick(action: string, hotelId: number) {
    switch(action) {
      case 'view-details':
        this.notificationService.info(`Ver detalles del hotel ${hotelId}`);
        break;
      case 'book-now':
        this.notificationService.info(`Reservar hotel ${hotelId}`);
        break;
    }
  }
}