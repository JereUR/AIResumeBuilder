import { z } from "zod"

const optionalString = z.string().trim().optional().or(z.literal(""))

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
})

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size < 1024 * 1024,
      "File must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
  websiteUrl: z.string().url().trim().optional().or(z.literal("")),
  linkedInUrl: z.string().url().trim().optional().or(z.literal("")),
  githubUrl: z.string().url().trim().optional().or(z.literal("")),
})

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
})

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number]

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        institution: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
})

export type EducationValues = z.infer<typeof educationSchema>

export const personalProjectsSchema = z.object({
  personalProjects: z
    .array(
      z.object({
        name: optionalString,
        description: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        linkDeploy: z.string().url().trim().optional().or(z.literal("")),
        linkCode: z.string().url().trim().optional().or(z.literal("")),
        technologies: z.array(z.string().trim()).optional(),
      }),
    )
    .optional(),
})

export type PersonalProjectsValues = z.infer<typeof personalProjectsSchema>

export type PersonalProject = NonNullable<
  z.infer<typeof personalProjectsSchema>["personalProjects"]
>[number]

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
})

export type SkillsValues = z.infer<typeof skillsSchema>

export const languageLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Native",
] as const

export const languagesSchema = z.object({
  languages: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        level: z.enum(languageLevels),
      }),
    )
    .optional(),
})

export type LanguagesValues = z.infer<typeof languagesSchema>

export type Language = NonNullable<
  z.infer<typeof languagesSchema>["languages"]
>[number]

export const summarySchema = z.object({
  summary: optionalString,
})

export type SummaryValues = z.infer<typeof summarySchema>

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...personalProjectsSchema.shape,
  ...skillsSchema.shape,
  ...languagesSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
})

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string
  photo?: File | string | null
}

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters long"),
})

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>

export const generatePersonalProjectSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters long"),
})

export type GeneratePersonalProjectInput = z.infer<
  typeof generatePersonalProjectSchema
>

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...personalProjectsSchema.shape,
  ...skillsSchema.shape,
  ...languagesSchema.shape,
})

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>
