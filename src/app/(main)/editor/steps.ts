import { EditorFormProps } from "@/lib/types"
import GeneralInfoForm from "./forms/GeneralInfoForm"
import PersonalInfoForm from "./forms/PersonalInfoForm"
import WorkExperienceForm from "./forms/WorkExperienceForm"
import EducationForm from "./forms/EducationForm"
import SkillsForm from "./forms/SkillsForm"
import SummaryForm from "./forms/SummaryForm"
import LanguagesForm from "./forms/LanguagesForm"

export const steps: {
  title: string
  component: React.ComponentType<EditorFormProps>
  key: string
}[] = [
  {
    title: "General info",
    component: GeneralInfoForm,
    key: "general-info",
  },
  {
    title: "Personal info",
    component: PersonalInfoForm,
    key: "personal-info",
  },
  {
    title: "Work experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Education",
    component: EducationForm,
    key: "education",
  },
  {
    title: "Languages",
    component: LanguagesForm,
    key: "languages",
  },
  {
    title: "Skills",
    component: SkillsForm,
    key: "skills",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
]
