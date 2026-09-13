# HotelManager - Sistema de Gestión Hotelera

Plataforma integral para la gestión de hoteles, habitaciones y reservas. Frontend construido con **Angular 20** con soporte SSR (Server-Side Rendering) y PWA.

[![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)](https://github.com/<owner>/<repo>/actions/workflows/ci.yml)

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Angular | 20.1.0 | Framework principal |
| Angular SSR | 20.1.6 | Server-Side Rendering |
| Express | 5.1.0 | Servidor Node.js (SSR) |
| RxJS | 7.8 | Programación reactiva |
| TypeScript | 5.8 | Tipado estático |
| SCSS | - | Estilos (dark-first design system) |
| Jasmine + Karma | 5.8 / 6.4 | Testing |

### Capacidades

- **Zoneless Change Detection**: Angular signals sin dependencia de Zone.js
- **PWA**: Service Worker configurado para funcionamiento offline
- **SSR + Prerendering**: Rutas públicas prerenderizadas, rutas dinámicas en servidor
- **Lazy Loading**: Todos los módulos de features cargados bajo demanda
- **Formularios Reactivos**: Validación robusta en login, registro y reservas
- **Standalone Components**: Sin NgModules, todo modular y tree-shakeable
- **Functional Guards/Interceptors**: Patrones modernos de Angular

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                          # Lógica transversal
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Guard de autenticación + roles
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts    # JWT Bearer token
│   │   │   └── error.interceptor.ts   # Manejo de errores HTTP
│   │   └── services/
│   │       └── notification.service.ts # Toast notifications (signals)
│   ├── domain/
│   │   └── models/                    # Interfaces y tipos
│   │       ├── user.model.ts
│   │       ├── hotel.model.ts
│   │       ├── room.model.ts
│   │       ├── reservation.model.ts
│   │       └── promotion.model.ts
│   ├── features/
│   │   ├── auth/                      # Autenticación
│   │   │   ├── components/
│   │   │   │   ├── login/             # Reactive Forms
│   │   │   │   └── register/          # Template-driven Forms
│   │   │   └── services/
│   │   │       └── auth.service.ts    # JWT, login, registro, perfil
│   │   ├── home/                      # Landing page
│   │   │   └── pages/home/
│   │   ├── hotels/                    # Dashboard de hoteles
│   │   │   ├── pages/hotels-dashboard/
│   │   │   └── services/
│   │   │       ├── hotels.service.ts
│   │   │       └── rooms.service.ts
│   │   ├── reservations/              # Gestión de reservas
│   │   │   ├── pages/
│   │   │   │   ├── create-reservation/
│   │   │   │   ├── reservations/      # Mis reservas
│   │   │   │   └── room-selection/
│   │   │   └── services/
│   │   │       └── reservation.service.ts
│   │   └── profile/                   # Perfil de usuario
│   │       └── components/profile-form/
│   └── shared/                        # Componentes reutilizables
│       ├── components/
│       │   ├── card/                  # Card reutilizable (6 variantes)
│       │   ├── header/                # Navbar responsive
│       │   ├── footer/                # Footer multi-columna
│       │   ├── toast/                 # Notificaciones toast
│       │   ├── not-found/             # Página 404
│       │   └── unauthorized/          # Página 403
│       └── styles/
│           ├── animations.scss        # Keyframes + utilidades
│           └── auth-shared.scss       # Estilos compartidos auth
├── environments/
│   ├── environment.ts                 # Dev (localhost:3000/api)
│   ├── environment.prod.ts            # Prod (api.hotelmanager.com)
│   └── environment.staging.ts         # Staging
├── app.routes.ts                      # Definición de rutas (client)
├── app.routes.server.ts               # Render modes SSR
├── app.config.ts                      # Configuración cliente
├── app.config.server.ts               # Configuración servidor
├── server.ts                          # Express server (SSR)
├── main.ts                            # Bootstrap client
├── main.server.ts                     # Bootstrap server
└── styles.scss                        # Design system + tokens
```

## Rutas Principales

| Ruta | Componente | Protegida | Render Mode |
|---|---|---|---|
| `/` | HomeComponent | No | Prerender |
| `/hotels` | HotelsDashboardComponent | No | Prerender |
| `/rooms/:hotelId` | RoomSelectionComponent | authGuard | Server |
| `/reservations/create/:hotelId/:roomId` | CreateReservationComponent | authGuard | Server |
| `/reservations/my-reservations` | MyReservationsComponent | authGuard | - |
| `/profile` | ProfileComponent | authGuard | Server |
| `/auth/login` | LoginComponent | No | Prerender |
| `/auth/register` | RegisterComponent | No | Prerender |
| `/404` | NotFoundComponent | No | Prerender |

## Modelos de Dominio

### Hotel
Información completa: nombre, dirección, contacto, amenities, rating, precio. Soporte para búsqueda por ubicación, precio, rating y amenities.

### Room
Tipos: estándar, suite, deluxe, familiar, ejecutiva, presidencial. Capacidad, configuración de camas, precio base con impuestos. Features: balcón, cocina, vista al mar, accesibilidad, etc.

### User
Roles: `ADMIN`, `MANAGER`, `USER`. Perfil: nombre, email, teléfono, dirección.

### Reservation
Estados: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`. Fechas de check-in/check-out, datos del huésped, monto total.

### Promotion
Tipos: `PERCENTAGE`, `FIXED_AMOUNT`, `FREE_NIGHTS`. Fechas de vigencia, hoteles aplicables, descuento máximo.

## API Endpoints Consumidos

### Auth
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Inicio de sesión |
| `GET` | `/api/auth/profile` | Obtener perfil |
| `POST` | `/api/users/register` | Registro de usuario |
| `PUT` | `/api/users/:id` | Actualizar usuario |

### Hotels
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/hotels` | Listar todos los hoteles |
| `GET` | `/api/hotels/:id` | Detalle de hotel |
| `GET` | `/api/hotels/search` | Búsqueda con filtros |
| `GET` | `/api/hotels/city/:city` | Hoteles por ciudad |
| `GET` | `/api/hotels/near/:lat/:lng` | Hoteles cercanos |

### Rooms
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/rooms/hotel/:hotelId` | Habitaciones por hotel |
| `GET` | `/api/rooms/:roomId` | Detalle de habitación |
| `GET` | `/api/rooms/hotel/:hotelId/available` | Habitaciones disponibles |

### Reservations
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/reservations/hotel/:hotelId/room/:roomId` | Crear reserva |
| `GET` | `/api/reservations/my-reservations` | Mis reservas |
| `PATCH` | `/api/reservations/:id/cancel` | Cancelar reserva |

## Configuración

### Variables de Entorno

El API backend se consume desde:
```
Desarrollo:  http://localhost:3000/api
Staging:     https://staging-api.hotelmanager.com/api
Producción:  https://api.hotelmanager.com/api
```

### Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve

# Construcción de producción
ng build

# Ejecutar tests
ng test

# Ejecutar SSR
node dist/capstone-frontend/server/server.mjs
```

### Docker

```bash
# Construir imagen
docker build -t hotel-manager .

# Ejecutar
docker run -p 4000:4000 hotel-manager
```

### Autenticación

El sistema utiliza JWT con refresh tokens almacenados en localStorage:
- Token de acceso para peticiones API
- Refresh token para renovación automática
- Interceptor HTTP agrega `Authorization: Bearer` a cada petición
- Manejo automático de sesión expirada (redirect a login)

### Roles y Permisos

| Rol | Acceso |
|---|---|
| ADMIN | Todo el sistema |
| MANAGER | Gestión de hoteles asignados |
| USER | Reservar y ver sus propias reservas |

## CI/CD

### GitHub Actions

El pipeline ejecuta automáticamente en cada push y PR a `master`:

1. **Build & Test**
   - Instalación de dependencias con cache
   - Build de producción (`ng build`)
   - Ejecución de tests (`ng test --watch=false --browsers=ChromeHeadless`)

2. **Docker Build & Push** (solo en push a master)
   - Build de imagen multi-stage
   - Push a GitHub Container Registry (`ghcr.io`)
   - Tags: `latest` + SHA del commit
   - Cache de capas con GitHub Actions cache

### Imagen Docker

```bash
# Pull latest
docker pull ghcr.io/<owner>/<repo>:latest

# Run
docker run -p 4000:4000 ghcr.io/<owner>/<repo>:latest
```

## Arquitectura y Patrones

- **Standalone Components**: Sin NgModules, todo modular y tree-shakeable
- **Lazy Loading**: Todas las rutas de features usan `loadComponent`
- **Functional Guards/Interceptors**: Patrones modernos de Angular (no class-based)
- **Zoneless Change Detection**: `provideZonelessChangeDetection()` con Angular signals
- **Signal-based State**: `NotificationService` usa `signal()`, root component usa `signal()` para título
- **Platform Awareness**: Múltiples componentes verifican `isPlatformBrowser()` antes de acceder a localStorage
- **SSR con Render Modes Mixtos**: Públicas prerenderizadas, protegidas server-rendered
- **Dark-First Design**: Tema oscuro completo con CSS custom properties (sin light mode)
- **Design System**: Tokens de diseño (colores, spacing, typography, shadows, transitions) en `styles.scss`

## Contribuir

1. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
2. Hacer commits con mensajes descriptivos
3. Abrir un Pull Request (el CI se ejecuta automáticamente)

## Licencia

Proyecto privado - Capstone Frontend
