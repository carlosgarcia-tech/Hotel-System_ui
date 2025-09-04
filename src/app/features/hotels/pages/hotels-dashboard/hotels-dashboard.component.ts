import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HotelsService } from '../../services/hotels.service';
import { Hotel, HotelSearchCriteria, HotelPriceRange } from '../../../../domain/models/hotel.model';
import {
  CardComponent,
  CardAction,
  CardBadge,
} from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-hotels-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CardComponent],
  templateUrl: './hotels-dashboard.component.html',
  styleUrls: ['./hotels-dashboard.component.scss'],
})
export class HotelsDashboardComponent implements OnInit, OnDestroy {
  private hotelsService = inject(HotelsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  isLoading = true;
  error: string | null = null;
  searchQuery = '';
  selectedMinRating: number | null = null;
  selectedCity: string = '';
  selectedPriceRange: HotelPriceRange | null = null;
  selectedAmenities: string[] = [];
  searchCriteria: HotelSearchCriteria = {};
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  cities: string[] = [];
  amenities: string[] = [];

  private subscription?: Subscription;

  priceRanges = [
    { label: 'Under $100', min: 0, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $300', min: 200, max: 300 },
    { label: 'Over $300', min: 300, max: 1000 },
  ];

  sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'rating-asc', label: 'Lowest Rated' },
  ];

  selectedSort = 'name-asc';

  ngOnInit() {
    this.loadHotels();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadHotels() {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.hotelsService.getAllHotels().subscribe({
      next: (response) => {
        if (response && response.success) {
          this.hotels = response.data || [];
          this.filteredHotels = [...this.hotels];
          this.extractFilterOptions();
          this.applyFilters();
          this.calculateTotalPages();
        } else {
          this.error = response?.message || 'Failed to load hotels';
          this.cdr.detectChanges();
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load hotels';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {},
    });

    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        if (!this.error) {
          this.error = 'Request timeout. Please try again.';
        }
        this.cdr.detectChanges();
      }
    }, 10000);
  }

  onMinRatingChange(value: string) {
    this.selectedMinRating = value ? Number(value) : null;
    this.updateSearchCriteria();
    this.applyFilters();
  }

  onCityChange(value: string) {
    this.selectedCity = value;
    this.updateSearchCriteria();
    this.applyFilters();
  }

  onPriceRangeChange(value: string) {
    this.selectedPriceRange = this.getPriceRangeFromValue(value);
    this.updateSearchCriteria();
    this.applyFilters();
  }

  onAmenitiesChange(event: any) {
    const options = event.target.options;
    this.selectedAmenities = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        this.selectedAmenities.push(options[i].value);
      }
    }
    this.updateSearchCriteria();
    this.applyFilters();
  }

  getPriceRangeFromValue(value: string): HotelPriceRange | null {
    if (!value) return null;
    const [min, max] = value.split('-').map(Number);
    return { min, max, currency: 'USD' };
  }

  getPriceRangeValue(range: HotelPriceRange | null): string {
    if (!range) return '';
    return `${range.min}-${range.max}`;
  }

  updateSearchCriteria() {
    this.searchCriteria = {
      minRating: this.selectedMinRating !== null ? this.selectedMinRating : undefined,
      location: this.selectedCity ? { city: this.selectedCity } : undefined,
      priceRange: this.selectedPriceRange || undefined,
      amenities: this.selectedAmenities.length > 0 ? this.selectedAmenities : undefined,
    };
  }

  extractFilterOptions() {
    this.cities = [...new Set(this.hotels.map((hotel) => hotel.address.city))].sort();
    const allAmenities = this.hotels.flatMap((hotel) =>
      hotel.amenities.map((amenity) => amenity.name)
    );
    this.amenities = [...new Set(allAmenities)].sort();
  }

  applyFilters() {
    let filtered = [...this.hotels];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(query) ||
          hotel.description.toLowerCase().includes(query) ||
          hotel.address.city.toLowerCase().includes(query)
      );
    }

    if (this.searchCriteria.minRating) {
      filtered = filtered.filter(
        (hotel) => hotel.rating.averageRating >= this.searchCriteria.minRating!
      );
    }

    if (this.searchCriteria.location?.city) {
      filtered = filtered.filter(
        (hotel) => hotel.address.city === this.searchCriteria.location!.city
      );
    }

    if (this.searchCriteria.priceRange?.min !== undefined) {
      filtered = filtered.filter(
        (hotel) => hotel.priceRange.min >= this.searchCriteria.priceRange!.min!
      );
    }

    if (this.searchCriteria.priceRange?.max !== undefined) {
      filtered = filtered.filter(
        (hotel) => hotel.priceRange.max <= this.searchCriteria.priceRange!.max!
      );
    }

    if (this.searchCriteria.amenities?.length) {
      filtered = filtered.filter((hotel) =>
        this.searchCriteria.amenities!.every((amenity) =>
          hotel.amenities.some((a) => a.name === amenity)
        )
      );
    }

    this.sortHotels(filtered);
    this.filteredHotels = filtered;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  sortHotels(hotels: Hotel[]) {
    switch (this.selectedSort) {
      case 'name-asc':
        hotels.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        hotels.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        hotels.sort((a, b) => a.priceRange.min - b.priceRange.min);
        break;
      case 'price-desc':
        hotels.sort((a, b) => b.priceRange.max - a.priceRange.max);
        break;
      case 'rating-desc':
        hotels.sort((a, b) => b.rating.averageRating - a.rating.averageRating);
        break;
      case 'rating-asc':
        hotels.sort((a, b) => a.rating.averageRating - b.rating.averageRating);
        break;
    }
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredHotels.length / this.itemsPerPage);
  }

  get paginatedHotels(): Hotel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredHotels.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSearch() {
    this.updateSearchCriteria();
    this.applyFilters();
  }

  getPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i);
  }

  onSortChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedMinRating = null;
    this.selectedCity = '';
    this.selectedPriceRange = null;
    this.selectedAmenities = [];
    this.selectedSort = 'name-asc';
    this.searchCriteria = {};
    this.applyFilters();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getCardActions(hotel: Hotel): CardAction[] {
    return [
      {
        label: 'View Details',
        icon: 'fas fa-eye',
        action: 'view-details',
        variant: 'primary' as const,
      },
      {
        label: 'Book Now',
        icon: 'fas fa-calendar-check',
        action: 'book-now',
        variant: 'success' as const,
      },
    ];
  }

  getCardBadges(hotel: Hotel): CardBadge[] {
    const badges: CardBadge[] = [];
    if (hotel.rating.averageRating >= 4.5) {
      badges.push({ text: 'Top Rated', variant: 'success' });
    }
    if (hotel.availableRooms < 5) {
      badges.push({ text: 'Almost Full', variant: 'warning' });
    }
    if (hotel.amenities.some((a) => a.category === 'luxury')) {
      badges.push({ text: 'Luxury', variant: 'primary' });
    }
    return badges;
  }

  onCardAction(action: string, hotelId: string) {
    switch (action) {
      case 'view-details':
        console.log('View details for hotel:', hotelId);
        break;
      case 'book-now':
        this.bookHotel(hotelId);
        break;
    }
  }

  bookHotel(hotelId: string) {
    this.router.navigate(['/rooms', hotelId]);
  }
}