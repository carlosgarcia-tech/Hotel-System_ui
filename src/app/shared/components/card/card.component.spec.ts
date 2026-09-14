import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CardComponent, CardAction, CardBadge } from './card.component';

describe('CardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have default input values', () => {
    const fixture = TestBed.createComponent(CardComponent);
    const card = fixture.componentInstance;
    expect(card.title).toBe('');
    expect(card.subtitle).toBe('');
    expect(card.description).toBe('');
    expect(card.price).toBeNull();
    expect(card.rating).toBeNull();
    expect(card.maxRating).toBe(5);
    expect(card.variant).toBe('default');
    expect(card.isLoading).toBeFalse();
    expect(card.isDisabled).toBeFalse();
    expect(card.isHighlighted).toBeFalse();
  });

  it('should emit cardClick when clicked and not disabled', () => {
    const fixture = TestBed.createComponent(CardComponent);
    const card = fixture.componentInstance;
    spyOn(card.cardClick, 'emit');

    card.onCardClick(new Event('click'));

    expect(card.cardClick.emit).toHaveBeenCalled();
  });

  it('should not emit cardClick when disabled', () => {
    const fixture = TestBed.createComponent(CardComponent);
    const card = fixture.componentInstance;
    card.isDisabled = true;
    spyOn(card.cardClick, 'emit');

    card.onCardClick(new Event('click'));

    expect(card.cardClick.emit).not.toHaveBeenCalled();
  });

  it('should not emit cardClick when has routerLink', () => {
    const fixture = TestBed.createComponent(CardComponent);
    const card = fixture.componentInstance;
    card.routerLink = '/some-route';
    spyOn(card.cardClick, 'emit');

    card.onCardClick(new Event('click'));

    expect(card.cardClick.emit).not.toHaveBeenCalled();
  });

  it('should emit actionClick with action name', () => {
    const fixture = TestBed.createComponent(CardComponent);
    const card = fixture.componentInstance;
    spyOn(card.actionClick, 'emit');

    card.onActionClick(new Event('click'), 'book-now');

    expect(card.actionClick.emit).toHaveBeenCalledWith('book-now');
  });

  it('should not emit actionClick when disabled', () => {
    const fixture = TestBed.createComponent(CardComponent);
    const card = fixture.componentInstance;
    card.isDisabled = true;
    spyOn(card.actionClick, 'emit');

    card.onActionClick(new Event('click'), 'book-now');

    expect(card.actionClick.emit).not.toHaveBeenCalled();
  });

  it('should return empty stars when no rating', () => {
    const fixture = TestBed.createComponent(CardComponent);
    expect(fixture.componentInstance.getRatingStars()).toEqual([]);
  });

  it('should calculate rating stars correctly', () => {
    const fixture = TestBed.createComponent(CardComponent);
    const card = fixture.componentInstance;
    card.rating = 3.5;
    card.maxRating = 5;

    const stars = card.getRatingStars();

    expect(stars.length).toBe(5);
    expect(stars[0].filled).toBeTrue();
    expect(stars[1].filled).toBeTrue();
    expect(stars[2].filled).toBeTrue();
    expect(stars[3].filled).toBeFalse();
    expect(stars[3].half).toBeTrue();
    expect(stars[4].filled).toBeFalse();
    expect(stars[4].half).toBeFalse();
  });

  it('should return correct badge class', () => {
    const fixture = TestBed.createComponent(CardComponent);
    expect(fixture.componentInstance.getBadgeClass('primary')).toBe('badge badge-primary');
    expect(fixture.componentInstance.getBadgeClass('success')).toBe('badge badge-success');
  });

  it('should return correct action class', () => {
    const fixture = TestBed.createComponent(CardComponent);
    expect(fixture.componentInstance.getActionClass('primary')).toBe('btn btn-primary');
    expect(fixture.componentInstance.getActionClass('danger')).toBe('btn btn-danger');
  });

  it('should find accent badge index', () => {
    const fixture = TestBed.createComponent(CardComponent);
    const card = fixture.componentInstance;

    card.badges = [
      { text: 'A', variant: 'success' },
      { text: 'B', variant: 'primary' },
    ];
    expect(card.getAccentBadgeIndex()).toBe(1);

    card.badges = [
      { text: 'A', variant: 'warning' },
      { text: 'B', variant: 'secondary' },
    ];
    expect(card.getAccentBadgeIndex()).toBe(0);

    card.badges = [
      { text: 'A', variant: 'success' },
      { text: 'B', variant: 'danger' },
    ];
    expect(card.getAccentBadgeIndex()).toBe(-1);
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CardComponent);
    fixture.componentInstance.title = 'Hotel Paradise';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title')?.textContent).toContain('Hotel Paradise');
  });
});
