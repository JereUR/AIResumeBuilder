"use client"

import { WandSparkles } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  type GeneratePersonalProjectInput,
  generatePersonalProjectSchema,
  type PersonalProject,
} from "@/lib/validation"
import { generatePersonalProject } from "./actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import LoadingButton from "@/components/LoadingButton"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form"

interface GeneratePersonalProjectButtonProps {
  onPersonalProjectGenerated: (personalProject: PersonalProject) => void
}

export default function GeneratePersonalProjectButton({
  onPersonalProjectGenerated,
}: GeneratePersonalProjectButtonProps) {
  const [showInputDialog, setShowInputDialog] = useState(false)

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setShowInputDialog(true)}>
        <WandSparkles className="size-4" />
        Smart fill (AI)
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onPersonalProjectGenerated={(personalProject) => {
          onPersonalProjectGenerated(personalProject)
          setShowInputDialog(false)
        }}
      />
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
    },
  })

  async function onSubmit(input: GeneratePersonalProjectInput) {
    try {
      const response = await generatePersonalProject(input)
      onPersonalProjectGenerated(response)
    } catch (error: unknown) {
      console.error(error)
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`E.g. "from nov 2019 to dec 2020 I developed an app called 'app name' using the technologies..."`}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="button" onClick={form.handleSubmit(onSubmit)} loading={form.formState.isSubmitting}>
              Generate
            </LoadingButton>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
