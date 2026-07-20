import type { Request, Response } from "express";
import prisma from "../db";

export async function listMyAchievements(req: Request, res: Response) {
  const [obtenidos, catalogo] = await Promise.all([
    prisma.userAchievement.findMany({
      where: { userId: req.user!.userId },
      include: { achievement: true },
    }),
    prisma.achievement.findMany(),
  ]);

  const obtenidosIds = new Set(obtenidos.map((o) => o.achievementId));

  const resultado = catalogo.map((a) => {
    const obtenido = obtenidos.find((o) => o.achievementId === a.id);
    return {
      ...a,
      obtenido: obtenidosIds.has(a.id),
      fechaObtenido: obtenido?.fechaObtenido ?? null,
    };
  });

  res.json(resultado);
}
