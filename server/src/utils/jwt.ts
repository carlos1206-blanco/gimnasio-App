import jwt from "jsonwebtoken";
import type { Role } from "../generated/prisma/enums";

if (!process.env.JWT_SECRET) {
  throw new Error("Falta la variable de entorno JWT_SECRET");
}
const JWT_SECRET: string = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  role: Role;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
}
