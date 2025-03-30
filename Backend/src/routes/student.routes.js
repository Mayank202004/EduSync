import { verifyJWT,verifySuperAdmin } from "../middlewares/auth.middleware.js"
import * as StudentController from "../controllers/student.controller.js";
import { Router } from "express";

const router = Router()

// Secure Routes
router.route("/class-details").post(verifyJWT,verifySuperAdmin,StudentController.addClassDetails);

export default router;