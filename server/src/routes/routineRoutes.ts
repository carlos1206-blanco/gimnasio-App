import { Router } from "express";
import { listRoutines, createRoutine } from "../controllers/routineController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { Role } from "../generated/prisma/enums";

const router = Router();

router.use(authenticate, authorize([Role.ADMIN]));

router.get("/", listRoutines);
router.post("/", createRoutine);

export default router;
