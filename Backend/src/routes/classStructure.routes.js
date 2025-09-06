import { Router } from "express";
import {
  addClass,
  addDivision,
  removeDivision,
  deleteClass,
  getAllClasses
} from "../controllers/classStructure.controller.js";
import { verifyJWT, verifySuperAdmin, verifyTeacher} from "../middlewares/auth.middleware.js";
import { orMiddleware } from "../middlewares/orMiddleware.js";

const router = Router();

// Protected Routes (Super Admin only)
router.get("/", verifyJWT, orMiddleware([verifySuperAdmin, verifyTeacher]), getAllClasses);
router.post("/add", verifyJWT, verifySuperAdmin, addClass);
router.delete("/", verifyJWT, verifySuperAdmin, deleteClass);
router.post("/add-div", verifyJWT, verifySuperAdmin, addDivision);
router.delete("/div", verifyJWT, verifySuperAdmin, removeDivision);

export default router;
