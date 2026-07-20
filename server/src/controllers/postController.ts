import type { Request, Response } from "express";
import prisma from "../db";
import { createPostSchema } from "../schemas/postSchemas";

export async function createPost(req: Request, res: Response) {
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" });
    return;
  }

  const { tipo, titulo, contenido, imagenUrl, expiraEn } = parsed.data;

  const post = await prisma.post.create({
    data: {
      tipo,
      titulo,
      contenido,
      imagenUrl: imagenUrl || null,
      expiraEn,
      autorId: req.user!.userId,
    },
    include: { autor: { select: { nombre: true, apellido: true } } },
  });

  res.status(201).json(post);
}

export async function listPosts(_req: Request, res: Response) {
  const now = new Date();

  const posts = await prisma.post.findMany({
    where: {
      publicado: true,
      OR: [{ expiraEn: null }, { expiraEn: { gt: now } }],
    },
    orderBy: { fechaPublicacion: "desc" },
    include: { autor: { select: { nombre: true, apellido: true } } },
  });

  res.json(posts);
}
