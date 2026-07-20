# Gimnasio App

Aplicación web de gestión para un gimnasio: registro/login de socios, panel de administración con rol diferenciado, muro de avisos, rutinas asignadas y seguimiento de progreso/logros.

## Stack

- **Cliente:** React + Vite + TypeScript, React Router, Axios, Recharts, Zod.
- **Servidor:** Node.js + Express + TypeScript, Prisma ORM, JWT + bcrypt.
- **Base de datos:** PostgreSQL en Neon (nube), vía driver adapter de Prisma.

## URLs en producción

- **Frontend:** https://client-sigma-two-17.vercel.app
- **Backend:** https://gimnasio-app-server-production.up.railway.app

## Cómo levantar el proyecto en desarrollo

En dos terminales separadas:

```bash
cd server
npm run dev      # http://localhost:4000
```

```bash
cd client
npm run dev      # http://localhost:5173
```

Ambos usan la misma base de datos en Neon (configurada en `server/.env`).

## Despliegue

- **Backend (Railway):** `cd server && railway up` (proyecto: `gimnasio-app-server`). Variables configuradas: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CLIENT_URL`.
- **Frontend (Vercel):** `cd client && vercel --prod` (proyecto: `licabema/client`). Variable configurada: `VITE_API_URL`.

### Limitación conocida

Las fotos de progreso subidas en producción se guardan en el disco local del contenedor de Railway, que es efímero: se pierden en cada redeploy. Para persistirlas de verdad haría falta un servicio de almacenamiento de objetos (ej. Cloudflare R2 o AWS S3) — queda fuera del alcance actual.

## Estado del proyecto

Ver `C:\Users\carlo\.claude\plans\splendid-tinkering-rabbit.md` para el plan de fases completo.

- [x] Fase 0 — Setup del proyecto
- [x] Fase 1 — Autenticación y roles
- [x] Fase 2 — Panel admin + CRUD usuarios
- [x] Fase 3 — Muro de avisos/historias
- [x] Fase 4 — Rutinas y asignación
- [x] Fase 5 — Progreso y logros
- [x] Fase 6 — Pulido y despliegue
