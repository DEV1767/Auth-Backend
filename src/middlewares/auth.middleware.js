import { user } from "../models/user.models.js"
import { Apierror } from "../utils/api_error.js"
import { asynchandler } from "../utils/async_handler.js"
import jwt from "jsonwebtoken"

export const verifyJwt = asynchandler(async (req, res, next) => {

    

    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")

    

    if (!token) {
        throw new Apierror(401, "Unauthorized request")
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const User = await user.findById(decoded?._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        )

        if (!User) {
            throw new Apierror(401, "Invalid Access Token")
        }

        req.user = User
        next()

    } catch (error) {
        throw new Apierror(401, "Invalid Access Token")
    }
})
