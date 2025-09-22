import { Router } from 'express';
import * as MarksController from '../controllers/marks.controller.js';
import { verifyJWT,verifySuperAdmin,verifyStudent,verifyTeacher} from '../middlewares/auth.middleware.js';
import { orMiddleware } from '../middlewares/orMiddleware.js';

const router = Router();

router.get('/me',verifyJWT,verifyStudent,MarksController.getStudentMarks);
router.get('/teacher-data',verifyJWT,verifyTeacher,MarksController.getTeacherMarksData);
router.get('/superadmin-data',verifyJWT,verifySuperAdmin,MarksController.getSuperAdminData);
router.get('/student-data',verifyJWT,verifyStudent,MarksController.getStudentMarksData);

router.post('/add-class-marks',verifyJWT,verifyTeacher,MarksController.addClassMarks);
router.put('/update-class-marks',verifyJWT,verifyTeacher,MarksController.updateClassMarks);
router.post('/class-marklist-template',verifyJWT,orMiddleware([verifyTeacher,verifySuperAdmin]),MarksController.exportClassMarklistTemplate);
router.post('/class-marks-data',verifyJWT,verifySuperAdmin,MarksController.getClassMarksData);
router.post('/toggle-publish-exam-result',verifyJWT,orMiddleware([verifyTeacher,verifySuperAdmin]),MarksController.togglePublishExamResult);
router.post('/render-exam-marksheet',verifyJWT,verifyStudent,MarksController.renderExamMarksheet);
router.post('/consolidated-marksheet',verifyJWT,verifyStudent,MarksController.renderConsolidatedMarksheet);

export default router;
