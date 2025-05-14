"use server"

import { auth } from "@clerk/nextjs/server"
import { del } from "@vercel/blob"
import { revalidatePath } from "next/cache"

import prisma from "@/lib/prisma"

export default async function deleteResume(resumeId: string) {
  "use server"
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const resume = await prisma.resume.findUnique({
    where: {
      id: resumeId,
    },
  })

  if (!resume) {
    throw new Error("Resume not found")
  }

  if (resume.userId !== userId) {
    throw new Error("Unauthorized")
  }

  if (resume.photoUrl) {
    await del(resume.photoUrl)
  }

  await prisma.resume.delete({
    where: {
      id: resumeId,
    },
  })

  revalidatePath("/resumes")
}
