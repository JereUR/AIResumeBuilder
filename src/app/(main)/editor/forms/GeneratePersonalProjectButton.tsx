import { WandSparkles } from "lucide-react"
import { useState } from "react"
import { Form, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { GeneratePersonalProjectInput, generatePersonalProjectSchema, PersonalProject } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { generatePersonalProject } from "./actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import LoadingButton from "@/components/LoadingButton"

interface GeneratePersonalProjectButtonProps {
  onPersonalProjectGenerated: (personalProject: PersonalProject) => void
}

export default function GeneratePersonalProjectButton({ onPersonalProjectGenerated }: GeneratePersonalProjectButtonProps) {
  const [showInputDialog, setShowInputDialog] = useState(false)

  return (
    <>
      <Button variant='outline' type="button" onClick={() => setShowInputDialog(true)}>
        <WandSparkles className="size-4" />
        Smart fill (AI)
      </Button>
      <InputDialog open={showInputDialog} onOpenChange={setShowInputDialog} onPersonalProjectGenerated={(personalProject) => {
        onPersonalProjectGenerated(personalProject)
        setShowInputDialog(false)
      }} />
    </>
  )
}

interface InputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPersonalProjectGenerated: (personalProject: PersonalProject) => void
}

function InputDialog({ open, onOpenChange, onPersonalProjectGenerated }: InputDialogProps) {
  const { toast } = useToast()

  const form = useForm<GeneratePersonalProjectInput>({
    resolver: zodResolver(generatePersonalProjectSchema),
    defaultValues: {
      description: "",
    }
  })

  async function onSubmit(input: GeneratePersonalProjectInput) {
    try {
      toast({
        description: "Functionality not implemented due to lack of budget",
      })

      const response = await generatePersonalProject(input)
      onPersonalProjectGenerated(response)

    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again."
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate personal project</DialogTitle>
          <DialogDescription>
            Describe this personal project and the AI will generate and optimized entry for you
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder={`E.g. "from nov 2019 to dec 2020 I developed an app called 'app name' using the technologies..."`} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>Generate</LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
