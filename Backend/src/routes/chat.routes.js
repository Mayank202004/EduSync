import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import * as ChatController from '../controllers/chats.controller.js'

const router = Router();

router.get("/:id",verifyJWT,ChatController.getMessages);


export default router;