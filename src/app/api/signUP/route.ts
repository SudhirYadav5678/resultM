import DBConnection from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { VerificationEmailResponces } from '../../../helpers/sendEmailVerification'

export async function POST(request: Request) {
    await DBConnection()
    try {
        const { username, email, password, phone, } = await request.json()

        //existing user
        const existingUserVerifiedByUsernane = await UserModel.findOne({ username, isVerified: true })
        if (existingUserVerifiedByUsernane) {
            return Response.json({
                success: false,
                message: "User already verified",
            }, { status: 400 })
        }

        //existing user by email 
        const existingUserVerifiedByEmail = await UserModel.findOne({ email })

        const verifiyOTP = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user alreday with email"
                }, { status: 400 })
            } else {
                const hashPassword = await bcrypt.hash(password, 10)
                existingUserVerifiedByEmail.password = hashPassword,
                    existingUserVerifiedByEmail.verifyCode = verifiyOTP,
                    existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000),

                    await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newuser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode: verifiyOTP,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            })
            await newuser.save();
        }

        //verification email
        const verify = await VerificationEmailResponces(email, username, verifiyOTP);
        console.log(verify);

        if (!verify.success) {
            return Response.json({
                success: false,
                message: verify.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User register successfully"
        }, { status: 200 })
    }

    catch (error) {
        console.error("Error while register User", error)
        return Response.json({
            success: false,
            message: "Error while register User"
        }, { status: 500 })
    }
}
