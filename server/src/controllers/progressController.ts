import type { Request, Response } from "express";
import prisma from "../db";
import { createProgressLogSchema } from "../schemas/progressSchemas";
import { evaluarLogros } from "../services/achievementService";

export async function createProgressLog(req: Request, res: Response) {
  const parsed = createProgressLogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const log = await prisma.progressLog.create({
    data: {
      userId: req.user!.userId,
      peso: parsed.data.peso,
      medidas: parsed.data.medidas,
      marcaPersonal: parsed.data.marcaPersonal,
      fotoUrl,
    },
  });

  await evaluarLogros(req.user!.userId);

  res.status(201).json(log);
}

export async function listMyProgressLogs(req: Request, res: Response) {
  const logs = await prisma.progressLog.findMany({
    where: { userId: req.user!.userId },
    orderBy: { fecha: "asc" },
  });
  res.json(logs);
}
