import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'hotels',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth/login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth/register',
    renderMode: RenderMode.Prerender
  },
  {
    path: '404',
    renderMode: RenderMode.Prerender
  },
  
  {
    path: 'rooms/:hotelId',
    renderMode: RenderMode.Server
  },
  {
    path: 'reservations/create/:hotelId/:roomId',
    renderMode: RenderMode.Server
  },
  {
    path: 'profile',
    renderMode: RenderMode.Server
  },
  
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];