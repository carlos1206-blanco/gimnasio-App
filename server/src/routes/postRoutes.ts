import { Router } from "express";
import { createPost, listPosts } from "../controllers/postController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { Role } from "../generated/prisma/enums";

const router = Router();

router.use(authenticate);

router.get("/", listPosts);
router.post("/", authorize([Role.ADMIN]), createPost);

export default router;
