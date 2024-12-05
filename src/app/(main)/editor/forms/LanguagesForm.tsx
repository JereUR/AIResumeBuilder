
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"

import { EditorFormProps } from "@/lib/types"
import { languagesSchema, LanguagesValues, languageLevels } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export default function LanguagesForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<LanguagesValues>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      languages: resumeData.languages || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages",
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      const validLanguages = values.languages?.filter(
        (lan): lan is { name: string; level: typeof languageLevels[number] } =>
          !!lan?.name && !!lan?.level && languageLevels.includes(lan.level)
      ) || [];

      setResumeData({
        ...resumeData,
        languages: validLanguages,
      });
    });

    return unsubscribe;
  }, [form, resumeData, setResumeData]);


  return (
    <div className="custom-scrollbar mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Languages</h2>
        <p className="text-sm text-muted-foreground">What are you good at?</p>
      </div>
      <Form {...form}>
        <form className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-3 border rounded-md bg-background p-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`languages.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input
                          {...field} autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`languages.${index}.level`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languageLevels.map((level) => (
                            <SelectItem key={level} value={level} className="cursor-pointer">
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="destructive" type="button" onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => append({ name: "", level: "Beginner" })}
            >
              Add Language
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

