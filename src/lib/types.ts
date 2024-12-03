import { ResumeValues } from "./validation"

export interface EditorFormProps {
  resumeData: ResumeValues
  setResumeData: (resumeData: ResumeValues) => void
}
