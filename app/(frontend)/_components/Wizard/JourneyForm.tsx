'use client'

import React, { useState, useTransition, useEffect, useCallback } from 'react'
import { WizardStepType, WizardStep, WizardJourney, LocalizationConfig } from '@/lib/types/wizard'
import type { TemplateData } from '@/app/(frontend)/_types/template-data'
import { TemplateSelectorModal } from '@/app/(frontend)/wizard/create/TemplateSelectorModal'
import Link from 'next/link'
import { WizardToast } from '@/app/(frontend)/_components/Wizard/WizardToast'
import { TemplatePreview } from '@/app/(frontend)/_components/Xmanager/TemplatePreview'
import { fetchTemplates } from '@/app/(frontend)/_actions/templates'
import { checkSlugUniquenessAction } from '@/app/(frontend)/_actions/checkSlugUniqueness'
import { AlertTriangleIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { PredefinedStepSelector } from '@/app/(frontend)/_components/Wizard/PredefinedStepSelector'
import { PredefinedStep } from '@/app/(frontend)/_components/Wizard/predefined'
import { LocalizationConfigEditor } from '@/app/(frontend)/_components/Wizard/LocalizationConfig'

interface JourneyFormProps {
  initialJourney?: WizardJourney | null
  journeyId?: string
  isEdit?: boolean
  onSubmit: (journey: Partial<Omit<WizardJourney, 'id'>>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onCancel?: () => void
}

export function JourneyForm({
  initialJourney,
  journeyId,
  isEdit = false,
  onSubmit,
  onDelete,
  onCancel,
}: JourneyFormProps) {
  // State for journey data
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>(
    { message: '', type: 'success', open: false },
  )
  const [steps, setSteps] = useState<WizardStep[]>(initialJourney?.steps || [])
  const [label, setLabel] = useState(initialJourney?.label || '')
  const [slug, setSlug] = useState(initialJourney?.slug || '')
  const [description, setDescription] = useState(initialJourney?.description || '')
  const [originalSlug, setOriginalSlug] = useState(initialJourney?.slug || '')
  const [slugError, setSlugError] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [localizationConfig, setLocalizationConfig] = useState<LocalizationConfig | undefined>(
    initialJourney?.localization,
  )
  const [showLocalizationConfig, setShowLocalizationConfig] = useState(false)

  // State for step editing
  const [stepLabel, setStepLabel] = useState('')
  const [stepType, setStepType] = useState<WizardStepType>(WizardStepType.Predefined)
  const [stepRef, setStepRef] = useState('')
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [predefinedModalOpen, setPredefinedModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null)
  const [selectedPredefined, setSelectedPredefined] = useState<PredefinedStep | null>(null)

  // State for UI
  const [isPending, startTransition] = useTransition()
  const [templateCache, setTemplateCache] = useState<Record<string, TemplateData>>({})
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Fetch and cache templates for previews
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const result = await fetchTemplates({ limit: 50, filter: { status: 'published' } })
        const cache: Record<string, TemplateData> = {}
        result.docs.forEach((template) => {
          if (template.id) {
            cache[template.id] = template
          }
        })
        setTemplateCache(cache)
      } catch (error) {
        console.error('Failed to load templates for preview:', error)
      }
    }

    loadTemplates()
  }, [])

  // Generate slug from label
  const generateSlug = useCallback((input: string): string => {
    if (!input) return ''

    return input
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }, [])

  // Auto-generate slug when label changes (if slug hasn't been manually edited)
  useEffect(() => {
    if (label && !slugTouched) {
      const generatedSlug = generateSlug(label)
      setSlug(generatedSlug)

      // Check slug uniqueness only if it's different from the original
      if (generatedSlug && generatedSlug !== originalSlug) {
        startTransition(async () => {
          const isUnique = await checkSlugUniquenessAction(generatedSlug, 'journeys', journeyId)
          setSlugError(
            isUnique
              ? ''
              : `The slug '${generatedSlug}' is already in use. Please choose a different one.`,
          )
        })
      } else {
        setSlugError('')
      }
    }
  }, [label, slugTouched, generateSlug, originalSlug, journeyId])

  // Check slug uniqueness when manually edited
  const checkSlugUniqueness = useCallback(
    async (value: string) => {
      if (!value) return

      // Skip check if slug hasn't changed
      if (value === originalSlug) {
        setSlugError('')
        return
      }

      startTransition(async () => {
        const isUnique = await checkSlugUniquenessAction(value, 'journeys', journeyId)
        setSlugError(
          isUnique ? '' : `The slug '${value}' is already in use. Please choose a different one.`,
        )
      })
    },
    [originalSlug, journeyId],
  )

  // Handle slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = generateSlug(e.target.value)
    setSlug(value)
    setSlugTouched(true)
    checkSlugUniqueness(value)
  }

  const resetStepFields = () => {
    setStepLabel('')
    setStepRef('')
    setSelectedTemplate(null)
    setSelectedPredefined(null)
    setStepType(WizardStepType.Predefined)
  }

  const addStep = () => {
    if (stepType === WizardStepType.Template && !selectedTemplate) return
    if (!stepLabel && stepType === WizardStepType.Predefined) return
    if (stepType === WizardStepType.Predefined && !stepRef) return
    if (stepType === WizardStepType.PredefinedComponent && !selectedPredefined) return

    // Map the UI step type to one of the two valid backend types
    // The backend only accepts 'predefined' or 'template' as valid types
    const backendStepType =
      stepType === WizardStepType.PredefinedComponent ? WizardStepType.Predefined : stepType

    const newStep: WizardStep = {
      id: `${stepType}-${steps.length}-${Date.now()}`,
      type: backendStepType, // Use the mapped type that the backend accepts
      label:
        stepLabel ||
        (selectedTemplate
          ? selectedTemplate.title
          : selectedPredefined
            ? selectedPredefined.name
            : `Step ${steps.length + 1}`),
      ref:
        stepType === WizardStepType.Template
          ? (selectedTemplate?.id ?? '')
          : stepType === WizardStepType.PredefinedComponent
            ? `predefined:${selectedPredefined?.id}`
            : stepRef,
    }

    setSteps([...steps, newStep])
    resetStepFields()
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id))
  }

  const moveStepUp = (index: number) => {
    if (index <= 0) return
    const newSteps = [...steps]
    ;[newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]]
    setSteps(newSteps)
  }

  const moveStepDown = (index: number) => {
    if (index >= steps.length - 1) return
    const newSteps = [...steps]
    ;[newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
    setSteps(newSteps)
  }

  // Get template data for a step if it's a template type
  const getTemplateForStep = (step: WizardStep) => {
    if (step.type !== WizardStepType.Template) return null
    return templateCache[step.ref] || null
  }

  const handleSubmit = () => {
    if (!label || steps.length === 0 || slugError) return

    const journeyData: Partial<Omit<WizardJourney, 'id'>> = {
      label,
      slug,
      steps,
      description,
      localization: localizationConfig,
    }

    startTransition(async () => {
      try {
        await onSubmit(journeyData)
        setToast({
          message: `Journey ${isEdit ? 'updated' : 'created'} successfully!`,
          type: 'success',
          open: true,
        })
      } catch (err) {
        console.error(`Failed to ${isEdit ? 'update' : 'create'} journey:`, err)
        setToast({
          message: `Failed to ${isEdit ? 'update' : 'create'} journey`,
          type: 'error',
          open: true,
        })
      }
    })
  }

  const handleDelete = () => {
    if (!journeyId || !onDelete) return

    startTransition(async () => {
      try {
        await onDelete(journeyId)
        setToast({ message: 'Journey deleted successfully!', type: 'success', open: true })
      } catch (err) {
        console.error('Failed to delete journey:', err)
        setToast({ message: 'Failed to delete journey', type: 'error', open: true })
      } finally {
        setDeleteConfirmOpen(false)
      }
    })
  }

  const closeToast = () => setToast((t) => ({ ...t, open: false }))

  const disableAdd =
    (stepType === WizardStepType.Predefined && (!stepRef || !stepLabel)) ||
    (stepType === WizardStepType.Template && (!selectedTemplate || !stepLabel)) ||
    (stepType === WizardStepType.PredefinedComponent && !selectedPredefined)

  const disableSubmit = !label || steps.length === 0 || isPending || !!slugError

  return (
    <div className="template-card p-6 lg:p-8 space-y-8 border">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold mb-2">
          {isEdit ? 'Edit Journey' : 'Create New Wizard Journey'}
        </h1>
        {isEdit && onDelete && (
          <div className="flex items-center gap-2">
            <Link
              href={`/wizard/${slug || journeyId}`}
              className="button-secondary-outline button-sm"
              target="_blank"
            >
              Preview
            </Link>
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="button-destructive button-sm flex items-center gap-1 "
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Journey label and slug */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">Journey Name</label>
          <input
            className="w-full max-w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder-gray-400 bg-background"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Customer Onboarding"
            aria-label="Journey Label"
            required
            autoFocus={!isEdit}
          />
          {!label && <span className="text-xs text-red-500">Required</span>}
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full max-w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder-gray-400 bg-background"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this journey"
            aria-label="Journey Description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">URL Slug</label>
          <div className="flex items-center">
            <input
              className={`w-full max-w-full border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder-gray-400 bg-background ${slugError ? 'border-red-500' : 'border-border'}`}
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g. customer-onboarding"
              aria-label="Journey Slug"
              required
            />
            <div className="bg-muted border border-l-0 border-border rounded-r px-3 py-2 text-sm text-gray-500 whitespace-nowrap">
              /wizard/<span className="font-mono">{slug || 'slug'}</span>
            </div>
          </div>
          {slugError ? (
            <span className="text-xs text-red-500">{slugError}</span>
          ) : (
            <span className="text-xs text-gray-500">
              This will be used in the URL for direct access to this journey
            </span>
          )}
        </div>
      </div>

      {/* Localization Configuration */}
      <div className="bg-muted rounded-lg p-4 border-t border-border space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowLocalizationConfig(!showLocalizationConfig)}
        >
          <h3 className="font-semibold">Localization Options</h3>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            aria-label={
              showLocalizationConfig ? 'Hide localization options' : 'Show localization options'
            }
          >
            {showLocalizationConfig ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {showLocalizationConfig && (
          <LocalizationConfigEditor value={localizationConfig} onChange={setLocalizationConfig} />
        )}
      </div>

      {/* Step builder */}
      <div className="bg-muted rounded-lg p-4 border-t border-border space-y-6 mt-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          {/* Step label */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium">Step Label</label>
            <input
              className="w-full min-w-0 border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder-gray-400 bg-background"
              value={stepLabel}
              onChange={(e) => setStepLabel(e.target.value)}
              placeholder="e.g. Login"
              aria-label="Step Label"
              required
            />
          </div>

          {/* Step type */}
          <div className="flex-shrink-0 w-32 min-w-0">
            <label className="block text-sm font-medium">Type</label>
            <select
              className="w-full min-w-0 border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition bg-background"
              value={stepType}
              onChange={(e) => {
                setStepType(e.target.value as WizardStepType)
                setSelectedTemplate(null)
                setSelectedPredefined(null)
                setStepRef('')
              }}
              aria-label="Step Type"
            >
              <option value={WizardStepType.Predefined}>Custom</option>
              <option value={WizardStepType.Template}>Template</option>
              <option value={WizardStepType.PredefinedComponent}>Predefined Component</option>
            </select>
          </div>

          {/* Reference field */}
          {stepType === WizardStepType.Predefined ? (
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium">Reference</label>
              <input
                className="w-full min-w-0 border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder-gray-400 bg-background"
                value={stepRef}
                onChange={(e) => setStepRef(e.target.value)}
                placeholder="Component Name"
                aria-label="Step Reference"
                required
              />
            </div>
          ) : stepType === WizardStepType.Template ? (
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium">Template</label>
              <button
                type="button"
                onClick={() => setTemplateModalOpen(true)}
                className="w-full min-w-0 border border-border rounded px-3 py-2 text-left bg-background hover:bg-muted transition truncate"
                aria-label="Select Template"
              >
                {selectedTemplate ? (
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{selectedTemplate.title}</span>
                    <div className="w-8 h-8 rounded border ml-2 flex-shrink-0 overflow-hidden">
                      <TemplatePreview
                        html={selectedTemplate.htmlContent || ''}
                        css={selectedTemplate.cssContent || ''}
                        className="w-full h-full"
                      />
                    </div>
                  </span>
                ) : (
                  'Select a template'
                )}
              </button>
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium">Predefined Component</label>
              <button
                type="button"
                onClick={() => setPredefinedModalOpen(true)}
                className="w-full min-w-0 border border-border rounded px-3 py-2 text-left bg-background hover:bg-muted transition truncate"
                aria-label="Select Predefined Component"
              >
                {selectedPredefined ? (
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{selectedPredefined.name}</span>
                  </span>
                ) : (
                  'Select a predefined component'
                )}
              </button>
            </div>
          )}

          <div className="flex-shrink-0 flex items-end">
            <button
              type="button"
              onClick={addStep}
              disabled={disableAdd}
              className={`button-secondary button-md whitespace-nowrap ${disableAdd ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-disabled={disableAdd}
              style={{ minWidth: '96px' }}
            >
              Add Step
            </button>
          </div>
        </div>

        {/* Steps list */}
        <div>
          <h3 className="font-semibold mb-2">Steps:</h3>
          {steps.length === 0 ? (
            <div className="template-empty-state py-4">No steps added yet.</div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 pb-2">
              {steps.map((s, idx) => {
                const templateData =
                  s.type === WizardStepType.Template ? getTemplateForStep(s) : null
                return (
                  <div
                    key={s.id}
                    className="border border-border rounded-lg bg-background transition group overflow-hidden"
                  >
                    {/* Step header with controls */}
                    <div className="flex items-center px-3 py-2 border-b border-border bg-muted/30 min-w-0">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded mr-2 text-gray-600 flex-shrink-0">
                        #{idx + 1}
                      </span>
                      <span
                        className="font-medium text-gray-800 mr-2 truncate min-w-0 flex-grow"
                        title={s.label}
                      >
                        {s.label}
                      </span>

                      {/* Step controls */}
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          type="button"
                          onClick={() => moveStepUp(idx)}
                          disabled={idx === 0}
                          className={`text-gray-400 hover:text-gray-600 p-1 rounded focus:outline-none focus:ring-1 focus:ring-primary/30 flex-shrink-0 ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                          aria-label={`Move step ${idx + 1} up`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStepDown(idx)}
                          disabled={idx === steps.length - 1}
                          className={`text-gray-400 hover:text-gray-600 p-1 rounded focus:outline-none focus:ring-1 focus:ring-primary/30 flex-shrink-0 ${idx === steps.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                          aria-label={`Move step ${idx + 1} down`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStep(s.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded focus:outline-none focus:ring-1 focus:ring-red-300 flex-shrink-0"
                          aria-label={`Remove step ${idx + 1}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Step details */}
                    <div className="px-3 py-2 flex flex-col sm:flex-row gap-3 items-start">
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-medium text-gray-500">Type:</span>
                          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-gray-600">
                            {s.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-gray-500">Reference:</span>
                          <span
                            className="text-xs text-gray-600 truncate max-w-[250px]"
                            title={s.ref}
                          >
                            {s.ref}
                          </span>
                        </div>
                      </div>

                      {/* Template preview */}
                      {s.type === WizardStepType.Template &&
                        templateData &&
                        templateData.htmlContent && (
                          <div className="flex-shrink-0 border rounded overflow-hidden w-20 h-16">
                            <TemplatePreview
                              html={templateData.htmlContent}
                              css={templateData.cssContent || ''}
                              className="w-full h-full"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="button-secondary button-lg flex-1">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disableSubmit}
          className="button-primary button-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          aria-disabled={disableSubmit}
        >
          {isPending ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : null}
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Template selector modal */}
      <TemplateSelectorModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelect={(t) => {
          setSelectedTemplate(t)
          setStepRef(t.id ?? '')
        }}
      />

      {/* Predefined step selector modal */}
      <PredefinedStepSelector
        open={predefinedModalOpen}
        onClose={() => setPredefinedModalOpen(false)}
        onSelect={(step) => {
          setSelectedPredefined(step)
          setStepRef(`predefined:${step.id}`)
        }}
      />

      {/* Toast notification */}
      <WizardToast {...toast} onClose={closeToast} />

      {/* Delete confirmation modal - moved outside the main content for proper positioning */}
      {deleteConfirmOpen && onDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangleIcon className="w-6 h-6" />
              <h3 className="text-lg font-medium">Delete Journey</h3>
            </div>
            <p className="mb-4">
              Are you sure you want to delete this journey? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="button-secondary button-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="button-destructive button-md"
                disabled={isPending}
              >
                {isPending ? 'Deleting...' : 'Delete Journey'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
