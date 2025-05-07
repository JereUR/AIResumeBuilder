import { Metadata } from "next"
import ResumeEditor from "./ResumeEditor"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { resumeDataInclude } from "@/lib/types"

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>
}

export const mettadat: Metadata = {
  title: "Design your resume",
}

export default async function EditorPage({ searchParams }: PageProps) {
  const { resumeId } = await searchParams

  const { userId } = await auth()

  if (!userId) {
    throw new Error("User not authenticated")
  }

  const resumeToEdit = resumeId ? await prisma.resume.findUnique({
    where: {
      id: resumeId, userId
    },
    include: resumeDataInclude
  }) : null

  return <ResumeEditor resumeToEdit={resumeToEdit} />
}
