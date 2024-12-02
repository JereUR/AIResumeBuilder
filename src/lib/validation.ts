import { z } from "zod"

const optionalString = z.string().trim().optional().or(z.literal(""))

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
})

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>
