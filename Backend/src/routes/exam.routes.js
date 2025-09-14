import { Router } from "express";
import { getExams,addExam,deleteExam } from "../controllers/exam.controller.js";
import { verifyJWT,verifySuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected Routes
router.get("/",verifyJWT,verifySuperAdmin,getExams);
router.post("/add",verifyJWT,verifySuperAdmin,addExam);
router.delete("/:examId",verifyJWT,verifySuperAdmin,deleteExam)

export default router;
