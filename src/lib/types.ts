import { Prisma } from "@prisma/client"
import { ResumeValues } from "./validation"

export interface EditorFormProps {
  resumeData: ResumeValues
  setResumeData: (resumeData: ResumeValues) => void
}

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
  languages: true,
  personalProjects: true,
} satisfies Prisma.ResumeInclude

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude
}>
