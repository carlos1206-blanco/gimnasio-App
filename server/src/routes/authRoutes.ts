import { Router } from "express";
import { register, login } from "../controllers/authController";
import { authenticate } from "../middleware/authenticate";
import prisma from "../db";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    role: user.role,
  });
});

export default router;
