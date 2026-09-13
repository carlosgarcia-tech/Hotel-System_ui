import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty notifications initially', () => {
    expect(service.notifications().length).toBe(0);
  });

  it('should add a notification', () => {
    service.show('Test message', 'info');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Test message');
    expect(service.notifications()[0].type).toBe('info');
  });

  it('should add success notification', () => {
    service.success('Success!');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('success');
  });

  it('should add error notification', () => {
    service.error('Error!');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('error');
  });

  it('should dismiss notification by id', () => {
    const id = service.show('Test');
    expect(service.notifications().length).toBe(1);

    service.dismiss(id);
    expect(service.notifications().length).toBe(0);
  });

  it('should auto-dismiss after duration', (done) => {
    service.show('Auto dismiss', 'info', 100);
    expect(service.notifications().length).toBe(1);

    setTimeout(() => {
      expect(service.notifications().length).toBe(0);
      done();
    }, 150);
  });

  it('should return notification id', () => {
    const id = service.show('Test');
    expect(id).toBeGreaterThan(0);
  });

  it('should increment notification ids', () => {
    const id1 = service.show('First');
    const id2 = service.show('Second');
    expect(id2).toBeGreaterThan(id1);
  });
});
