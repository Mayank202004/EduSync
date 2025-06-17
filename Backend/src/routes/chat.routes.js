import { Router } from "express";
import { verifyJWT,verifyStudent } from '../middlewares/auth.middleware.js';
import * as ChatController from '../controllers/chats.controller.js'
const router = Router();

// Protected Routes
router.get("/",verifyJWT,verifyStudent,ChatController.fetchDashboardData);

export default router;