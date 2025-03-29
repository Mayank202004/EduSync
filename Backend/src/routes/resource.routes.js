import express from 'express';
import * as ResourceController from '../controllers/resource.controller.js';
import { verifyJWT,verifySuperAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/add-class',verifyJWT,verifySuperAdmin, ResourceController.addClass);
router.get('/classes', verifyJWT,verifySuperAdmin,ResourceController.getAllClasses);
router.get('/classes/:classNumber', ResourceController.getClassByNumber);
router.post('/add-subject',verifyJWT,verifySuperAdmin, ResourceController.addSubject);
router.post('/add-chapter',verifyJWT,verifySuperAdmin, ResourceController.addChapter);
router.get('/me',verifyJWT, ResourceController.getMyResources);
router.post('/classes/:classNumber/subjects/:subjectName/terms/:termNumber/chapters/:chapterTitle/resources',verifySuperAdmin, ResourceController.addResource);
router.delete('/classes/:classNumber',verifySuperAdmin, ResourceController.deleteClass);

export default router;
