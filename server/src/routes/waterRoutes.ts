import { Router } from "express";
import { createWaterLog, listTodayWaterLogs, deleteWaterLog } from "../controllers/waterController";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.use(authenticate);

router.get("/today", listTodayWaterLogs);
router.post("/", createWaterLog);
router.delete("/:id", deleteWaterLog);

export default router;
