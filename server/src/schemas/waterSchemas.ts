import { z } from "zod";

export const createWaterLogSchema = z.object({
  cantidadMl: z.coerce.number().int().min(1).max(5000),
});
