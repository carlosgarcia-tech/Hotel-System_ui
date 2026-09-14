import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HotelsDashboardComponent } from './hotels-dashboard.component';
import { HotelsService } from '../../services/hotels.service';
import { Hotel } from '../../../../domain/models/hotel.model';

describe('HotelsDashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelsDashboardComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with loading state', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    expect(fixture.componentInstance.isLoading).toBeTrue();
  });

  it('should have empty hotels initially', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    expect(fixture.componentInstance.hotels.length).toBe(0);
  });

  it('should have default filter values', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const component = fixture.componentInstance;
    expect(component.searchQuery).toBe('');
    expect(component.selectedMinRating).toBeNull();
    expect(component.selectedCity).toBe('');
    expect(component.selectedSort).toBe('name-asc');
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(12);
  });

  it('should have sort options', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    expect(fixture.componentInstance.sortOptions.length).toBe(6);
  });

  it('should have price ranges', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    expect(fixture.componentInstance.priceRanges.length).toBe(4);
  });

  it('should clear filters', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const component = fixture.componentInstance;
    component.searchQuery = 'test';
    component.selectedMinRating = 4;
    component.selectedCity = 'Miami';

    component.clearFilters();

    expect(component.searchQuery).toBe('');
    expect(component.selectedMinRating).toBeNull();
    expect(component.selectedCity).toBe('');
    expect(component.selectedSort).toBe('name-asc');
  });

  it('should calculate total pages', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const component = fixture.componentInstance;
    component.filteredHotels = new Array(25);
    component.itemsPerPage = 12;
    component.calculateTotalPages();
    expect(component.totalPages).toBe(3);
  });

  it('should get paginated hotels', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const component = fixture.componentInstance;
    component.filteredHotels = [
      { id: '1', name: 'A' } as Hotel,
      { id: '2', name: 'B' } as Hotel,
      { id: '3', name: 'C' } as Hotel,
    ];
    component.itemsPerPage = 2;
    component.currentPage = 1;
    expect(component.paginatedHotels.length).toBe(2);

    component.currentPage = 2;
    expect(component.paginatedHotels.length).toBe(1);
  });

  it('should navigate pages', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const component = fixture.componentInstance;
    component.totalPages = 3;
    component.currentPage = 1;

    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.nextPage();
    expect(component.currentPage).toBe(3);

    component.nextPage();
    expect(component.currentPage).toBe(3);

    component.prevPage();
    expect(component.currentPage).toBe(2);

    component.prevPage();
    expect(component.currentPage).toBe(1);

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should go to specific page', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const component = fixture.componentInstance;
    component.totalPages = 5;

    component.goToPage(3);
    expect(component.currentPage).toBe(3);

    component.goToPage(0);
    expect(component.currentPage).toBe(3);

    component.goToPage(6);
    expect(component.currentPage).toBe(3);
  });

  it('should get card badges for top rated hotel', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const hotel = {
      rating: { averageRating: 4.8 },
      availableRooms: 10,
      amenities: [],
    } as unknown as Hotel;

    const badges = fixture.componentInstance.getCardBadges(hotel);
    expect(badges.some((b: any) => b.text === 'Top Rated')).toBeTrue();
  });

  it('should get card badges for almost full hotel', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const hotel = {
      rating: { averageRating: 3.0 },
      availableRooms: 2,
      amenities: [],
    } as unknown as Hotel;

    const badges = fixture.componentInstance.getCardBadges(hotel);
    expect(badges.some((b: any) => b.text === 'Almost Full')).toBeTrue();
  });

  it('should get card actions', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const hotel = { id: '1' } as Hotel;
    const actions = fixture.componentInstance.getCardActions(hotel);
    expect(actions.length).toBe(2);
    expect(actions[0].action).toBe('view-details');
    expect(actions[1].action).toBe('book-now');
  });

  it('should parse price range from value', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const range = fixture.componentInstance.getPriceRangeFromValue('100-200');
    expect(range).toEqual({ min: 100, max: 200, currency: 'USD' });
  });

  it('should return null for empty price range value', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    expect(fixture.componentInstance.getPriceRangeFromValue('')).toBeNull();
  });

  it('should sort hotels by name ascending', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const component = fixture.componentInstance;
    component.selectedSort = 'name-asc';
    const hotels = [
      { name: 'Charlie' } as Hotel,
      { name: 'Alpha' } as Hotel,
      { name: 'Bravo' } as Hotel,
    ];

    component.sortHotels(hotels);
    expect(hotels[0].name).toBe('Alpha');
    expect(hotels[2].name).toBe('Charlie');
  });

  it('should sort hotels by price descending', () => {
    const fixture = TestBed.createComponent(HotelsDashboardComponent);
    const component = fixture.componentInstance;
    component.selectedSort = 'price-desc';
    const hotels = [
      { priceRange: { min: 100, max: 200 } } as Hotel,
      { priceRange: { min: 300, max: 400 } } as Hotel,
      { priceRange: { min: 200, max: 300 } } as Hotel,
    ];

    component.sortHotels(hotels);
    expect((hotels[0].priceRange as any).max).toBe(400);
  });
});
