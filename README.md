# Frontend de la tarea UPB

Pantalla de inicio de sesión construida con React y Vite. Consume el endpoint `POST /api/auth/login` del repositorio backend.

## Ejecución local

1. Copia `.env.example` como `.env`.
2. Configura `VITE_API_URL` con la URL del backend, sin `/api` al final.
3. Ejecuta `npm install`.
4. Ejecuta `npm run dev`.

Por defecto se conecta a `http://localhost:3000`.

## Comandos

- `npm run dev`: servidor local.
- `npm run lint`: revisión estática.
- `npm test`: pruebas del flujo de acceso.
- `npm run build`: genera la aplicación para producción en `dist`.

Las credenciales no se guardan en este repositorio: se configuran únicamente en las variables de entorno del backend.

## Despliegue en Render

El repositorio incluye `render.yaml` para crear un Static Site. La compilación
usa `npm ci && npm run build` y publica la carpeta `dist`. La variable
`VITE_API_URL` apunta al backend de producción.
