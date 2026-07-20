# Gimnasio App

Aplicación web de gestión para un gimnasio: registro/login de socios, panel de administración con rol diferenciado, muro de avisos, rutinas asignadas y seguimiento de progreso/logros.

## Stack

- **Cliente:** React + Vite + TypeScript, React Router, Axios, Recharts, Zod.
- **Servidor:** Node.js + Express + TypeScript, Prisma ORM, JWT + bcrypt.
- **Base de datos:** SQLite en desarrollo (Prisma) → PostgreSQL en la nube (Neon/Supabase) en producción.

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

## Estado del proyecto

Ver `C:\Users\carlo\.claude\plans\splendid-tinkering-rabbit.md` para el plan de fases completo.

- [x] Fase 0 — Setup del proyecto
- [x] Fase 1 — Autenticación y roles
- [x] Fase 2 — Panel admin + CRUD usuarios
- [x] Fase 3 — Muro de avisos/historias
- [x] Fase 4 — Rutinas y asignación
- [x] Fase 5 — Progreso y logros
- [ ] Fase 6 — Pulido y despliegue
