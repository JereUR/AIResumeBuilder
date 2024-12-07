import ResumePreview from "@/components/ResumePreview"
import { ResumeValues } from "@/lib/validation"

interface ResumePreviewSectionProps {
  resumeData: ResumeValues
  setResumeData: (resumeData: ResumeValues) => void
}
export default function ResumePreviewSection({ resumeData, setResumeData }: ResumePreviewSectionProps) {
  return (
    <div className="hidden w-1/2 md:flex">
      <div className="flex w-full justify-center overflow-y-auto bg-gray-300 dark:bg-accent/40 p-3">
        <ResumePreview resumeData={resumeData} className="max-w-2xl shadow-md" />
      </div>
    </div>
  )
}
