import { Router } from "express";
import { verifyJWT,verifyTeacher,verifyStudent, verifySuperAdmin } from '../middlewares/auth.middleware.js';
import * as CalendarController from '../controllers/calendar.controller.js'
const router = Router();

// Protected Routes
router.post("/add",verifyJWT,verifySuperAdmin,CalendarController.createEvent);
router.get("/events",verifyJWT,CalendarController.getAllEvents);
router.delete("/delete/:id",verifyJWT,verifySuperAdmin,CalendarController.deleteEvent);

export default router;