import { Router } from "express";
import {
  assignRoutine,
  listMyAssignments,
  listAssignmentsByUser,
  updateSessionLog,
} from "../controllers/routineAssignmentController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { Role } from "../generated/prisma/enums";

const router = Router();

router.use(authenticate);

router.get("/mine", listMyAssignments);
router.put("/:assignmentId/exercises/:exerciseId", updateSessionLog);

router.post("/", authorize([Role.ADMIN]), assignRoutine);
router.get("/", authorize([Role.ADMIN]), listAssignmentsByUser);

export default router;
