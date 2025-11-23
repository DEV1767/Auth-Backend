import { body } from 'express-validator'

const userRegistervalidator = () => {
    return [
        body("email").trim().notEmpty().withMessage("Email is Required").isEmail().withMessage("Email is Invalid"),
        body("username").trim().notEmpty().withMessage("Username Required").isLowercase().withMessage("Username must be in lowercase").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
        body("password").trim().notEmpty().withMessage("Password is Required"),
        body("fullname").optional().trim(),
    ]
}

const userloginvalidator = () => {
    return [
        body("email").optional().isEmail().withMessage("Email is invalid"),
        body("password").notEmpty().withMessage("Password is Required"),
    ]
}

const userChangeCurrentpasswordvalidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword").notEmpty().withMessage("New Password is Required")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid")
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword").notEmpty().withMessage("Password is required")
    ]
}

export {
    userRegistervalidator,
    userloginvalidator,
    userChangeCurrentpasswordvalidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
}
