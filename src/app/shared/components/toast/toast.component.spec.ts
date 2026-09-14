import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ToastComponent } from './toast.component';
import { NotificationService } from '../../../core/services/notification.service';

describe('ToastComponent', () => {
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ToastComponent],
    }).compileComponents();
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have no notifications initially', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.notifications().length).toBe(0);
  });

  it('should display notifications', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    notificationService.show('Test message', 'info');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.toast-message')?.textContent).toContain('Test message');
  });

  it('should dismiss notification', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    const id = notificationService.show('Test', 'success');
    fixture.detectChanges();
    expect(fixture.componentInstance.notifications().length).toBe(1);

    fixture.componentInstance.dismiss(id);
    fixture.detectChanges();
    expect(fixture.componentInstance.notifications().length).toBe(0);
  });

  it('should display multiple notifications', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    notificationService.show('First', 'info');
    notificationService.show('Second', 'error');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.toast').length).toBe(2);
  });

  it('should apply correct CSS class for type', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    notificationService.show('Error!', 'error');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.toast-error')).toBeTruthy();
  });

  it('should have close button', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    notificationService.show('Test', 'info');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.toast-close')).toBeTruthy();
  });
});
