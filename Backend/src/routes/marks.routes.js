import { Router } from 'express';
import * as MarksController from '../controllers/marks.controller.js';
import { verifyJWT,verifySuperAdmin,verifyStudent,verifyTeacher} from '../middlewares/auth.middleware.js';
import { orMiddleware } from '../middlewares/orMiddleware.js';

const router = Router();

router.get('/class-marksheet',verifyJWT,orMiddleware([verifyTeacher,verifySuperAdmin]),MarksController.exportClassMarkSheet);
export default router;
