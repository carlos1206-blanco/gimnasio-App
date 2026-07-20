import { z } from "zod";

export const createPostSchema = z.object({
  tipo: z.enum(["AVISO", "NOTICIA", "HISTORIA"]).default("AVISO"),
  titulo: z.string().min(1, "El título es obligatorio"),
  contenido: z.string().min(1, "El contenido es obligatorio"),
  imagenUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  expiraEn: z.coerce.date().optional(),
});
