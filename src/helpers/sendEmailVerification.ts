import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verficationEmail"
import { ApiResponces } from "@/type/ApiResponces";
import { error } from "console";

export async function VerificationEmailResponces(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponces> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Vrification Code | Sudhir Result',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {
            success: true,
            message: "veification send sucessfully"
        }
    } catch (emailerror) {
        console.error("Error in varification", emailerror);
        return {
            success: false,
            message: "fail in varification email"
        }

    }

}