import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import * as ChatController from '../controllers/chats.controller.js'
import { upload } from '../middlewares/multer.middleware.js'    

const router = Router();

router.get("/:id",verifyJWT,ChatController.getMessages);
router.post("/upload",upload.array("files", 10),verifyJWT,ChatController.uploadMultipleFiles);


export default router;