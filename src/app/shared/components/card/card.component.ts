import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface CardAction {
  label: string;
  icon: string;
  action: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  disabled?: boolean;
}

export interface CardBadge {
  text: string;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = '';

  @Input() badges: CardBadge[] = [];
  @Input() price: number | null = null;
  @Input() currency: string = '';
  @Input() rating: number | null = null;
  @Input() maxRating: number = 5;

  @Input() actions: CardAction[] = [];
  @Input() routerLink: string | string[] | null = null;
  @Input() href: string | null = null;

  @Input() variant: 'default' | 'hotel' | 'room' | 'reservation' | 'promotion' | 'user' = 'default';
  @Input() isLoading: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isHighlighted: boolean = false;

  @Input() showHeader: boolean = true;
  @Input() showImage: boolean = true;
  @Input() showContent: boolean = true;
  @Input() showActions: boolean = true;
  @Input() showFooter: boolean = true;

  @Output() cardClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<string>();

  onCardClick(event: Event) {
    if (!this.isDisabled && !this.routerLink && !this.href) {
      event.preventDefault();
      this.cardClick.emit();
    }
  }

  onActionClick(event: Event, action: string) {
    event.stopPropagation();
    if (!this.isDisabled) {
      this.actionClick.emit(action);
    }
  }

  getRatingStars(): { filled: boolean; half: boolean }[] {
    if (!this.rating) return [];
    
    const stars = [];
    const fullStars = Math.floor(this.rating);
    const hasHalfStar = this.rating % 1 !== 0;
    
    for (let i = 0; i < this.maxRating; i++) {
      stars.push({
        filled: i < fullStars,
        half: i === fullStars && hasHalfStar
      });
    }
    
    return stars;
  }

  getBadgeClass(variant: string): string {
    return `badge badge-${variant}`;
  }

  getActionClass(variant: string = 'primary'): string {
    return `btn btn-${variant}`;
  }

  getAccentBadgeIndex(): number {
    const accentVariants = ['primary', 'warning'];
    const idx = this.badges.findIndex(b => accentVariants.includes(b.variant));
    return idx >= 0 ? idx : -1;
  }
}