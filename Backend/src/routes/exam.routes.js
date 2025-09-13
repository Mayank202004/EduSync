import { Router } from "express";
import { addExam,deleteExam } from "../controllers/exam.controller.js";
import { verifyJWT,verifySuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected Routes
router.post("/add",verifyJWT,verifySuperAdmin,addExam);
router.delete("/:examId",verifyJWT,verifySuperAdmin,deleteExam)

export default router;
