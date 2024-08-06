import DBConnection from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod"
import { usernameSchema } from '@/schema/signUpScheme'

const UsernameQuerySchema = z.object({
    username: usernameSchema
})

export async function GET(request: Request) {
    await DBConnection()
    try {
        const { searchPramas }: any = new URL(request.url);
        const queryPramas = {
            username: searchPramas.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryPramas)
        console.log(result); //remove

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "Error while username vaildation"
            }, { status: 400 })
        }

        const { username } = result.data
        const existedVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existedVerifiedUser) {
            return Response.json({
                success: false,
                message: "user is aleady taken"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "User is unique"
        }, { status: 200 })

    } catch (error) {
        console.error("checking userNmae", error)
        return Response.json({
            success: false,
            message: "Error while username vaildation"
        }, { status: 500 })
    }
}