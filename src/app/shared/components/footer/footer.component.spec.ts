import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have current year', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance.currentYear).toBe(new Date().getFullYear());
  });

  it('should have social links', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance.socialLinks.length).toBe(4);
  });

  it('should have quick links', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance.quickLinks.length).toBe(4);
  });

  it('should have support links', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance.supportLinks.length).toBe(4);
  });

  it('should have contact info', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance.contactInfo).toBeTruthy();
    expect(fixture.componentInstance.contactInfo.email).toContain('@');
  });

  it('should render footer element', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('footer, .footer')).toBeTruthy();
  });
});
