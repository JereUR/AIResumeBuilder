'use client'

import { formatDate } from 'date-fns'
import { MoreVertical, Printer, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState, useTransition } from 'react'
import { useReactToPrint } from 'react-to-print'

import ResumePreview from '@/components/ResumePreview'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { ResumeServerData } from '@/lib/types'
import { mapToResumeValues } from '@/lib/utils'
import deleteResume from './actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LoadingButton from '@/components/LoadingButton'

interface ResumeItemProps {
  resume: ResumeServerData
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",

  })

  const wasUpdated = resume.updatedAt !== resume.createdAt

  return (
    <div className='group relative border rounded-lg border-transparent hover:border-border transition-colors bg-primary/70 dark:bg-primary p-3 space-y-2'>
      <div className='space-y-3'>
        <Link href={`/editor?resumeId=${resume.id}`} className='inline-block w-full text-center'>
          <p className='font-semibold line-clamp-1'>{resume.title || "No title"}</p>
          {resume.description && (
            <p className='text-sm line-clamp-2'>{resume.description}</p>
          )}
          <p className='text-xs text-muted dark:text-muted-foreground'>
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyy h:mm a")}
          </p>
        </Link>
        <Link href={`/editor?resumeId=${resume.id}`} className='relative inline-block w-full'>
          <ResumePreview resumeData={mapToResumeValues(resume)} contentRef={contentRef} className='overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow' />
          <div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent' />
        </Link>
      </div>
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
    </div>
  )
}

interface MoreMenuProps {
  resumeId: string
  onPrintClick: () => void
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild >
          <Button variant='ghost' size='icon' className='absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-secondary'>
            <MoreVertical className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className='flex items-center gap-2 cursor-pointer' onClick={() => setShowDeleteConfirmation(true)}>
            <Trash2 className='size-4' />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem className='flex items-center gap-2' onClick={onPrintClick}>
            <Printer className='size-4' />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog resumeId={resumeId} open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation} />
    </>
  )

}

interface DeleteConfirmationDialogProps {
  resumeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DeleteConfirmationDialog({ resumeId, open, onOpenChange }: DeleteConfirmationDialogProps) {
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId)
        onOpenChange(false)
        toast({
          title: "Resume deleted",
          description: "Your resume has been deleted.",
        })
      } catch (error) {
        console.error(error)
        toast({
          title: "Error deleting resume",
          description: "There was an error deleting your resume.",
          variant: "destructive",
        })
      }
    }
    )
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete resume?</DialogTitle>
        <DialogDescription>
          This will permanently delete this resume. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <LoadingButton variant='destructive' onClick={handleDelete} loading={isPending}>Delete</LoadingButton>
        <Button variant='secondary' onClick={() => onOpenChange(false)}>Cancel</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}