import { Router } from "express";
import { forgotPasswordrequest, getCurrentUser, login, RefreshAccessToken, ResendEmailVerification, ResetPassword, verifyEmail } from "../controllers/auth.controller.js"
import { logoutUser } from "../controllers/auth.controller.js";
import { RegisterUser } from "../controllers/auth.controller.js"
import { validate } from "../middlewares/validator.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { userChangeCurrentpasswordvalidator, userRegistervalidator, userloginvalidator,userForgotPasswordValidator,userResetForgotPasswordValidator } from "../validators/index.js";


const router = Router()


//unsecureRoute
router.route("/register").post(userRegistervalidator(), validate, RegisterUser)
router.route("/login").post(userloginvalidator(), validate, login)
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/refresh-Token").post(RefreshAccessToken)
router.route("/forgot-password").post( userForgotPasswordValidator(),validate,forgotPasswordrequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,ResetPassword)


//secureRoute
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/current-user").post(verifyJwt,getCurrentUser)
router.route("/change-password").post(verifyJwt,userChangeCurrentpasswordvalidator(),validate, getCurrentUser)
router.route("/reset-email-verification").post(verifyJwt,ResendEmailVerification)




export default router;