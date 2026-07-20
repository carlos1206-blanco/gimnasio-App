import type { NextFunction, Request, Response } from "express";
import type { Role } from "../generated/prisma/enums";

export function authorize(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "No tienes permiso para realizar esta acción" });
      return;
    }
    next();
  };
}
