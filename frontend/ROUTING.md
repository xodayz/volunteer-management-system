# 🛣️ Sistema de Rutas en Astro

## Estructura de Rutas Actual del Proyecto

```
src/pages/
├── index.astro                    → /                (Landing Page)
├── login.astro                    → /login           (Página de Login)
├── register.astro                 → /register        (Página de Registro)
├── dashboard.astro                → /dashboard       (Dashboard Principal)
└── dashboard/
    ├── opportunities.astro        → /dashboard/opportunities
    ├── my-activities.astro        → /dashboard/my-activities (por crear)
    └── profile.astro              → /dashboard/profile (por crear)
```

## ¿Cómo Funciona el Routing en Astro?

### 1. **File-Based Routing**
Astro usa el directorio `src/pages/` para generar rutas automáticamente:

- `src/pages/index.astro` → `https://tu-dominio.com/`
- `src/pages/about.astro` → `https://tu-dominio.com/about`
- `src/pages/contact.astro` → `https://tu-dominio.com/contact`

### 2. **Rutas Anidadas**
Las carpetas dentro de `pages/` crean rutas anidadas:

```
src/pages/
├── blog/
│   ├── index.astro      → /blog
│   ├── post-1.astro     → /blog/post-1
│   └── category/
│       └── tech.astro   → /blog/category/tech
```

### 3. **Rutas Dinámicas**
Usa corchetes `[]` para crear rutas dinámicas:

```
src/pages/
├── users/
│   └── [id].astro       → /users/123, /users/456, etc.
├── blog/
│   └── [slug].astro     → /blog/mi-post, /blog/otro-post
└── shop/
    └── [category]/
        └── [product].astro → /shop/ropa/camisa, /shop/tech/laptop
```

### 4. **Rest Parameters**
Usa `[...param]` para capturar múltiples segmentos:

```
src/pages/
└── [...path].astro      → /cualquier/ruta/que/quieras
```

## Ejemplos Prácticos para tu Sistema de Voluntariado

### 1. **Rutas de Organizaciones**
```
src/pages/
└── organizations/
    ├── index.astro           → /organizations (Listar todas)
    ├── [id].astro           → /organizations/123 (Perfil organización)
    └── [id]/
        ├── opportunities.astro → /organizations/123/opportunities
        └── volunteers.astro    → /organizations/123/volunteers
```

### 2. **Rutas de Eventos/Oportunidades**
```
src/pages/
└── opportunities/
    ├── index.astro          → /opportunities (Listar todas)
    ├── [id].astro          → /opportunities/456 (Detalle)
    ├── create.astro        → /opportunities/create
    └── category/
        └── [type].astro    → /opportunities/category/ambiente
```

### 3. **Rutas de Usuario**
```
src/pages/
└── user/
    ├── profile.astro       → /user/profile
    ├── settings.astro      → /user/settings
    ├── certificates.astro  → /user/certificates
    └── history.astro       → /user/history
```

## Navegación entre Rutas

### En Componentes Astro:
```astro
<a href="/dashboard">Ir al Dashboard</a>
<a href="/dashboard/opportunities">Ver Oportunidades</a>
<a href="/organizations/123">Ver Organización</a>
```

### En Componentes React:
```tsx
// Para navegación simple
<a href="/dashboard">Dashboard</a>

// Si necesitas navegación programática, puedes usar:
window.location.href = '/dashboard';
```

## Obtener Parámetros de Ruta

### En páginas dinámicas:
```astro
---
// src/pages/users/[id].astro
const { id } = Astro.params;
console.log(id); // "123" si la URL es /users/123
---

<h1>Usuario ID: {id}</h1>
```

### Con múltiples parámetros:
```astro
---
// src/pages/[category]/[product].astro
const { category, product } = Astro.params;
---

<h1>Categoría: {category}</h1>
<h2>Producto: {product}</h2>
```

## Query Parameters y Search Params

```astro
---
// Acceder a ?search=voluntario&location=santo-domingo
const url = new URL(Astro.request.url);
const search = url.searchParams.get('search');
const location = url.searchParams.get('location');
---
```

## Redirects

### En el archivo de configuración `astro.config.mjs`:
```javascript
export default defineConfig({
  redirects: {
    '/old-page': '/new-page',
    '/dashboard/home': '/dashboard',
  }
});
```

### En páginas individuales:
```astro
---
// Redirect programático
if (!user.isLoggedIn) {
  return Astro.redirect('/login');
}
---
```

## Estructura Recomendada para tu Proyecto

```
src/pages/
├── index.astro                    # Landing page
├── login.astro                    # Login
├── register.astro                 # Registro
├── dashboard/
│   ├── index.astro               # Dashboard principal
│   ├── opportunities.astro       # Lista de oportunidades
│   ├── my-activities.astro       # Mis actividades
│   └── profile.astro            # Mi perfil
├── organizations/
│   ├── index.astro              # Lista de organizaciones
│   ├── [id].astro               # Perfil de organización
│   └── register.astro           # Registro de organización
├── opportunities/
│   ├── index.astro              # Lista de oportunidades públicas
│   ├── [id].astro               # Detalle de oportunidad
│   └── category/
│       └── [type].astro         # Oportunidades por categoría
├── admin/
│   ├── index.astro              # Panel admin
│   ├── users.astro              # Gestión usuarios
│   └── organizations.astro       # Gestión organizaciones
└── api/                         # API endpoints (opcional)
    ├── auth.ts
    ├── opportunities.ts
    └── users.ts
```

## Tips Importantes

1. **Case Sensitivity**: Los nombres de archivo importan (especialmente en producción)
2. **index.astro**: Actúa como página por defecto en cada carpeta
3. **Orden de Prioridad**: Las rutas estáticas tienen prioridad sobre las dinámicas
4. **404 Pages**: Crea `src/pages/404.astro` para páginas de error personalizada

Este sistema te permite organizar tu aplicación de manera escalable y mantener el código ordenado.
