import { Router } from 'express';
import * as MarksController from '../controllers/marks.controller.js';
import { verifyJWT,verifySuperAdmin,verifyStudent,verifyTeacher} from '../middlewares/auth.middleware.js';
import { orMiddleware } from '../middlewares/orMiddleware.js';

const router = Router();

router.get('/class-marksheet',verifyJWT,orMiddleware([verifyTeacher,verifySuperAdmin]),MarksController.exportClassMarkSheet);
router.get('/me',verifyJWT,verifyStudent,MarksController.getStudentMarks);
router.post('/add-class-marks',verifyJWT,verifyTeacher,MarksController.addClassMarks);

export default router;
