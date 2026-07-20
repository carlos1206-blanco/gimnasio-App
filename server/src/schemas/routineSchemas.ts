import { z } from "zod";

export const createExerciseSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  grupoMuscular: z.string().optional(),
});

export const createRoutineSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  nivel: z.string().optional(),
  ejercicios: z
    .array(
      z.object({
        exerciseId: z.string().min(1),
        series: z.coerce.number().int().min(1),
        repeticiones: z.coerce.number().int().min(1),
        descansoSegundos: z.coerce.number().int().min(0).optional(),
        orden: z.coerce.number().int().min(0).default(0),
      }),
    )
    .min(1, "La rutina debe tener al menos un ejercicio"),
});

export const assignRoutineSchema = z.object({
  routineId: z.string().min(1),
  userId: z.string().min(1),
});

export const updateSessionLogSchema = z.object({
  completado: z.boolean(),
  seriesRealizadas: z.coerce.number().int().min(0).optional(),
  repeticionesRealizadas: z.coerce.number().int().min(0).optional(),
  pesoUsado: z.coerce.number().min(0).optional(),
  notas: z.string().optional(),
});
