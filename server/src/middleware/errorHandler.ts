import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof MulterError) {
    const mensaje = err.code === "LIMIT_FILE_SIZE" ? "La imagen no puede superar los 5MB" : err.message;
    res.status(400).json({ error: mensaje });
    return;
  }

  if (err instanceof Error && err.message === "Solo se permiten imágenes") {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}
