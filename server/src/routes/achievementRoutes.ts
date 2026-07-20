import { Router } from "express";
import { listMyAchievements } from "../controllers/achievementController";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.use(authenticate);

router.get("/mine", listMyAchievements);

export default router;
