import { z } from "zod"

export const userVerification = z.object({
    code: z.string().length(6, "Code should be in 6 character.")
})