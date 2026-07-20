import apiClient from "./client";

export interface AchievementConProgreso {
  id: string;
  nombre: string;
  descripcion: string | null;
  iconoUrl: string | null;
  criterio: string;
  valorObjetivo: number;
  obtenido: boolean;
  fechaObtenido: string | null;
}

export async function listMyAchievementsRequest(): Promise<AchievementConProgreso[]> {
  const res = await apiClient.get<AchievementConProgreso[]>("/achievements/mine");
  return res.data;
}
