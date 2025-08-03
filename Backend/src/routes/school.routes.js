import express from "express";
import {
  createSchool,
  getAllSchools,
  getSchoolBySlug,
  updateSchool,
  deleteSchool,
} from "../controllers/school.controller.js";
import { verifyJWT, verifySystemAdmin} from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes are private and restricted to system administrator
router.use(verifyJWT);           // Require authentication
router.use(verifySystemAdmin);   // Require system admin privileges

// Protected Routes
router.post("/", createSchool);
router.get("/", getAllSchools);
router.get("/:slug", getSchoolBySlug);
router.put("/:schoolId", updateSchool);
router.delete("/:schoolId", deleteSchool);

export default router;
