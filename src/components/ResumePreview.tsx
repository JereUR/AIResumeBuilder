import useDimensions from "@/hooks/useDimensions"
import { cn } from "@/lib/utils"
import { ResumeValues } from "@/lib/validation"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Github, Linkedin, Globe, MapPin, Phone, Mail } from 'lucide-react'

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

