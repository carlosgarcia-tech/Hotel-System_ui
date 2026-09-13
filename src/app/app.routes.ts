import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'hotels',
    loadComponent: () =>
      import('./features/hotels/pages/hotels-dashboard/hotels-dashboard.component').then(
        (m) => m.HotelsDashboardComponent
      ),
  },
  {
    path: 'rooms/:hotelId',
    loadComponent: () =>
      import('./features/reservations/pages/room-selection/room-selection.component').then(
        (m) => m.RoomSelectionComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'reservations/create/:hotelId/:roomId',
    loadComponent: () =>
      import('./features/reservations/pages/create-reservation/create-reservation.component').then(
        (m) => m.CreateReservationComponent
      ),
    canActivate: [authGuard],
  },  
  {
    path: 'reservations/my-reservations',
    loadComponent: () =>
      import('./features/reservations/pages/reservations/my-reservations.component').then(
        (m) => m.MyReservationsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('../app/features/auth/components/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../app/features/auth/components/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/components/profile-form/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
