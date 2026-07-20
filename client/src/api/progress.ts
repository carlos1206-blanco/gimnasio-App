import apiClient from "./client";

export interface ProgressLog {
  id: string;
  fecha: string;
  peso: number | null;
  medidas: Record<string, number> | null;
  marcaPersonal: string | null;
  fotoUrl: string | null;
}

export interface NewProgressLogData {
  peso?: number;
  cintura?: number;
  pecho?: number;
  brazo?: number;
  marcaPersonal?: string;
  foto?: File;
}

export async function listMyProgressLogsRequest(): Promise<ProgressLog[]> {
  const res = await apiClient.get<ProgressLog[]>("/progress-logs/mine");
  return res.data;
}

export async function createProgressLogRequest(data: NewProgressLogData): Promise<ProgressLog> {
  const form = new FormData();
  if (data.peso !== undefined) form.append("peso", String(data.peso));
  if (data.marcaPersonal) form.append("marcaPersonal", data.marcaPersonal);

  const medidas: Record<string, number> = {};
  if (data.cintura !== undefined) medidas.cintura = data.cintura;
  if (data.pecho !== undefined) medidas.pecho = data.pecho;
  if (data.brazo !== undefined) medidas.brazo = data.brazo;
  if (Object.keys(medidas).length > 0) form.append("medidas", JSON.stringify(medidas));

  if (data.foto) form.append("foto", data.foto);

  const res = await apiClient.post<ProgressLog>("/progress-logs", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
