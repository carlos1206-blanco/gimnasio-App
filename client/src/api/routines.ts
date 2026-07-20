import apiClient from "./client";

export interface Exercise {
  id: string;
  nombre: string;
  descripcion: string | null;
  grupoMuscular: string | null;
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  series: number;
  repeticiones: number;
  descansoSegundos: number | null;
  orden: number;
  exercise: Exercise;
}

export interface Routine {
  id: string;
  nombre: string;
  descripcion: string | null;
  nivel: string | null;
  fechaCreacion: string;
  ejercicios: RoutineExercise[];
}

export interface SessionLog {
  id: string;
  routineAssignmentId: string;
  exerciseId: string;
  completado: boolean;
  seriesRealizadas: number | null;
  repeticionesRealizadas: number | null;
  pesoUsado: number | null;
  notas: string | null;
}

export interface RoutineAssignment {
  id: string;
  routineId: string;
  userId: string;
  fechaInicio: string;
  activa: boolean;
  routine: Routine;
  sessionLogs: SessionLog[];
  user: { id: string; nombre: string; apellido: string };
}

export interface NewExerciseData {
  nombre: string;
  descripcion?: string;
  grupoMuscular?: string;
}

export interface NewRoutineExercise {
  exerciseId: string;
  series: number;
  repeticiones: number;
  descansoSegundos?: number;
  orden: number;
}

export interface NewRoutineData {
  nombre: string;
  descripcion?: string;
  nivel?: string;
  ejercicios: NewRoutineExercise[];
}

export async function listExercisesRequest(): Promise<Exercise[]> {
  const res = await apiClient.get<Exercise[]>("/exercises");
  return res.data;
}

export async function createExerciseRequest(data: NewExerciseData): Promise<Exercise> {
  const res = await apiClient.post<Exercise>("/exercises", data);
  return res.data;
}

export async function listRoutinesRequest(): Promise<Routine[]> {
  const res = await apiClient.get<Routine[]>("/routines");
  return res.data;
}

export async function createRoutineRequest(data: NewRoutineData): Promise<Routine> {
  const res = await apiClient.post<Routine>("/routines", data);
  return res.data;
}

export async function assignRoutineRequest(routineId: string, userId: string): Promise<RoutineAssignment> {
  const res = await apiClient.post<RoutineAssignment>("/routine-assignments", { routineId, userId });
  return res.data;
}

export async function listAssignmentsByUserRequest(userId: string): Promise<RoutineAssignment[]> {
  const res = await apiClient.get<RoutineAssignment[]>("/routine-assignments", { params: { userId } });
  return res.data;
}

export async function listMyAssignmentsRequest(): Promise<RoutineAssignment[]> {
  const res = await apiClient.get<RoutineAssignment[]>("/routine-assignments/mine");
  return res.data;
}

export interface UpdateSessionLogData {
  completado: boolean;
  seriesRealizadas?: number;
  repeticionesRealizadas?: number;
  pesoUsado?: number;
  notas?: string;
}

export async function updateSessionLogRequest(
  assignmentId: string,
  exerciseId: string,
  data: UpdateSessionLogData,
): Promise<SessionLog> {
  const res = await apiClient.put<SessionLog>(
    `/routine-assignments/${assignmentId}/exercises/${exerciseId}`,
    data,
  );
  return res.data;
}
