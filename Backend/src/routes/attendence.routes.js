import { Router } from "express";
import { verifyJWT,verifyTeacher,verifyStudent } from '../middlewares/auth.middleware.js';
import { markAttendance, getAttendance,getMyAttendance} from "../controllers/attendence.controller.js"

const router = Router();

// Protected Routes
router.route("/mark").post(verifyJWT,verifyTeacher,markAttendance);
router.route("/daily").get(verifyJWT,getAttendance);
router.route("/me").get(verifyJWT,getMyAttendance);

export default router;