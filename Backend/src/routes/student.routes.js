import { verifyJWT,verifySuperAdmin, verifyStudent, verifyTeacher } from "../middlewares/auth.middleware.js"
import * as StudentController from "../controllers/student.controller.js";
import { Router } from "express";

const router = Router()

// Secure Routes
router.route("/class-details").post(verifyJWT,verifySuperAdmin,StudentController.addClassDetails);
router.route("/parent-details").post(verifyJWT,verifyStudent,StudentController.addParentInfo);
router.route("/parent-contact").post(verifyJWT,verifyStudent,StudentController.addParentContact);
router.route("/allergy").post(verifyJWT,verifyStudent,StudentController.addAllergy);
router.route("/details").post(verifyJWT,verifyStudent,StudentController.addStudentDetails);
router.route("/physical-details").post(verifyJWT,verifyTeacher,StudentController.addPhysicalInfo); // To Do: Later we need to add middleware for sports teacher
router.route("/sibling-details").post(verifyJWT,verifyStudent,StudentController.addSiblingInfo);
router.route("/me").get(verifyJWT,verifyStudent,StudentController.getStudentInfo);

export default router;