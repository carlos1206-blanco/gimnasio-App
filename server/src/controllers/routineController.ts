import type { Request, Response } from "express";
import prisma from "../db";
import { createRoutineSchema } from "../schemas/routineSchemas";

const routineInclude = {
  ejercicios: {
    orderBy: { orden: "asc" as const },
    include: { exercise: true },
  },
};

export async function listRoutines(_req: Request, res: Response) {
  const routines = await prisma.routine.findMany({
    include: routineInclude,
    orderBy: { fechaCreacion: "desc" },
  });
  res.json(routines);
}

export async function createRoutine(req: Request, res: Response) {
  const parsed = createRoutineSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const { nombre, descripcion, nivel, ejercicios } = parsed.data;

  const routine = await prisma.routine.create({
    data: {
      nombre,
      descripcion,
      nivel,
      creadoPorId: req.user!.userId,
      ejercicios: { create: ejercicios },
    },
    include: routineInclude,
  });

  res.status(201).json(routine);
}
