import { z } from "zod";

export const createProgressLogSchema = z.object({
  peso: z.coerce.number().min(0).optional(),
  medidas: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return undefined;
      try {
        return JSON.parse(val) as Record<string, number>;
      } catch {
        ctx.addIssue({ code: "custom", message: "medidas debe ser un JSON válido" });
        return z.NEVER;
      }
    }),
  marcaPersonal: z.string().optional(),
});
