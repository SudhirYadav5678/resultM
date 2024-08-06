import DBConnection from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request) {
    await DBConnection()
    try {
        const { username, verifyCode } = await request.json()
        const decodedUser = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUser })
        if (!user) {
            return Response.json({
                success: false,
                message: "Error while user found"
            }, { status: 400 })
        }
        const isCodeVaild = user.verifyCode === verifyCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isCodeVaild && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "OTP is verified"
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code expired"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Code is incorrect"
            }, { status: 400 })
        }

    } catch (error) {
        console.error("checking userNmae", error)
        return Response.json({
            success: false,
            message: "Error while otp vaildation"
        }, { status: 500 })
    }
}