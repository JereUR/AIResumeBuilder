"use server"

import prisma from "@/lib/prisma"
import type { ResumeValues } from "@/lib/validation"
import { auth } from "@clerk/nextjs/server"
import { del, put } from "@vercel/blob"
import path from "path"

export async function saveResume(values: ResumeValues) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("User not authenticated")
  }

  const {
    id,
    title,
    description,
    firstName,
    lastName,
    jobTitle,
    phone,
    email,
    city,
    country,
    websiteUrl,
    linkedInUrl,
    githubUrl,
    photo,
    skills,
    borderStyle,
    colorHex,
    summary,
    workExperiences,
    educations,
    languages,
    personalProjects,
  } = values

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null

  if (id && !existingResume) {
    throw new Error("Resume not found")
  }

  let newPhotoUrl: string | undefined | null = undefined

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl)
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    })

    newPhotoUrl = blob.url
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl)
    }
    newPhotoUrl = null
  }

  const parsedWorkExperiences = (workExperiences ?? []).map((exp) => ({
    company: exp.company ?? "",
    position: exp.position ?? "",
    startDate: exp.startDate ? new Date(exp.startDate) : undefined,
    endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    description: exp.description ?? "",
  }))

  const parsedEducations = (educations ?? []).map((edu) => ({
    institution: edu.institution ?? "",
    degree: edu.degree ?? "",
    startDate: edu.startDate ? new Date(edu.startDate) : undefined,
    endDate: edu.endDate ? new Date(edu.endDate) : undefined,
  }))

  const parsedLanguages = (languages ?? []).map((lang) => ({
    name: lang.name ?? "",
    level: lang.level ?? "",
  }))

  const parsedProjects = (personalProjects ?? [])
    .filter((project) => {
      return (
        project.name?.trim() ||
        project.description?.trim() ||
        project.linkCode?.trim() ||
        project.linkDeploy?.trim() ||
        project.technologies
      )
    })
    .map((project) => ({
      name: project.name ?? "",
      description: project.description ?? "",
      startDate: project.startDate ? new Date(project.startDate) : undefined,
      endDate: project.endDate ? new Date(project.endDate) : undefined,
      linkDeploy: project.linkDeploy ?? "",
      linkCode: project.linkCode ?? "",
      technologies: project.technologies ?? [],
    }))

  const commonData = {
    title,
    description,
    firstName,
    lastName,
    jobTitle,
    phone,
    email,
    city,
    country,
    websiteUrl,
    linkedInUrl,
    githubUrl,
    photoUrl: newPhotoUrl,
    skills: skills || [],
    borderStyle: borderStyle || "squircle",
    colorHex: colorHex || "#000000",
    summary,
    updatedAt: new Date(),
  }

  if (!id) {
    const newResume = await prisma.resume.create({
      data: {
        ...commonData,
        userId,
        workExperiences: {
          create: parsedWorkExperiences,
        },
        educations: {
          create: parsedEducations,
        },
        languages: {
          create: parsedLanguages,
        },
        personalProjects: {
          create: parsedProjects,
        },
      },
      include: {
        workExperiences: true,
        educations: true,
        languages: true,
        personalProjects: true,
      },
    })
    return newResume
  }

  const updatedResume = await prisma.resume.update({
    where: { id },
    data: {
      ...commonData,
      workExperiences: {
        deleteMany: {},
        create: parsedWorkExperiences,
      },
      educations: {
        deleteMany: {},
        create: parsedEducations,
      },
      languages: {
        deleteMany: {},
        create: parsedLanguages,
      },
      personalProjects: {
        deleteMany: {},
        create: parsedProjects,
      },
    },
    include: {
      workExperiences: true,
      educations: true,
      languages: true,
      personalProjects: true,
    },
  })

  return updatedResume
}
