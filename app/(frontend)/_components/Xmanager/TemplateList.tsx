'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  EyeIcon,
  TrashIcon,
  CopyIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  createTemplate,
  fetchTemplates,
  deleteTemplate,
  duplicateTemplate,
} from '@/app/(frontend)/_actions/templates'
import Image from 'next/image'
import { TemplatePreview } from './TemplatePreview'
import { LoadingSpinner } from '@/app/(frontend)/_components/ui/loading-spinner'
import { StatusChip } from './StatusChip'
import { PaginatedTemplatesResponse } from '@/app/(frontend)/_types/template-data'
import { SaveModal } from './SaveModal'
import { DeleteModal } from './DeleteModal'
import type { Page } from '@/payload-types'

const ITEMS_PER_PAGE = 4

export function TemplateList() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<Omit<PaginatedTemplatesResponse, 'docs'>>({
    totalDocs: 0,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<Page | null>(null)
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'deleted' | 'error'>(
    'idle',
  )
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [templateToDuplicate, setTemplateToDuplicate] = useState<Page | null>(null)
  const [duplicateStatus, setDuplicateStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  )
  const [slugValue, setSlugValue] = useState('')
  const [slugTempValue, setSlugTempValue] = useState('')

  const fetchTemplatesData = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetchTemplates({
        page,
        limit: ITEMS_PER_PAGE,
      })
      const { docs, ...paginationData } = response
      setTemplates(docs)
      setPagination(paginationData)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const response = await createTemplate({
        title: 'New Template',
        description: 'Start with a blank template',
        htmlContent: '',
        cssContent: '',
        jsContent: '', // Adding the jsContent field
        gjsData: {},
        status: 'draft',
        access: {
          visibility: 'public',
        },
        slug: 'temp-slug' // Temporary slug that will be updated with id
      })

      if (response?.id) {
        toast.success('Template created successfully')
        router.push(`/editor/${response.id}`)
      }
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template')
    }
  }

  const handleDeleteClick = (template: Page) => {
    setTemplateToDelete(template)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return

    try {
      setDeleteStatus('deleting')
      await deleteTemplate(templateToDelete.id as string)
      await fetchTemplatesData(pagination.page)
      toast.success('Template deleted successfully')
      setDeleteStatus('idle')
      setShowDeleteModal(false)
      setTemplateToDelete(null)
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
      setDeleteStatus('error')
    }
  }

  const handleDuplicateClick = (template: Page) => {
    setTemplateToDuplicate(template)
    const initialSlug = `${template.slug}-copy`
    setSlugValue(initialSlug)
    setSlugTempValue(initialSlug)
    setShowDuplicateModal(true)
  }

  const handleSlugChange = (value: string) => {
    setSlugTempValue(value)
    setSlugValue(value)
  }

  const handleDuplicate = async (name: string, description: string) => {
    if (!templateToDuplicate) return

    try {
      setDuplicateStatus('saving')
      await duplicateTemplate(templateToDuplicate.id as string, name, description, slugValue)
      await fetchTemplatesData(pagination.page)
      toast.success('Template duplicated successfully')
      setDuplicateStatus('idle')
      setShowDuplicateModal(false)
      setTemplateToDuplicate(null)
    } catch (error) {
      console.error('Error duplicating template:', error)
      toast.error('Failed to duplicate template')
      setDuplicateStatus('error')
    }
  }

  useEffect(() => {
    fetchTemplatesData(1)
  }, [])

  return (
    <div>
      <header className="template-header">
        <div className="header-logo">
          <Image
            src="/xpm/logo.webp"
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
          />
          <span className="header-title">Template List</span>
        </div>
        <Link href="/admin" className="button-primary-outline button-lg">
          Switch to Admin Panel
        </Link>
      </header>

      <div className="p-4">
        <div className="template-grid">
          {isLoading ? (
            <div className="template-loading">
              <LoadingSpinner
                text="Loading templates"
                subText="Please wait while we fetch your templates..."
              />
            </div>
          ) : templates.length > 0 ? (
            <>
              {templates.map((template) => (
                <div key={template.id} className="group template-card h-[300px]">
                  <div className="template-card-preview">
                    <TemplatePreview
                      html={template.htmlContent}
                      css={template.cssContent}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute top-2 left-2 z-20">
                    <StatusChip status={template.status} />
                  </div>
                  <button
                    onClick={() => handleDeleteClick(template)}
                    className="template-card-delete"
                    aria-label="Delete template"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDuplicateClick(template)}
                    className="template-card-duplicate"
                    aria-label="Duplicate template"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                  <div className="template-card-overlay">
                    <div className="template-card-content">
                      <div className="template-card-info">
                        <div className="flex flex-col min-w-0">
                          <h3 className="template-card-title">{template.title}</h3>
                          <p className="template-card-description">{template.description}</p>
                        </div>
                        <div className="template-card-actions">
                          <Link
                            href={`/editor/${template.id}`}
                            className="button-primary button-md"
                          >
                            <EditIcon className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                          <Link
                            href={`/preview/${template.id}`}
                            className="button-secondary button-md"
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Preview
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleCreateTemplate}
                className="h-[300px] group relative border-4 border-transparent rounded-lg p-6 flex items-center justify-center transition-all duration-200 bg-[repeating-linear-gradient(45deg,#f8fafc,#f8fafc_10px,#f1f5f9_10px,#f1f5f9_20px)] hover:bg-[repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6_10px,#e5e7eb_10px,#e5e7eb_20px)] hover:shadow-md"
              >
                <div className="relative text-center">
                  <PlusIcon className="w-8 h-8 mx-auto mb-2 text-gray-400 transition-colors duration-300 group-hover:text-blue-600" />
                  <span className="text-gray-600 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-colors">
                    Create New Template
                  </span>
                </div>
              </button>
            </>
          ) : (
            <div className="template-empty-state">
              <div className="template-empty-content">
                <h3 className="template-empty-title">No templates found</h3>
                <p className="template-empty-description">
                  Get started by creating your first template
                </p>
                <button onClick={handleCreateTemplate} className="button-primary button-md">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create First Template
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {templates.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => fetchTemplatesData(pagination.prevPage || 1)}
              disabled={!pagination.hasPrevPage}
              className={`pagination-button ${
                pagination.hasPrevPage ? 'pagination-button-active' : 'pagination-button-disabled'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchTemplatesData(pagination.nextPage || 1)}
              disabled={!pagination.hasNextPage}
              className={`pagination-button ${
                pagination.hasNextPage ? 'pagination-button-active' : 'pagination-button-disabled'
              }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      {showDeleteModal && templateToDelete && (
        <DeleteModal
          templateName={templateToDelete.title}
          onClose={() => {
            setShowDeleteModal(false)
            setTemplateToDelete(null)
            setDeleteStatus('idle')
          }}
          onConfirm={handleDeleteConfirm}
          deleteStatus={deleteStatus}
        />
      )}
      {showDuplicateModal && templateToDuplicate && (
        <SaveModal
          initialName={`${templateToDuplicate.title} (Copy)`}
          initialDescription={templateToDuplicate.description || ''}
          slugValue={slugValue}
          slugTempValue={slugTempValue}
          onSlugChange={handleSlugChange}
          onClose={() => {
            setShowDuplicateModal(false)
            setTemplateToDuplicate(null)
            setDuplicateStatus('idle')
          }}
          onSave={handleDuplicate}
          saveStatus={duplicateStatus}
        />
      )}
    </div>
  )
}
