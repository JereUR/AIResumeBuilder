import { WandSparklesIcon } from "lucide-react"
import { useState } from "react"

import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/hooks/use-toast"
import { ResumeValues } from "@/lib/validation"
import { generateSummary } from "./actions"

interface GenerateSummaryButtonProps {
  resumeData: ResumeValues
  onSummaryGenerated: (summary: string) => void
}

export default function GenerateSummaryButton({ resumeData, onSummaryGenerated }: GenerateSummaryButtonProps) {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  async function handleClick() {
    try {
      setLoading(true)

      toast({
        description: "Functionality not implemented due to lack of budget",
      })

      const aiResponse = await generateSummary(resumeData)
      onSummaryGenerated(aiResponse)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton variant='outline' type='button' loading={loading} onClick={handleClick}>
      <WandSparklesIcon className="size-4" />
      Generate (AI)
    </LoadingButton>
  )
}
