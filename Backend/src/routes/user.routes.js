import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", userController.registerUser);
router.route("/login").post(userController.loginUser);
router.route("/verify-otp").post(userController.verifyOtp);
router.route("/resend-otp").post(userController.resendOtp);
router.route("/refresh-token").post(userController.refreshAccessToken)

// Secured Routes
router.route("/logout").post(verifyJWT, userController.logoutUser);
router.route("/change-password").post(verifyJWT, userController.changeUserPassword)
router.route("/me").get(verifyJWT, userController.getCurrentUser);
router.route("/update").put(verifyJWT, userController.updateUser);
router.route("/update-avatar").put(verifyJWT,upload.single("avatar"),userController.updateUserAvatar);
router.route("/bulk-register-students").post(verifyJWT,upload.single("file"),verifySuperAdmin,userController.bulkRegisterStudents);
router.route("/register-student").post(verifyJWT,verifySuperAdmin,userController.createStudentByAdmin);


export default router;
