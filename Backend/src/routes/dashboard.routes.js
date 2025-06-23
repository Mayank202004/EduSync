import { Router } from "express";
import { verifyJWT,verifyStudent, verifyTeacher } from '../middlewares/auth.middleware.js';
import * as DashboardController from '../controllers/dashboard.controller.js'
const router = Router();

// Protected Routes
router.get("/student",verifyJWT,verifyStudent,DashboardController.fetchDashboardData);
router.get("/teacher",verifyJWT,verifyTeacher,DashboardController.fetchTeacherDashboardData);

export default router;