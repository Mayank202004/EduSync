import { Router } from "express";
import { verifyJWT,verifyTeacher,verifyStudent } from '../middlewares/auth.middleware.js';
import { markAttendance, getAttendance,getMyAttendance,getDailyAttendance,exportAttendanceExcel, getStudentList, getGenderDistribution, getTopAttendees} from "../controllers/attendence.controller.js"

const router = Router();

// Protected Routes
router.route("/mark").post(verifyJWT,verifyTeacher,markAttendance);
router.route("/daily").get(verifyJWT,getDailyAttendance);
router.route("/me").get(verifyJWT,getMyAttendance);
router.route("/").get(verifyJWT,verifyTeacher,getAttendance);
router.route("/export").get(verifyJWT,exportAttendanceExcel);
router.post("/students",verifyJWT,verifyTeacher,getStudentList);
router.get("/gender-distribution",verifyJWT,verifyTeacher,getGenderDistribution);
router.get("/top-attenders",verifyJWT,verifyTeacher,getTopAttendees);

export default router;