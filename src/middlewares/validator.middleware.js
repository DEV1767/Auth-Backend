import { validationResult } from "express-validator"
import { Apierror } from "../utils/api_error.js"





export const validate = (req, res, next) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        return next()
    }
    const extractederror = []
    error.array().map((err) => extractederror.push(
        {
            [err.path]: err.msg

        }))
        throw new Apierror(422,"Recieved data is not valid",extractederror)
}
