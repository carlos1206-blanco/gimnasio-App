import type { Request, Response } from "express";
import prisma from "../db";
import { assignRoutineSchema, updateSessionLogSchema } from "../schemas/routineSchemas";
import { evaluarLogros } from "../services/achievementService";

const assignmentInclude = {
  routine: {
    include: {
      ejercicios: { orderBy: { orden: "asc" as const }, include: { exercise: true } },
    },
  },
  sessionLogs: true,
  user: { select: { id: true, nombre: true, apellido: true } },
};

export async function assignRoutine(req: Request, res: Response) {
  const parsed = assignRoutineSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const { routineId, userId } = parsed.data;

  const [routine, user] = await Promise.all([
    prisma.routine.findUnique({ where: { id: routineId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  if (!routine) {
    res.status(404).json({ error: "Rutina no encontrada" });
    return;
  }
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const assignment = await prisma.routineAssignment.create({
    data: { routineId, userId, asignadoPorId: req.user!.userId },
    include: assignmentInclude,
  });

  res.status(201).json(assignment);
}

export async function listMyAssignments(req: Request, res: Response) {
  const assignments = await prisma.routineAssignment.findMany({
    where: { userId: req.user!.userId, activa: true },
    include: assignmentInclude,
    orderBy: { fechaInicio: "desc" },
  });
  res.json(assignments);
}

export async function listAssignmentsByUser(req: Request, res: Response) {
  const userId = String(req.query.userId ?? "");
  if (!userId) {
    res.status(400).json({ error: "Falta el parámetro userId" });
    return;
  }

  const assignments = await prisma.routineAssignment.findMany({
    where: { userId },
    include: assignmentInclude,
    orderBy: { fechaInicio: "desc" },
  });
  res.json(assignments);
}

export async function updateSessionLog(req: Request, res: Response) {
  const assignmentId = String(req.params.assignmentId);
  const exerciseId = String(req.params.exerciseId);

  const parsed = updateSessionLogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const assignment = await prisma.routineAssignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) {
    res.status(404).json({ error: "Asignación no encontrada" });
    return;
  }
  if (assignment.userId !== req.user!.userId) {
    res.status(403).json({ error: "No puedes modificar el progreso de otro socio" });
    return;
  }

  const sessionLog = await prisma.sessionLog.upsert({
    where: { routineAssignmentId_exerciseId: { routineAssignmentId: assignmentId, exerciseId } },
    update: parsed.data,
    create: { routineAssignmentId: assignmentId, exerciseId, ...parsed.data },
  });

  if (sessionLog.completado) {
    await evaluarLogros(assignment.userId);
  }

  res.json(sessionLog);
}
