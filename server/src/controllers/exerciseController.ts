import type { Request, Response } from "express";
import prisma from "../db";
import { createExerciseSchema } from "../schemas/routineSchemas";

export async function listExercises(_req: Request, res: Response) {
  const exercises = await prisma.exercise.findMany({ orderBy: { nombre: "asc" } });
  res.json(exercises);
}

export async function createExercise(req: Request, res: Response) {
  const parsed = createExerciseSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const exercise = await prisma.exercise.create({
    data: { ...parsed.data, creadoPorId: req.user!.userId },
  });

  res.status(201).json(exercise);
}
