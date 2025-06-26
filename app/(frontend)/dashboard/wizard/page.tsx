// Journeys list/management page
'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { WizardJourney } from '@/lib/types/wizard'
import { WizardHeader } from '@/app/(frontend)/_components/Wizard/WizardHeader'
import { fetchJourneysAction } from '@/app/(frontend)/_actions/fetchJourneys'
import { CopyToClipboard } from '@/app/(frontend)/_components/CopyToClipboard'
import {
  LinkIcon,
  ExternalLinkIcon,
  PencilIcon,
  GlobeIcon,
  UsersIcon,
  LayersIcon,
  LanguagesIcon,
  CurrencyIcon,
} from 'lucide-react'

export default function JourneysListPage() {
  const [journeys, setJourneys] = useState<WizardJourney[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setLoading(true)
        const data = await fetchJourneysAction()
        setJourneys(data)
        setError(null)
      } catch (e: any) {
        setError(e.message || 'Failed to load journeys')
      } finally {
        setLoading(false)
      }
    }

    loadJourneys()
  }, [])

  // Function to generate a consistent thumbnail background based on journey ID
  const getGradientBackground = (id: string) => {
    // Create a simple hash from the journey ID
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Use the hash to generate colors
    const hue1 = hash % 360
    const hue2 = (hash * 7) % 360

    return `linear-gradient(135deg, hsl(${hue1}, 80%, 75%), hsl(${hue2}, 80%, 65%))`
  }

  // Function to get step count summary
  const getStepSummary = (journey: WizardJourney) => {
    const stepCount = journey.steps?.length || 0
    return `${stepCount} step${stepCount !== 1 ? 's' : ''}`
  }

  // Function to get localization summary
  const getLocalizationSummary = (journey: WizardJourney) => {
    const languageCount = journey.localization?.languages?.length || 0
    const currencyCount = journey.localization?.currencies?.length || 0

    return {
      languages: languageCount,
      currencies: currencyCount,
      showLanguageSelector: journey.localization?.showLanguageSelector || false,
      showCurrencySelector: journey.localization?.showCurrencySelector || false,
    }
  }

  return (
    <>
      <WizardHeader title="Journeys" />
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Journeys</h1>
            <p className="text-gray-500 mt-1">Create and manage your wizard journeys</p>
          </div>
          <Link
            href="/wizard/create"
            className="button-primary button-lg flex items-center gap-2 px-6 py-2.5 shadow-sm hover:shadow transition-all"
          >
            <LayersIcon className="w-5 h-5" />
            Create Journey
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading journeys...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <div>
              <h3 className="font-medium">Error loading journeys</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && journeys?.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <LayersIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No journeys found</h3>
            <p className="text-gray-500 mb-6">Create your first journey to get started</p>
            <Link
              href="/wizard/create"
              className="button-primary button-md inline-flex items-center gap-2"
            >
              <LayersIcon className="w-4 h-4" />
              Create Journey
            </Link>
          </div>
        )}

        {!loading && !error && journeys?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map((journey) => {
              const localization = getLocalizationSummary(journey)

              return (
                <div
                  key={journey.id}
                  className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Journey thumbnail */}
                  <div
                    className="h-40 relative flex items-center justify-center"
                    style={{ background: getGradientBackground(journey.id) }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">
                        {journey.label}
                      </h3>
                    </div>
                  </div>
                  {/* Journey details */}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="space-y-4 flex-grow">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{journey.label}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {getStepSummary(journey)}
                          </span>
                        </div>

                        {journey.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {journey.description}
                          </p>
                        )}
                      </div>
                      {/* Localization info */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <GlobeIcon className="w-4 h-4 text-gray-400" />
                          <span>
                            {localization.languages} language
                            {localization.languages !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <CurrencyIcon className="w-4 h-4 text-gray-400" />
                          <span>
                            {localization.currencies} currenc
                            {localization.currencies !== 1 ? 'ies' : 'y'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      {/* URL section */}
                      {journey.slug && (
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100 text-sm mb-2">
                          <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <div className="font-mono text-gray-600 truncate flex-grow text-xs">
                            {process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'}/wizard/{journey.slug}
                          </div>
                          <CopyToClipboard
                            text={`${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'}/wizard/${journey.slug}`}
                            buttonClassName="bg-white hover:bg-gray-100 border border-gray-200 rounded px-2 py-1 text-gray-700 text-xs flex items-center gap-1 transition-colors"
                            iconClassName="w-3.5 h-3.5"
                            successMessage="Copied!"
                          />
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <Link
                          href={`/wizard/edit/${journey.id}`}
                          className="flex-1 button-secondary button-sm flex items-center justify-center gap-1"
                          title="Edit journey"
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </Link>
                        <Link
                          href={`wizard/${journey.slug || journey.id}`}
                          className="flex-1 button-primary button-sm flex items-center justify-center gap-1"
                          title="Run journey"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                          Run
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
