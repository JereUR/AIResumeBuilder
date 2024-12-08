import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Github, Linkedin, Globe, MapPin, Phone, Mail } from 'lucide-react'
import { formatDate } from 'date-fns'

import useDimensions from "@/hooks/useDimensions"
import { cn } from "@/lib/utils"
import { ResumeValues } from "@/lib/validation"
import { Badge } from "./ui/badge"

interface ResumePreviewProps {
  resumeData: ResumeValues
  className?: string
}

export default function ResumePreview({ resumeData, className }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useDimensions(containerRef)

  return (
    <div ref={containerRef} className={cn("bg-white text-black h-fit w-full aspect-[210/297]", className)}>
      <div className={cn("space-y-6 p-6", !width && "invisible")} style={{
        zoom: (1 / 794) * width
      }}>
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <ProjectsSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  )
}

interface ResumeSectionProps {
  resumeData: ResumeValues
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, githubUrl, linkedinUrl, websiteUrl } = resumeData

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo)

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : ""

    if (objectUrl) setPhotoSrc(objectUrl)
    if (photo === null) setPhotoSrc("")

    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  const contactInfo = [
    { icon: MapPin, value: [city, country].filter(Boolean).join(', ') },
    { icon: Phone, value: phone },
    { icon: Mail, value: email }
  ].filter(item => item.value)

  const socialLinks = [
    { url: githubUrl, icon: Github, label: 'GitHub' },
    { url: linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
    { url: websiteUrl, icon: Globe, label: 'Website' }
  ].filter(link => link.url)

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={120}
          height={120}
          alt={`${firstName} photo`}
          className="aspect-square object-cover"
        />
      )}
      <div className="space-y-2.5 self-start">
        <div className="space-y-1">
          <p className="text-3xl font-bold">
            {firstName} {lastName}
          </p>
          <p className="font-medium">{jobTitle}</p>
        </div>
        <ul className="flex items-center space-x-4 text-xs text-gray-500">
          {contactInfo.map((item, index) => (
            <li key={index} className="flex items-center">
              <item.icon className="w-4 h-4 mr-1" />
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
        {socialLinks.length > 0 && (
          <>
            <hr className="my-2 border-gray-300" />
            <ul className="text-xs text-gray-500 space-y-1">
              {socialLinks.map((link, index) => (
                <li key={index} className="flex items-center">
                  <link.icon className="w-4 h-4 mr-2" />
                  <span>{link.url}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary } = resumeData

  if (!summary) return null

  return <>
    <hr className="border-2 border-gray-300" />
    <div className="space-y-3 break-inside-avoid">
      <p className="text-lg font-semibold">Professional profile</p>
      <div className="whitespace-pre-line text-sm">{summary}</div>
    </div>
  </>
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences } = resumeData

  const workExperiencesNotEmpty = workExperiences?.filter((exp) => Object.values(exp).filter(Boolean).length > 0)

  if (!workExperiencesNotEmpty?.length) return null

  return <>
    <hr className="border-2 border-gray-300" />
    <div className="space-y-3">
      <p className="text-lg font-semibold">Work Experience</p>
      {workExperiencesNotEmpty.map((exp, index) => (
        <div key={index} className="space-y-1 break-inside-avoid">
          <div className="flex items-center text-sm font-semibold justify-between">
            <span>{exp.position}</span>
            {exp.startDate && (
              <span>
                {formatDate(exp.startDate, "MM/yyyy")} - {" "}
                {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold">{exp.company}</p>
          <div className="whitespace-pre-line text-xs">
            {exp.description}
          </div>
        </div>
      ))}
    </div>
  </>
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations } = resumeData

  const educationsNotEmpty = educations?.filter((edu) => Object.values(edu).filter(Boolean).length > 0)

  if (!educationsNotEmpty?.length) return null

  return <>
    <hr className="border-2 border-gray-300" />
    <div className="space-y-3">
      <p className="text-lg font-semibold">Education</p>
      {educationsNotEmpty.map((edu, index) => (
        <div key={index} className="space-y-1 break-inside-avoid">
          <div className="flex items-center text-sm font-semibold justify-between">
            <span>{edu.degree}</span>
            {edu.startDate && (
              <span>
                {edu.startDate && `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold">{edu.institution}</p>
        </div>
      ))}
    </div>
  </>
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, languages } = resumeData

  if (!skills?.length && !languages?.length) return null

  return (
    <>
      <hr className="border-2 border-gray-300" />
      <div className="break-inside-avoid space-y-4">
        <p className="text-lg font-semibold">Skills & Languages</p>
        {skills && skills?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Technical Skills</p>
            <div className="flex break-inside-avoid flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} className="bg-primary text-white rounded-md hover:bg-primary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
        {languages && languages?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Languages</p>
            <div className="flex break-inside-avoid flex-wrap gap-2">
              {languages.map((language, index) => (
                <Badge key={index} className="bg-secondary text-secondary-foreground rounded-md hover:bg-secondary">
                  {language.name} - {language.level}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function ProjectsSection({ resumeData }: ResumeSectionProps) {
  const { projects } = resumeData

  if (!projects?.length) return null

  return (
    <>
      <hr className="border-2 border-gray-300" />
      <div className="space-y-3">
        <p className="text-lg font-semibold">Personal Projects</p>
        {projects.map((project, index) => (
          <div key={index} className="space-y-2 break-inside-avoid mb-4">
            <div className="flex items-center text-sm font-semibold justify-between">
              <span>{project.name}</span>
              {project.startDate && (
                <span>
                  {formatDate(project.startDate, "MM/yyyy")} - {" "}
                  {project.endDate ? formatDate(project.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            <div className="whitespace-pre-line text-xs font-normal">
              {project.description}
            </div>
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <span className="font-semibold text-sm">Technologies: </span>
                <div className="flex break-inside-avoid flex-wrap gap-2 mt-1 text-xs">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} className="bg-primary text-white rounded-md hover:bg-primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1 mt-1 text-sm">
              {project.linkDeploy && (
                <div>
                  <span className="font-semibold">Live Demo: </span>
                  <a href={project.linkDeploy} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {project.linkDeploy}
                  </a>
                </div>
              )}
              {project.linkCode && (
                <div>
                  <span className="font-semibold">Source Code: </span>
                  <a href={project.linkCode} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {project.linkCode}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
