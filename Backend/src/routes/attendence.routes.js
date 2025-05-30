import { Router } from "express";
import { verifyJWT,verifyTeacher,verifyStudent } from '../middlewares/auth.middleware.js';
import { markAttendance, getAttendance,getMyAttendance,getDailyAttendance,exportAttendanceExcel, getStudentList, getDashboardData} from "../controllers/attendence.controller.js"

const router = Router();

// Protected Routes
router.route("/mark").post(verifyJWT,verifyTeacher,markAttendance);
router.route("/daily").post(verifyJWT,getDailyAttendance);
router.route("/me").get(verifyJWT,getMyAttendance);
router.route("/").get(verifyJWT,verifyTeacher,getAttendance);
router.route("/export").get(verifyJWT,exportAttendanceExcel);
router.post("/students",verifyJWT,verifyTeacher,getStudentList);
router.post("/dashboard",verifyJWT,verifyTeacher,getDashboardData)


export default router;