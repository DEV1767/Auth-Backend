import { user } from "../models/user.models.js";
import { ApiResponse } from "../utils/api_response.js";
import { Apierror } from "../utils/api_error.js";
import { asynchandler } from "../utils/async_handler.js";
import jwt from "jsonwebtoken"
// import { emailVerificationmailgenContent, sendEmail } from "../utils/mail.js";

const generateandrefreshtoken = async (userId) => {
    try {
        const User = await user.findById(userId);

        if (!User) {
            throw new Apierror(404, "User not found");
        }

        const refreshToken = User.generateRefreshToken();
        const accessToken = User.generateAcessToken();

        User.refreshToken = refreshToken;
        await User.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new Apierror(500, "Something went wrong while generating tokens");
    }
};

const RegisterUser = asynchandler(async (req, res) => {


    if (!req.body) {
        throw new Apierror(400, "Request body is missing");
    }

    const { email, username, password, role } = req.body;

    if (!email || !username || !password) {
        throw new Apierror(400, "email, username and password are required");
    }


    const existedUser = await user.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new Apierror(409, "User with email or username already exists");
    }


    const User = await user.create({
        email,
        password,
        username,
        role,
        isEmailVerified: false
    });


    const { hashedToken, tokenExpiry } = User.generateTemporryToken();

    User.emailVerificationExpiry = tokenExpiry;
    User.emailVerificationToken = hashedToken;

    await User.save({ validateBeforeSave: false });

    /*  
    await sendEmail({
        email: User.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationmailgenContent(
            User.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });
    */


    const createdUser = await user.findById(User._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if (!createdUser) {
        throw new Apierror(500, "Something went wrong");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            { user: createdUser },
            "User Registered Successfully"
        )
    );
});

const login = asynchandler(async (req, res) => {
    const { email, password, username } = req.body

    if (!email) {
        throw new Apierror(400, " Email is required")
    }

    const User = await user.findOne({ email })
    if (!User) {
        throw Apierror(400, "User does not exists.")
    }
    const isPassvalid = await User.isPasswordCorrect(password)
    if (!isPassvalid) {
        throw new Apierror(400, "Invalid Password")
    }
    const { accessToken, refreshToken } = await generateandrefreshtoken(User._id)

    const loginUser = await user.findById(User._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loginUser

                },
                "User Logged in sucessfully"
            )
        )

})

const logoutUser = asynchandler(async (req, res) => {
    await user.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refrehToken: ""
            }
        },
        {
            new: true
        }

    );
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out")
        )
});

const getCurrentUser = asynchandler(async (req, res) => {
    return res
        .status(200)
        .json(
          new  ApiResponse(200,
                req.user,
                "Current User Fetched SucessFully"))
})

const verifyEmail = asynchandler(async (req, res) => {
    const { verificationToken } = req.params
    if (!verificationToken) {
        throw new (ApiResponse(400, "Email Verification token is missing"))
    }

    let hashedToken = crypto.createHash("sha256")
        .update(verificationToken)
        .digest("hex")
    await user.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: { $gt: Date.now() }
    })
    if (!user) {
        throw new Apierror(400, "Token is Invalid or Expirred")
    }
    user.emailVerificationExpiry = undefined
    user.emailVerificationToken = undefined

    user.isEmailVerified = true
    await user.save({ validateBeforSave: false })
    return res.status(200,
        {
            isEmailVerified: true
        },
        "Email is Verified"
    )
})

const ResendEmailVerification = asynchandler(async (req, res) => {
    const User = await user.findById(req.user?._id)
    if (!user) {
        throw new Apierror(400, "User Does not Exist")
    }
    if (user.isEmailVerified) {
        throw new Apierror(409, "Email is already Verified")
    }
    const { hashedToken, tokenExpiry } = User.generateTemporryToken();

    User.emailVerificationExpiry = tokenExpiry;
    User.emailVerificationToken = hashedToken;

    await User.save({ validateBeforeSave: false });

    /*  
    await sendEmail({
        email: User.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationmailgenContent(
            User.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });
    */
    return res.status(200)
        .json(new ApiResponse(200, "Mail has been sent to your Email id"))
})

const RefreshAccessToken = asynchandler(async (req, res) => {
    const incomingToken = req.cookie.refrehToken || req.body.refrehToken
    if (!incomingToken) {
        throw new Apierror(401, "Unauthorized Access")
    }
    try {
        const dcoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)

        const User = await user.findById(dcoded?._id);
        if (!User) {
            throw new Apierror(401, "Invalid refreshh token")
        }
        if (incomingToken !== user?.refrehToken) {
            throw new Apierror(401, "RefreshToken is Expired")
        }
        const options = {
            httpOnly: true,
            secure: true

        }
        const { accessToken, refrehToken: newRefreshToken } = await generateandrefreshtoken(user._id)
        user.refrehToken = newRefreshToken
        await user.save()
        return res.status(200)
            .cookie("acessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(200, { accessToken, refrehToken: newRefreshToken },
                    "Access Token Refreshed"
                )
            )
    } catch (error) {
        throw new Apierror(401, "Invalid refresh Token")
    }
})

const forgotPasswordrequest = asynchandler(async (req, res) => {
    const { email } = req.body
    const User = await user.findOne({ email })
    if (!User) {
        throw new Apierror(404, "User Does not exists", [])
    }

    const { unHashedToken, hashedToken, tokenExpiry } =
        User.generateTemporryToken();

    User.forgotPasswordToken = hashedToken
    User.forgotPasswordExpiry = tokenExpiry

    await User.save({ validateBeforeSave: false })

    await sendEmail({
        email: User.email,
        subject: "Please verify your email",
        mailgenContent: forgotPasswordMailgenContent(
            User.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password Reset mail has been sent"))


})

const changeCurrentPassword = asynchandler(async (req, res) => {

    const { oldpassword, newPassword } = req.body
    const User = await user.findById(res.user?._id)

    const isPasswordValid = await User.isPasswordCorrect(oldpassword)

    if (!isPasswordValid) {
        throw new Apierror(400, "Invalid Old Password")
    }
    user.password = newPassword
    await user.save({ validateBeforSave: false })
    return res.status(200)
        .json(
            new ApiResponse(200,
                {},
                "Password Changed Sucessfully"
            )
        )
})

const ResetPassword = asynchandler(async (req, res) => {
    const { resetToken } = req.params
    const { newPassword } = req.body

    let hashedToken = crypto
        .createHash("sha56")
        .update(resetToken)
        .digest("hex")
    const User = await user.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })
    if (!User) {
        throw new Apierror(489, "Token is Invalid or expired")
    }

    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined

    user.password = newPassword
    await user.save({ validateBeforSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password Reset Sucessfully"))

})



export {
    RegisterUser, login, logoutUser, getCurrentUser, verifyEmail,
    ResendEmailVerification, RefreshAccessToken, forgotPasswordrequest, changeCurrentPassword,ResetPassword
};
