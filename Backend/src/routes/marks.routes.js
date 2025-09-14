import { Router } from 'express';
import * as MarksController from '../controllers/marks.controller.js';
import { verifyJWT,verifySuperAdmin,verifyStudent,verifyTeacher} from '../middlewares/auth.middleware.js';
import { orMiddleware } from '../middlewares/orMiddleware.js';

const router = Router();

router.get('/me',verifyJWT,verifyStudent,MarksController.getStudentMarks);
router.get('/teacher-data',verifyJWT,verifyTeacher,MarksController.getTeacherMarksData);

router.post('/add-class-marks',verifyJWT,verifyTeacher,MarksController.addClassMarks);
router.put('/update-class-marks',verifyJWT,verifyTeacher,MarksController.updateClassMarks);
router.post('/class-marklist-template',verifyJWT,orMiddleware([verifyTeacher,verifySuperAdmin]),MarksController.exportClassMarklistTemplate);

export default router;
