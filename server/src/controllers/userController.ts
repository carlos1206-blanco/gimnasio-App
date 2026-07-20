import type { Request, Response } from "express";
import prisma from "../db";
import { updateUserSchema } from "../schemas/userSchemas";

const publicSelect = {
  id: true,
  email: true,
  nombre: true,
  apellido: true,
  telefono: true,
  role: true,
  activo: true,
  fechaRegistro: true,
} as const;

export async function listUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: publicSelect,
    orderBy: { fechaRegistro: "desc" },
  });
  res.json(users);
}

export async function updateUser(req: Request, res: Response) {
  const id = String(req.params.id);

  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const existente = await prisma.user.findUnique({ where: { id } });
  if (!existente) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const user = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: publicSelect,
  });

  res.json(user);
}
