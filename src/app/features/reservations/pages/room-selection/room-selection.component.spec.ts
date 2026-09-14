import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { RoomSelectionComponent } from './room-selection.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../auth/services/auth.service';

describe('RoomSelectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSelectionComponent],
      providers: [provideZonelessChangeDetection(), 
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    const fixture = TestBed.createComponent(RoomSelectionComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with loading state', () => {
    const fixture = TestBed.createComponent(RoomSelectionComponent);
    expect(fixture.componentInstance.isLoading).toBeTrue();
  });

  it('should display room types correctly', () => {
    const fixture = TestBed.createComponent(RoomSelectionComponent);
    const component = fixture.componentInstance;
    expect(component.getRoomTypeDisplay('standard')).toBe('Estándar');
    expect(component.getRoomTypeDisplay('suite')).toBe('Suite');
    expect(component.getRoomTypeDisplay('deluxe')).toBe('Deluxe');
    expect(component.getRoomTypeDisplay('family')).toBe('Familiar');
    expect(component.getRoomTypeDisplay('executive')).toBe('Ejecutiva');
    expect(component.getRoomTypeDisplay('presidential')).toBe('Presidencial');
    expect(component.getRoomTypeDisplay('unknown')).toBe('unknown');
  });

  it('should display bed types correctly', () => {
    const fixture = TestBed.createComponent(RoomSelectionComponent);
    const component = fixture.componentInstance;
    expect(component.getBedTypeDisplay('king')).toBe('King Size');
    expect(component.getBedTypeDisplay('queen')).toBe('Queen Size');
    expect(component.getBedTypeDisplay('double')).toBe('Doble');
    expect(component.getBedTypeDisplay('single')).toBe('Individual');
    expect(component.getBedTypeDisplay('twin')).toBe('Gemelas');
  });

  it('should return sin información for empty bed config', () => {
    const fixture = TestBed.createComponent(RoomSelectionComponent);
    expect(fixture.componentInstance.getBedSummary(null)).toBe('Sin información');
    expect(fixture.componentInstance.getBedSummary({})).toBe('Sin información');
  });

  it('should format bed summary', () => {
    const fixture = TestBed.createComponent(RoomSelectionComponent);
    const result = fixture.componentInstance.getBedSummary({
      beds: [{ type: 'king', count: 1 }, { type: 'queen', count: 2 }],
    });
    expect(result).toBe('1 King Size, 2 Queen Size');
  });
});
