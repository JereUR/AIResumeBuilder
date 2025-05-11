'use client'
import ResumePreview from '@/components/ResumePreview';
import { ResumeServerData } from '@/lib/types';
import { mapToResumeValues } from '@/lib/utils';
import { formatDate } from 'date-fns';
import Link from 'next/link';

interface ResumeItemProps {
  resume: ResumeServerData
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const wasUpdated = resume.updatedAt !== resume.createdAt

  return (
    <div className='group border rounded-lg border-transparent hover:border-border transition-colors bg-secondary/60 dark:bg-secondary p-3 space-y-2'>
      <div className='space-y-3'>
        <Link href={`/editor?resumeId=${resume.id}`} className='inline-block w-full text-center'>
          <p className='font-semibold line-clamp-1'>{resume.title || "No title"}</p>
          {resume.description && (
            <p className='text-sm line-clamp-2'>{resume.description}</p>
          )}
          <p className='text-xs text-muted-foreground'>
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyy h:mm a")}
          </p>
        </Link>
      </div>
      <Link href={`/editor?resumeId=${resume.id}`} className='inline-block w-full'>
        <ResumePreview resumeData={mapToResumeValues(resume)} className='shadow-sm group-hover:shadow-lg transition-shadow' />
      </Link>
    </div>
  )
}
