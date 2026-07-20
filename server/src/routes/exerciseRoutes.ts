import { Router } from "express";
import { listExercises, createExercise } from "../controllers/exerciseController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { Role } from "../generated/prisma/enums";

const router = Router();

router.use(authenticate, authorize([Role.ADMIN]));

router.get("/", listExercises);
router.post("/", createExercise);

export default router;
