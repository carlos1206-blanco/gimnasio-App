import type { Request, Response } from "express";
import prisma from "../db";
import { registerSchema, loginSchema } from "../schemas/authSchemas";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const { email, password, nombre, apellido, telefono } = parsed.data;

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    res.status(409).json({ error: "Ya existe una cuenta con ese email" });
    return;
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, passwordHash, nombre, apellido, telefono },
  });

  const token = signToken({ userId: user.id, role: user.role });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      role: user.role,
    },
  });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.activo) {
    res.status(401).json({ error: "Email o contraseña incorrectos" });
    return;
  }

  const passwordOk = await comparePassword(password, user.passwordHash);
  if (!passwordOk) {
    res.status(401).json({ error: "Email o contraseña incorrectos" });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      role: user.role,
    },
  });
}
