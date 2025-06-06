import { Router } from "express";
import { verifyJWT,verifyTeacher,verifyStudent, verifySuperAdmin } from '../middlewares/auth.middleware.js';
import { markAttendance, getAttendance,getMyAttendance,getDailyAttendance,exportAttendanceExcel, getStudentList, getTeacherDashboardData, getTopLevelAdminDashboardData, getClassLevelAdminDashboardData} from "../controllers/attendence.controller.js"

const router = Router();

// Protected Routes
router.route("/mark").post(verifyJWT,verifyTeacher,markAttendance);
router.route("/daily").post(verifyJWT,getDailyAttendance);
router.route("/me").get(verifyJWT,getMyAttendance);
router.route("/").get(verifyJWT,verifyTeacher,getAttendance);
router.route("/export").post(verifyJWT,exportAttendanceExcel);
router.post("/students",verifyJWT,verifyTeacher,getStudentList);
router.post("/dashboard",verifyJWT,verifyTeacher,getTeacherDashboardData);
router.get("/admin-dashboard",verifyJWT,verifySuperAdmin,getTopLevelAdminDashboardData);
router.get('/admin-class-dashboard/:className',verifyJWT,verifySuperAdmin, getClassLevelAdminDashboardData);



export default router;