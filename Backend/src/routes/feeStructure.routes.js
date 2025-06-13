import { Router } from 'express';
import * as FeeStructureController from '../controllers/feeStructure.controller.js'
import { verifyJWT,verifySuperAdmin} from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/add',verifyJWT,verifySuperAdmin,FeeStructureController.addFeeStructure);
router.get('/all',verifyJWT,FeeStructureController.getAllFeeStructures);
router.get('/:className',verifyJWT,FeeStructureController.getClassFeeStructure);
router.put('/set-due-date',verifyJWT,verifySuperAdmin,FeeStructureController.setDueDate);
router.delete('/delete',verifyJWT,verifySuperAdmin,FeeStructureController.deleteFeeType);
router.put('/update',verifyJWT,verifySuperAdmin,FeeStructureController.updateFeeStructure);

export default router;
