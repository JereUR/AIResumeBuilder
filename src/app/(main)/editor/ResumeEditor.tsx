'use client'

import { useSearchParams } from "next/navigation"

import { steps } from "./steps"
import Breadcrumbs from "./Breadcrumbs"
import Footer from "./Footer"
import { useState } from "react"
import { ResumeValues } from "@/lib/validation"

export default function ResumeEditor() {
  const searchParams = useSearchParams()

  const [resumeData, setResumeData] = useState<ResumeValues>({})

  const currentStep = searchParams.get('step') || steps[0].key

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('step', key)
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)
  }

  const FormComponent = steps.find(step => step.key === currentStep)?.component

  return (
    <div className="flex flex-col h-screen">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">Follow the steps below to create your resume. Your progress will be saved automatically</p>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <div className="w-full md:w-1/2 overflow-y-auto custom-scrollbar space-y-6 p-3">
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && <FormComponent resumeData={resumeData} setResumeData={setResumeData} />}
          </div>
          <div className="hidden md:block w-1/2 p-3 border-l">Right</div>
        </div>
      </main>
      <Footer currentStep={currentStep} setCurrentStep={setStep} />
    </div>
  )
}

