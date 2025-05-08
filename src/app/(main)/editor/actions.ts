"use server"

import prisma from "@/lib/prisma"
import { ResumeValues } from "@/lib/validation"

export async function saveResume(values: ResumeValues) {
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

  const photoUrl = typeof photo === "string" ? photo : undefined

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

  const data = {
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
    photoUrl,
    skills,
    borderStyle,
    colorHex,
    summary,
    updatedAt: new Date(),
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
  }

  const updatedResume = await prisma.resume.update({
    where: { id },
    data,
    include: {
      workExperiences: true,
      educations: true,
      languages: true,
      personalProjects: true,
    },
  })

  return updatedResume
}
