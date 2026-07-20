import prisma from "../db";
import { AchievementCriterio } from "../generated/prisma/enums";

async function contarProgreso(userId: string, criterio: AchievementCriterio): Promise<number> {
  if (criterio === AchievementCriterio.REGISTROS_PROGRESO) {
    return prisma.progressLog.count({ where: { userId } });
  }

  return prisma.sessionLog.count({
    where: { completado: true, routineAssignment: { userId } },
  });
}

export async function evaluarLogros(userId: string): Promise<void> {
  const achievements = await prisma.achievement.findMany();

  for (const achievement of achievements) {
    const yaObtenido = await prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
    });
    if (yaObtenido) continue;

    const progreso = await contarProgreso(userId, achievement.criterio);
    if (progreso >= achievement.valorObjetivo) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      });
    }
  }
}
