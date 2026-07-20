import { z } from "zod";

export const updateUserSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").optional(),
  apellido: z.string().min(1, "El apellido es obligatorio").optional(),
  telefono: z.string().optional(),
  activo: z.boolean().optional(),
});
