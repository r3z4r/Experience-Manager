'use client'

import React from 'react'
import { WizardEngine } from '@/app/(frontend)/_components/Wizard/WizardEngine'
import { WizardJourney } from '@/lib/types/wizard'

interface WizardRunnerContentProps {
  journey: WizardJourney
}

export function WizardRunnerContent({ journey }: WizardRunnerContentProps) {
  if (!journey) {
    return <div className="p-8 text-center text-red-600">Journey not found</div>
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Header - Full width */}
      <header className="w-full bg-card border-b border-border py-4 px-6 flex items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{journey.label}</h1>
          {journey.description && <p className="text-muted-foreground text-sm mt-1">{journey.description}</p>}
        </div>
      </header>
      
      {/* Main content - Takes remaining height */}
      <main className="flex-1 w-full overflow-auto p-6">
        <WizardEngine journey={journey} />
      </main>
    </div>
  )
}
