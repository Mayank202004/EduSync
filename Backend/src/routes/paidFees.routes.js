import { Router } from 'express';
import * as PaidFeesController from '../controllers/paidFee.controller.js';
import { verifyJWT,verifySuperAdmin,verifyStudent} from '../middlewares/auth.middleware.js';

const router = Router();


router.get('/myfees',verifyJWT,verifyStudent,PaidFeesController.getStudentFeeStatus);

export default router;
