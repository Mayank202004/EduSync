import express from "express";
import { verifyTeacher, updateTeacherDetails, getUnverifiedTeachers, fetchAllTeachers } from "../controllers/teacher.controller.js";
import { verifyJWT,verifySuperAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/all", verifyJWT,verifySuperAdmin,fetchAllTeachers);
router.patch("/verify/:id", verifyJWT,verifySuperAdmin,verifyTeacher); 
router.put("/details", verifyJWT,verifySuperAdmin,updateTeacherDetails); 
router.get("/unverified",verifyJWT,verifySuperAdmin,getUnverifiedTeachers);

export default router;
