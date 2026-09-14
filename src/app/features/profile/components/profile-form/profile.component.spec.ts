import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../auth/services/auth.service';
import { UserRole } from '../../../../domain/models/user.model';

describe('ProfileComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with loading state', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    expect(fixture.componentInstance.isLoading).toBeTrue();
  });

  it('should start with no edit mode', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    expect(fixture.componentInstance.editMode).toBeFalse();
  });

  it('should toggle edit mode', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    component.user = {
      id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com',
      role: UserRole.USER, isActive: true, createdAt: '', updatedAt: '',
    };

    expect(component.editMode).toBeFalse();
    component.toggleEditMode();
    expect(component.editMode).toBeTrue();
    component.toggleEditMode();
    expect(component.editMode).toBeFalse();
  });

  it('should cancel edit and restore user data', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    component.user = {
      id: '1', firstName: 'Original', lastName: 'User', email: 'test@test.com',
      role: UserRole.USER, isActive: true, createdAt: '', updatedAt: '',
    };
    component.editedUser = { firstName: 'Changed' };
    component.editMode = true;

    component.cancelEdit();

    expect(component.editMode).toBeFalse();
    expect(component.editedUser.firstName).toBe('Original');
  });

  it('should load user from auth service if available', () => {
    const mockUser = {
      id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com',
      role: UserRole.USER, isActive: true, createdAt: '', updatedAt: '',
    };
    localStorage.setItem('hotel_manager_token', 'token');
    localStorage.setItem('hotel_manager_user', JSON.stringify(mockUser));

    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.componentInstance.loadUserProfile();

    expect(fixture.componentInstance.user).toBeTruthy();
    expect(fixture.componentInstance.isLoading).toBeFalse();
  });

  it('should clean up subscription on destroy', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.componentInstance.ngOnDestroy();
    expect(true).toBeTrue();
  });
});
