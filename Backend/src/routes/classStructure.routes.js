import { Router } from "express";
import {
  addClass,
  addDivision,
  removeDivision,
  deleteClass,
  getAllClasses
} from "../controllers/classStructure.controller.js";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected Routes (Super Admin only)
router.get("/", verifyJWT, verifySuperAdmin, getAllClasses);
router.post("/add", verifyJWT, verifySuperAdmin, addClass);
router.delete("/", verifyJWT, verifySuperAdmin, deleteClass);
router.post("/add-div", verifyJWT, verifySuperAdmin, addDivision);
router.delete("/div", verifyJWT, verifySuperAdmin, removeDivision);

export default router;
