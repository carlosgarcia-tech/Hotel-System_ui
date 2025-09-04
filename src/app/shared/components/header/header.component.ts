import { Component, OnInit, inject, OnDestroy, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AuthService, UserRole } from '../../../features/auth/services/auth.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private routerSub!: Subscription;
  private authSub!: Subscription;

  @Output() filterChange = new EventEmitter<{ type: string; value: string }>();

  isAuthenticated = false;
  currentUser: any = null;
  isMenuOpen = false;
  showFilters = false;
  UserRole = UserRole;
  isLoading = true;
  filterCities: string[] = [];
  authChecked = false;

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser()) {
      this.isLoading = false;
      this.authChecked = true;
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUser = currentUser;
      this.isAuthenticated = true;
      this.isLoading = false;
      this.authChecked = true;
    }

    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isLoading = false;
      this.authChecked = true;
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.isLoading = false;
        this.showFilters = event.urlAfterRedirects === '/hotels';
        this.isMenuOpen = false;
      }
    });

    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.authChecked = true;
      }
    }, 1000); 
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    if (!this.isBrowser()) return;
    
    this.isLoading = true;
    this.authService.logout();
    
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    });
    
    this.isMenuOpen = false;
  }

  hasRole(role: UserRole): boolean {
    return this.authService.hasRole(role);
  }

  onFilterChange(type: string, value: string) {
    this.filterChange.emit({ type, value });
  }

  updateFilterCities(cities: string[]) {
    this.filterCities = cities;
  }

  navigateToProfile() {
    if (this.isAuthenticated) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}