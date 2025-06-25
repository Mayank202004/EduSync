import { Router } from "express";
import {
  addFAQ,
  getAllFAQs,
  getFAQsByCategory,
} from "../controllers/faq.controller.js";
import { verifyJWT,verifySuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected Routes
router.get("/",verifyJWT, getAllFAQs);
router.get("/category/:category",verifyJWT, getFAQsByCategory);

// Super Admin Only
router.post("/add",verifyJWT,verifySuperAdmin, addFAQ);

export default router;
