# IntelliPark Web

Frontend SPA para el sistema de gestión de parqueaderos **IntelliPark**, desarrollado con Angular como proyecto formativo del programa ADSO en el SENA.

---

## Tecnologías

| Tecnología          | Uso                                                  |
|---------------------|------------------------------------------------------|
| Angular 21          | Framework principal para la SPA                      |
| TypeScript 5.9      | Lenguaje tipado sobre JavaScript                     |
| RxJS 7.8            | Programación reactiva y manejo de observables        |
| Angular Router      | Navegación entre módulos y rutas protegidas          |
| ReactiveFormsModule | Formularios reactivos con validaciones               |
| HttpClient          | Consumo de la API REST del backend                   |
| Vitest              | Framework de pruebas unitarias                       |
| Prettier            | Formato de código                                    |
| Angular CLI 21      | Herramienta de desarrollo y build                    |

---

## Estructura del proyecto

```
intelliParkWeb/
├── src/
│   ├── enviroments/
│   │   └── environment.ts               # URL base de la API
│   ├── app/
│   │   ├── app.component.ts             # Componente raíz (<app-root>)
│   │   ├── app.config.ts                # Configuración global (HttpClient, Router, Zoneless CD)
│   │   ├── app.routes.ts                # Definición de rutas de la aplicación
│   │   ├── core/
│   │   │   └── auth/
│   │   │       ├── auth.guard.ts        # Guard que protege las rutas privadas
│   │   │       ├── auth.interceptor.ts  # Interceptor que adjunta el token Bearer
│   │   │       ├── auth.interface.ts    # Interfaces de autenticación (AuthUser, LoginRequest, etc.)
│   │   │       └── auth.service.ts      # Servicio de login, logout y sesión
│   │   ├── layouts/
│   │   │   ├── auth-layout/             # Contenedor visual para páginas de autenticación
│   │   │   └── dashboard-layout/        # Contenedor del panel con navegación lateral y logout
│   │   └── features/
│   │       ├── auth/login/              # Página de inicio de sesión
│   │       ├── password-recovery/       # Página de recuperación de contraseña
│   │       ├── dashboard/               # Panel de inicio con resumen operativo
│   │       ├── parking/                 # Gestión de ingresos y salidas de vehículos
│   │       ├── vehicles/                # Gestión del catálogo de vehículos
│   │       ├── payments/                # Gestión y consulta de pagos
│   │       ├── user/                    # Gestión de usuarios del sistema
│   │       └── reports/                 # Reporte de ingresos por rango de fechas
│   ├── styles.css                       # Estilos globales base
│   └── index.html                       # HTML raíz de la SPA
└── package.json
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v10 o superior (incluido con Node.js)
- Backend de IntelliPark corriendo en `http://localhost:3000`

---

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd intelliParkWeb
```

2. Instalar las dependencias:

```bash
npm install
```

3. Verificar la URL de la API en el archivo de entorno:

```
src/enviroments/environment.ts
```

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api'
};
```

---

## Ejecución

**Modo desarrollo:**

```bash
npm start
```

La aplicación se inicia por defecto en `http://localhost:4200`.

**Build de producción:**

```bash
npm run build
```

**Build en modo watch (desarrollo continuo):**

```bash
npm run watch
```

**Ejecutar pruebas unitarias:**

```bash
npm test
```

---

## Rutas de la aplicación

| Ruta          | Módulo                  | Protegida | Descripción                                   |
|---------------|-------------------------|:---------:|-----------------------------------------------|
| `/login`      | Auth / Login            | No        | Formulario de inicio de sesión                |
| `/recovery`   | Auth / Recuperación     | No        | Formulario de recuperación de contraseña      |
| `/dashboard`  | Dashboard               | Sí        | Panel de inicio con resumen operativo         |
| `/parking`    | Parking                 | Sí        | Registro de ingresos y salidas de vehículos   |
| `/vehicles`   | Vehículos               | Sí        | Listado, registro y búsqueda de vehículos     |
| `/payments`   | Pagos                   | Sí        | Registro y consulta de pagos                  |
| `/users`      | Usuarios                | Sí        | Gestión de usuarios (solo administrador)      |
| `/reports`    | Reportes                | Sí        | Reporte de ingresos por rango de fechas       |

> Las rutas protegidas requieren sesión activa. El `authGuard` redirige a `/login` si no hay token almacenado.

---

## Autenticación

El sistema utiliza **JWT** para proteger los recursos:

- Al iniciar sesión, el token y los datos del usuario se persisten en `localStorage`.
- El `authInterceptorFn` adjunta automáticamente el header `Authorization: Bearer <token>` en todas las peticiones privadas.
- Los endpoints públicos (`/auth/user-login`, `/auth/user-register`, `/auth/healt`) quedan excluidos del interceptor.
- El `authGuard` verifica la existencia del token antes de permitir el acceso a cualquier ruta protegida.

**Credenciales de prueba (definidas en el backend):**

```
Correo:     admin@demo.com
Contraseña: 123456
```

---

## Módulos implementados

- [x] Autenticación con JWT (login, logout, sesión persistente en localStorage)
- [x] Interceptor HTTP para token Bearer en peticiones protegidas
- [x] Guard de rutas privadas con redirección a `/login`
- [x] Layout de autenticación y layout del panel con navegación lateral
- [x] Módulo de Parqueo — check-in, check-out y listado de vehículos activos
- [x] Módulo de Vehículos — registrar, listar y buscar vehículo por placa
- [x] Módulo de Pagos — registrar, listar y buscar pago por ID de parqueo
- [x] Módulo de Usuarios — listar, consultar y activar/desactivar (solo administrador)
- [x] Módulo de Reportes — reporte de ingresos por rango de fechas con desglose por método de pago y tipo de vehículo

---

## Autores

Proyecto formativo desarrollado en el **SENA** — Programa **Análisis y Desarrollo de Software (ADSO)**.
