import { Router } from "express";
import { createSnailPayTransaction } from "../controllers/snailPayController.js";

const router = Router();

router.post("/transactions", createSnailPayTransaction);

export default router;