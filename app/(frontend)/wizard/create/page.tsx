'use client'

import { JourneyFormContainer } from '@/app/(frontend)/wizard/_components/JourneyFormContainer'
import { DEFAULT_LOCALIZATION_CONFIG } from '@/lib/constants/localization'

/**
 * Create Journey Page
 * 
 * This page allows users to create a new journey by providing a name, slug, and configuring
 * steps and localization settings. It uses the shared JourneyFormContainer component to
 * maintain consistency with the edit page.
 */
export default function WizardCreatePage() {
  return (
    <JourneyFormContainer
      initialJourney={{
        id: '',
        label: '',
        slug: '',
        steps: [],
        localization: DEFAULT_LOCALIZATION_CONFIG
      }}
      description="Create a new journey by providing a name, slug, and configuring steps and localization settings."
    />
  )
}
