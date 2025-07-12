import { Router } from "express";
import * as SettingController from "../controllers/setting.controller.js";
import { verifyJWT, verifySuperAdmin}from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/academic-year").get(verifyJWT, SettingController.getAcademicYear);
router.route("/academic-year").put(verifyJWT,verifySuperAdmin, SettingController.setAcademicYear);
router.route("school-name").get(verifyJWT, SettingController.getSchoolName);
router.route("school-name").put(verifyJWT,verifySuperAdmin, SettingController.setSchoolName);

export default router;