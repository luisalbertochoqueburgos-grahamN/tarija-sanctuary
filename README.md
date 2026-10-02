# Tarija Sanctuary

Experiencia premium para descubrir salones de belleza, estética y bienestar en
Tarija, Bolivia, y reservar citas al instante.

## Desarrollo local

**Requisito:** Node.js 20.19+ o 22.12+ (recomendado Node 24).

1. Instalar dependencias:
   `npm install`
2. Levantar el servidor de desarrollo:
   `npm run dev`
3. Abrir `http://localhost:3000`

## Scripts

- `npm run dev` — servidor de desarrollo (puerto 3000)
- `npm run build` — compilación de producción (`dist/`)
- `npm run preview` — vista previa de la compilación
- `npm run lint` — verificación de tipos (`tsc --noEmit`)

## Despliegue

Cada push a `main` compila y publica automáticamente en GitHub Pages
mediante el workflow `.github/workflows/deploy-pages.yml`.
