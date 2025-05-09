"use server"

import openai from "@/lib/openai"
import {
  GeneratePersonalProjectInput,
  generatePersonalProjectSchema,
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  PersonalProject,
  WorkExperience,
} from "@/lib/validation"

export async function generateSummary(input: GenerateSummaryInput) {
  const {
    jobTitle,
    workExperiences,
    educations,
    skills,
    personalProjects,
    languages,
  } = generateSummarySchema.parse(input)

  const systemMessage = `You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given to user's provided data. Only return the summary and do not include any other information. The summary should be concise, relevant and professional to the job title provided. The summary should be in English.`

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job Title: ${jobTitle || "N/A"}

    Work experience: ${workExperiences
      ?.map(
        (exp) => `
    Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}
    
    Description: ${exp.description || "N/A"}
    `,
      )
      .join("\n\n")}

    Education: ${educations
      ?.map(
        (edu) => `
    Degree: ${edu.degree || "N/A"} at ${edu.institution || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
    
    `,
      )
      .join("\n\n")}

    Skills:
    ${skills
      ?.map(
        (skill) => `
    - ${skill || "N/A"}`,
      )
      .join("\n")}

    Personal Projects: ${personalProjects
      ?.map(
        (project) => `
    Project Name: ${project.name || "N/A"} from ${project.startDate || "N/A"} to ${project.endDate || "N/A"}

    Description: ${project.description || "N/A"}

    Link to Deploy: ${project.linkDeploy || "N/A"}
    Link to Code: ${project.linkCode || "N/A"}

    Technologies used: ${project.technologies
      ?.map(
        (tech) => `
    - ${tech || "N/A"}`,
      )
      .join("\n")}`,
      )
      .join("\n\n")}

    Languages: ${languages
      ?.map(
        (lang) => `
    - ${lang || "N/A"}`,
      )
      .join("\n")}
  `

  console.log("systemMessage", systemMessage)
  console.log("userMessage", userMessage)

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  })

  const aiResponse = completion.choices[0].message.content

  if (!aiResponse) {
    throw new Error("Failed to generate AI response")
  }

  return aiResponse
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { description } = generateWorkExperienceSchema.parse(input)

  const systemMessage = `You are a job resume generator AI. Your task is to write a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be infered from the job title>
  `

  const userMessage = `Please generate a work experience entry from this description: ${description || "N/A"}
  `

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  })

  const aiResponse = completion.choices[0].message.content

  if (!aiResponse) {
    throw new Error("Failed to generate AI response")
  }

  return {
    position: aiResponse.match(/Job title: *(.*)/)?.[1] || "",
    company: aiResponse.match(/Company: *(.*)/)?.[1] || "",
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
  } satisfies WorkExperience
}

export async function generatePersonalProject(
  input: GeneratePersonalProjectInput,
) {
  const { description } = generatePersonalProjectSchema.parse(input)

  const systemMessage = `You are a job resume generator AI. Your task is to write a single personal project entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones.

  Name: <project name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be infered from the project name>
  Link to deploy: <link to deploy> (only if provided)
  Link to code: <link to code> (only if provided)
  Technologies used: <technologies used> (only if provided)
  `

  const userMessage = `Please generate a personal project entry from this description: ${description || "N/A"}
  `

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  })

  const aiResponse = completion.choices[0].message.content

  if (!aiResponse) {
    throw new Error("Failed to generate AI response")
  }

  return {
    name: aiResponse.match(/Name: *(.*)/)?.[1] || "",
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    linkDeploy: aiResponse.match(/Link to deploy: *(.*)/)?.[1] || "",
    linkCode: aiResponse.match(/Link to code: *(.*)/)?.[1] || "",
    technologies: aiResponse
      .match(/Technologies used:([\s\S]*)/)?.[1]
      ?.split(","),
  } satisfies PersonalProject
}
