import express from "express";
import { verifyTeacher, updateTeacherDetails } from "../controllers/teacher.controller.js";
import { verifyJWT,verifySuperAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.patch("/verify/:id", verifyJWT,verifySuperAdmin,verifyTeacher); 
router.put("/details", verifyJWT,verifySuperAdmin,updateTeacherDetails); 

export default router;
