import type { Request, Response } from "express";
import prisma from "../db";
import { createWaterLogSchema } from "../schemas/waterSchemas";

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function createWaterLog(req: Request, res: Response) {
  const parsed = createWaterLogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const log = await prisma.waterLog.create({
    data: { userId: req.user!.userId, cantidadMl: parsed.data.cantidadMl },
  });

  res.status(201).json(log);
}

export async function listTodayWaterLogs(req: Request, res: Response) {
  const logs = await prisma.waterLog.findMany({
    where: { userId: req.user!.userId, fecha: { gte: startOfTodayUTC() } },
    orderBy: { fecha: "asc" },
  });

  res.json(logs);
}

export async function deleteWaterLog(req: Request, res: Response) {
  const id = String(req.params.id);

  const log = await prisma.waterLog.findUnique({ where: { id } });
  if (!log) {
    res.status(404).json({ error: "Registro no encontrado" });
    return;
  }
  if (log.userId !== req.user!.userId) {
    res.status(403).json({ error: "No puedes borrar el registro de otro socio" });
    return;
  }

  await prisma.waterLog.delete({ where: { id } });
  res.status(204).send();
}
