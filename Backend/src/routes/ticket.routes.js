import { Router } from "express";
import {
  createTicket,
  getOpenTickets,
  getClosedTickets,
} from "../controllers/ticket.controller.js";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/open", verifyJWT, verifySuperAdmin, getOpenTickets);
router.get("/closed", verifyJWT, verifySuperAdmin, getClosedTickets);
router.post("/",verifyJWT, createTicket);

export default router;
