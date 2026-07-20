import { Router } from "express";
import { createProgressLog, listMyProgressLogs } from "../controllers/progressController";
import { authenticate } from "../middleware/authenticate";
import { upload } from "../middleware/upload";

const router = Router();

router.use(authenticate);

router.get("/mine", listMyProgressLogs);
router.post("/", upload.single("foto"), createProgressLog);

export default router;
