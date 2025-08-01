import { Router } from 'express';
import * as ResourceController from '../controllers/resource.controller.js';
import { verifyJWT,verifySuperAdmin, verifyTeacher } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/add-class',verifyJWT,verifySuperAdmin, ResourceController.addClass);
router.get('/classes', verifyJWT,verifySuperAdmin,ResourceController.getAllClasses);
router.get('/classes/:classNumber', ResourceController.getClassByNumber);
router.post('/add-subject',verifyJWT,verifySuperAdmin, ResourceController.addSubject);
router.post('/add-chapter',verifyJWT,verifySuperAdmin, ResourceController.addChapter);
router.get('/me',verifyJWT, ResourceController.getMyResources);
router.route("/add-resource").post(verifyJWT,verifySuperAdmin, upload.array("files", 10), ResourceController.addResource);
router.delete('/classes/:classNumber',verifySuperAdmin, ResourceController.deleteClass);
router.route('/teacher').get(verifyJWT,verifyTeacher,ResourceController.getTeacherResources);
router.delete('/delete-resource',verifyJWT,verifySuperAdmin, ResourceController.deleteResource);

export default router;
