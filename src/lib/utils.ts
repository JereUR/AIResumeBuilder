import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "./types"
import { ResumeValues } from "./validation"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        type: value.type,
        size: value.size,
        lastModified: value.lastModified,
      }
    : value
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    email: data.email || undefined,
    jobTitle: data.jobTitle || undefined,
    phone: data.phone || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    websiteUrl: data.websiteUrl || undefined,
    linkedInUrl: data.linkedInUrl || undefined,
    githubUrl: data.githubUrl || undefined,
    workExperiences: data.workExperiences.map((workExperience) => ({
      company: workExperience.company || undefined,
      position: workExperience.position || undefined,
      startDate: workExperience.startDate?.toISOString().split("T")[0],
      endDate: workExperience.endDate?.toISOString().split("T")[0],
      description: workExperience.description || undefined,
    })),
    educations: data.educations.map((education) => ({
      institution: education.institution || undefined,
      degree: education.degree || undefined,
      startDate: education.startDate?.toISOString().split("T")[0],
      endDate: education.endDate?.toISOString().split("T")[0],
    })),
    languages: data.languages.map((language) => ({
      name: language.name,
      level: language.level || undefined,
    })),
    personalProjects: data.personalProjects.map((project) => ({
      name: project.name || undefined,
      description: project.description || undefined,
      startDate: project.startDate?.toISOString().split("T")[0],
      endDate: project.endDate?.toISOString().split("T")[0],
      linkDeploy: project.linkDeploy || undefined,
      linkCode: project.linkCode || undefined,
      technologies: project.technologies.map((tech) => tech),
    })),
    skills: data.skills.map((skill) => skill),
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  }
}
