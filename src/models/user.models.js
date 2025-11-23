import mongoose, { Schema } from "mongoose";
import brcypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localpath: String,
        },
        default: {
            url: `https://placehold.co/200x200`,
            localpath: ""
        },
    },
    username: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refrehToken: {
        type: String
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: Date
    }
}, {
    timestamps: true,
},
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await brcypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await brcypt.compare(password, this.password)
};


userSchema.methods.generateAcessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,

    },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}


userSchema.methods.generateRefreshToken = function () {
    jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}


userSchema.methods.generateTemporryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex")

    const tokenExiry = Date.now() + (20 * 60 * 1000)
    return { unHashedToken, hashedToken, tokenExiry }
}


export const user = mongoose.model("User", userSchema)
