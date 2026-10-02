# Tarija Sanctuary

Experiencia premium para descubrir salones de belleza, estética y bienestar en
Tarija, Bolivia, y reservar citas al instante. Web app funcional con catálogo
de salones, filtros por categoría, reserva de citas (fecha/hora/servicios),
resumen de reserva y persistencia local.

## Tecnologías

| Tecnología | Versión | Uso en el proyecto |
|---|---|---|
| React | 19.3.0 | UI por componentes, hooks (`useState`, `useEffect`) |
| React DOM | 19.3.0 | Renderizado (`createRoot`) |
| Vite | 8.3.2 | Bundler y servidor de desarrollo con HMR |
| TypeScript | 7.0.2 | Tipado estático (`tsc --noEmit` en `npm run lint`) |
| Tailwind CSS | 4.3.3 | Estilos utility-first (vía `@tailwindcss/vite` + `@import "tailwindcss"`) |
| Material Symbols | CDN | Iconografía (`material-symbols-outlined`) |
| Plus Jakarta Sans | CDN (Google Fonts) | Tipografía principal |

## Estructura del proyecto

```
.
├── index.html                  # HTML base, fuentes e iconos, monta /src/main.tsx
├── vite.config.ts              # Config Vite (alias @, base dinámica con VITE_BASE)
├── tsconfig.json               # Config TypeScript (strict-ish, jsx react-jsx, noEmit)
├── package.json                # Scripts y dependencias
├── .env.example                # Documentación de variables (actualmente ninguna requerida)
├── .github/workflows/          # CI/CD a GitHub Pages
│   └── deploy-pages.yml
└── src/
    ├── main.tsx                # Punto de entrada: monta <App /> en #root
    ├── App.tsx                 # Toda la app: catálogo, filtros, reserva, checkout
    └── index.css               # Tailwind + estilos base y utilidades (no-scrollbar, safe-area)
```

### Cómo funciona la app (`src/App.tsx`)

- **Pestañas:** Explorar · Destacados · Citas (fecha/hora/servicios) · Mi Reserva (checkout).
- **Datos:** catálogo mock en código (`ALL_SALONS`, `INITIAL_BOOKINGS`); sin backend.
- **Persistencia:** favoritos, marcadores y reservas en `localStorage`
  (`sanctuary_favorites`, `sanctuary_bookmarks`, `sanctuary_bookings`).
- **Precios:** subtotal de servicios + ~4.3 % de impuestos calculado en cliente.

## Dependencias instaladas

Versiones exactas instaladas (`npm ls`), a fecha de esta documentación:

### Dependencias (`dependencies`)

| Paquete | Versión instalada | Para qué está |
|---|---|---|
| `react` | 19.3.0 | Librería UI (usada en toda la app) |
| `react-dom` | 19.3.0 | Render en el DOM (usada en `main.tsx`) |
| `vite` | 8.3.2 | Build + dev server (usado) |
| `@vitejs/plugin-react` | 6.1.1 | Soporte React/Fast Refresh en Vite (usado) |
| `tailwindcss` | 4.3.3 | Framework CSS (usado) |
| `@tailwindcss/vite` | 4.3.3 | Plugin de Tailwind para Vite (usado) |
| `lucide-react` | 0.546.0 | Set de iconos React (instalado, disponible para usar) |
| `motion` | 12.43.0 | Animaciones (instalado, disponible para usar) |
| `express` | 4.22.3 | Servidor Node (instalado, previsto para un futuro backend) |
| `dotenv` | 17.4.2 | Variables de entorno en Node (instalado, previsto para backend) |

### Dependencias de desarrollo (`devDependencies`)

| Paquete | Versión instalada | Para qué está |
|---|---|---|
| `typescript` | 7.0.2 | Compilador y chequeo de tipos |
| `@types/react` | 19.3.0 | Tipos de React |
| `@types/react-dom` | 19.3.0 | Tipos de React DOM |
| `@types/node` | 22.20.5 | Tipos de Node |
| `@types/express` | 4.17.25 | Tipos de Express |
| `esbuild` | 0.28.2 | Transpilador interno de Vite (requerido por Vite 8) |
| `autoprefixer` | 10.6.1 | Prefijos CSS automáticos |
| `tsx` | 4.23.15 | Ejecución directa de TypeScript (utilidades/scripts futuros) |

## Desarrollo local

**Requisito:** Node.js 20.19+ o 22.12+ (recomendado Node 24).

1. Instalar dependencias:
   `npm install`
2. Levantar el servidor de desarrollo:
   `npm run dev`
3. Abrir `http://localhost:3000`

No se requieren variables de entorno (`.env.example` lo documenta).

## Scripts

- `npm run dev` — servidor de desarrollo (puerto 3000, HMR activado)
- `npm run build` — compilación de producción (`dist/`)
- `npm run preview` — vista previa de la compilación
- `npm run lint` — verificación de tipos (`tsc --noEmit`)
- `npm run clean` — elimina `dist/` y `server.js`

## Despliegue

Cada push a `main` compila y publica automáticamente en GitHub Pages
mediante el workflow `.github/workflows/deploy-pages.yml`:

1. `npm ci` → `npm run build` con `VITE_BASE=/tarija-sanctuary/`
2. Publica `dist/` con `actions/deploy-pages`

> Nota: `vite.config.ts` usa `base: process.env.VITE_BASE ?? '/'`, por eso en
> local se sirve desde `/` y en Pages desde `/tarija-sanctuary/`.
