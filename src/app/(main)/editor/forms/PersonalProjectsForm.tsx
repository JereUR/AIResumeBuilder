import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"
import { useEffect } from "react"
import { GripHorizontal } from "lucide-react"
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

import { EditorFormProps } from "@/lib/types"
import { personalProjectsSchema, PersonalProjectsValues } from "@/lib/validation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function PersonalProjectsForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<PersonalProjectsValues>({
    resolver: zodResolver(personalProjectsSchema),
    defaultValues: {
      projects: resumeData.projects || [],
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        projects: values.projects?.map((project) => ({
          ...project,
          technologies: Array.isArray(project?.technologies)
            ? project?.technologies.filter((tech): tech is string => !!tech)
            : [],
        })) || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);


  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "projects",
  })

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id)
      const newIndex = fields.findIndex(field => field.id === over.id)
      move(oldIndex, newIndex)
      return arrayMove(fields, oldIndex, newIndex)
    }
  }

  return <div className="custom-scrollbar mx-auto max-w-xl space-y-6">
    <div className="space-y-1.5 text-center">
      <h2 className="text-2xl font-semibold">Personal projects</h2>
      <p className="text-sm text-muted-foreground">Add as many projects as you like.</p>
    </div>
    <Form {...form}>
      <form className="space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            {fields.map((field, index) => (
              <ProjectItem key={field.id} id={field.id} index={index} form={form} remove={remove} />
            ))}
          </SortableContext>
        </DndContext>
        <div className="flex justify-center">
          <Button type="button" onClick={() => append({
            name: "",
            description: "",
            technologies: [],
            startDate: "",
            endDate: "",
            linkCode: "",
            linkDeploy: "",
          })}>Add project</Button>
        </div>
      </form>
    </Form>
  </div>
}

interface ProjectItemProps {
  id: string
  form: UseFormReturn<PersonalProjectsValues>
  index: number
  remove: (index: number) => void
}

function ProjectItem({ id, form, index, remove }: ProjectItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return <div className={cn("space-y-3 border rounded-md bg-background p-3", isDragging && "shadow-xl z-50 cursor-grab relative")} ref={setNodeRef} style={{
    transform: CSS.Transform.toString(transform),
    transition
  }}>
    <div className="flex justify-between gap-2">
      <span className="font-semibold">Project {index + 1}</span>
      <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none"
        {...attributes} {...listeners} />
    </div>
    <FormField
      control={form.control}
      name={`projects.${index}.name`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input {...field} autoFocus />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name={`projects.${index}.description`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name={`projects.${index}.startDate`}
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
        name={`projects.${index}.endDate`}
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
      Leave <span className="font-semibold">end date</span> empty if you are currently working here
    </FormDescription>
    <FormField
      control={form.control}
      name={`projects.${index}.linkCode`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Code link  <span className="text-muted-foreground">*</span></FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name={`projects.${index}.linkDeploy`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Deploy link  <span className="text-muted-foreground">*</span></FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormDescription>
      * Please enter a valid URL, starting with <strong>http://</strong> or <strong>https://</strong>. For example: <em>https://www.example.com</em>.
    </FormDescription>
    <FormField
      control={form.control}
      name={`projects.${index}.technologies`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Technologies</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="e.g. React.js, Next.js, Prisma, Javascript, ..." onChange={(e) => {
              const technologies = e.target.value.split(',')
              field.onChange(technologies)
            }} />
          </FormControl>
          <FormDescription>
            Separate each technology with a comma.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="flex justify-end">
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  </div>
}