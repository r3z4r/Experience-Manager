// Journeys list/management page
'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { WizardJourney } from '@/lib/types/wizard'
import { WizardHeader } from '@/app/(frontend)/_components/Wizard/WizardHeader'
import { fetchJourneysAction } from '@/app/(frontend)/_actions/fetchJourneys'
import { CopyToClipboard } from '@/app/(frontend)/_components/CopyToClipboard'
import { LinkIcon, ClipboardIcon, ExternalLinkIcon, PencilIcon, EyeIcon } from 'lucide-react'

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

  return (
    <>
      <WizardHeader title="Journeys" />
      <main className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Journeys</h1>
          <Link href="/wizard/create" className="button-primary button-md">
            + Create Journey
          </Link>
        </div>

        {loading && <div>Loading journeys...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && journeys.length === 0 && <div>No journeys found.</div>}
        {!loading && !error && journeys.length > 0 && (
          <ul className="divide-y divide-border rounded-lg border">
            {journeys.map((journey) => (
              <li key={journey.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-lg">{journey.label}</div>
                    {journey.description && (
                      <div className="text-gray-500 text-sm">{journey.description}</div>
                    )}
                    <div className="text-xs text-gray-400">ID: {journey.id}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Link
                      href={`/wizard/edit/${journey.id}`}
                      className="button-secondary button-sm flex items-center gap-1"
                      title="Edit journey"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </Link>
                    <Link
                      href={`wizard/${journey.slug || journey.id}`}
                      className="button-primary button-sm flex items-center gap-1"
                      title="Run journey"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                      Run
                    </Link>
                  </div>
                </div>

                {journey.slug && (
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                    <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="font-mono text-gray-600 truncate flex-grow">
                      {window.location.origin}/wizard/{journey.slug}
                    </div>
                    <CopyToClipboard
                      text={`${window.location.origin}/wizard/${journey.slug}`}
                      buttonClassName="bg-white hover:bg-gray-100 border border-gray-200 rounded px-2 py-1 text-gray-700 text-xs flex items-center gap-1 transition-colors"
                      iconClassName="w-3.5 h-3.5"
                      successMessage="Copied!"
                      label="Copy URL"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
