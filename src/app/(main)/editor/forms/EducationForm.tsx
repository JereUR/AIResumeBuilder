import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"
import { GripHorizontal } from "lucide-react"

import { EditorFormProps } from "@/lib/types"
import { educationSchema, EducationValues } from "@/lib/validation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EducationForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return
      setResumeData({
        ...resumeData,
        educations: values.educations?.filter(edu => edu !== undefined) || []
      })
    })
    return unsubscribe
  }, [form, resumeData, setResumeData])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  })

  return (
    <div className="custom-scrollbar mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-sm text-muted-foreground">Add as many educations as you like.</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {fields.map((field, index) => (
            <EducationItem key={field.id} index={index} form={form} remove={remove} />
          ))}
          <div className="flex justify-center">
            <Button type="button" onClick={() => append({
              degree: '',
              institution: '',
              startDate: '',
              endDate: '',
            })}>Add education</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

interface EducationItemProps {
  form: UseFormReturn<EducationValues>
  index: number
  remove: (index: number) => void
}

function EducationItem({ form, index, remove }: EducationItemProps) {
  return <div className="space-y-3 border rounded-md bg-background p-3">
    <div className="flex justify-between gap-2">
      <span className="font-semibold">Education {index + 1}</span>
      <GripHorizontal className="size-5 cursor-grab text-muted-foreground" />
    </div>
    <FormField
      control={form.control}
      name={`educations.${index}.degree`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Degree</FormLabel>
          <FormControl>
            <Input {...field} autoFocus />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name={`educations.${index}.institution`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Institution</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name={`educations.${index}.startDate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start date</FormLabel>
            <FormControl>
              <Input {...field} type="date" value={field.value?.slice(0, 10)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`educations.${index}.endDate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>End date</FormLabel>
            <FormControl>
              <Input {...field} type="date" value={field.value?.slice(0, 10)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <FormDescription>
      Leave <span className="font-semibold">end date</span> empty if you are currently studying here
    </FormDescription>
    <div className="flex justify-end">
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  </div>
}
