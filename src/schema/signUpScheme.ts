import { z } from "zod"

export const usernameSchema = z.string().min(4, "User Name need alteast 4 Characters").max(20, "User Name not longer than  20 Characters").regex(/^ [a - zA - Z0 -9_]{ 3, 16}$/, "User Name should not contains special character")

export const signUpValidation = z.object({
    username: usernameSchema,
    email: z.string().email({ message: "Email is not in Proper Format" }).trim(),
    password: z.string().min(6, { message: "Password need atleat 6 characters" }).max(20, { message: "Password not longer than  20 Characters" }),


})