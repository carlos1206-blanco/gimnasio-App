import { Router } from "express";
import { listUsers, updateUser } from "../controllers/userController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { Role } from "../generated/prisma/enums";

const router = Router();

router.use(authenticate, authorize([Role.ADMIN]));

router.get("/", listUsers);
router.put("/:id", updateUser);

export default router;
