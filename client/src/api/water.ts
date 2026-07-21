import apiClient from "./client";

export interface WaterLog {
  id: string;
  fecha: string;
  cantidadMl: number;
}

export async function listTodayWaterRequest(): Promise<WaterLog[]> {
  const res = await apiClient.get<WaterLog[]>("/water-logs/today");
  return res.data;
}

export async function createWaterLogRequest(cantidadMl: number): Promise<WaterLog> {
  const res = await apiClient.post<WaterLog>("/water-logs", { cantidadMl });
  return res.data;
}

export async function deleteWaterLogRequest(id: string): Promise<void> {
  await apiClient.delete(`/water-logs/${id}`);
}
