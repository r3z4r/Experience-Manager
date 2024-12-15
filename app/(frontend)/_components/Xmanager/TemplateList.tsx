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
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createTemplate, fetchTemplates, deleteTemplate } from '@/app/(frontend)/_actions/templates'
import Image from 'next/image'
import { TemplatePreview } from './TemplatePreview'
import { LoadingSpinner } from '@/app/(frontend)/_components/ui/loading-spinner'
import { PaginatedTemplatesResponse, TemplateData } from '@/app/(frontend)/_types/template-data'

const ITEMS_PER_PAGE = 4

export function TemplateList() {
  const router = useRouter()
  const [templates, setTemplates] = useState<TemplateData[]>([])
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
        gjsData: {},
        status: 'draft',
        access: {
          visibility: 'public',
        },
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

  const handleDeleteTemplate = async (templateId: string | undefined) => {
    if (!templateId) return
    try {
      await deleteTemplate(templateId)
      toast.success('Template deleted successfully')
      await fetchTemplatesData(pagination.page)
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
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
                <div key={template.id} className="group template-card">
                  <div className="template-preview-container">
                    <TemplatePreview
                      html={template.htmlContent}
                      css={template.cssContent}
                      className="w-full h-full"
                    />
                    <div className="template-preview-overlay" />
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this template?')) {
                        handleDeleteTemplate(template.id)
                      }
                    }}
                    className="button-destructive button-md absolute top-0 right-0 py-6"
                    aria-label="Delete template"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>

                  <div className="p-4 relative z-10">
                    <div className="flex flex-col gap-4 mt-8">
                      <div>
                        <h3 className="text-lg font-semibold pr-8 line-clamp-1">
                          {template.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{template.description}</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Link href={`/editor/${template.id}`} className="button-primary button-md">
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
              ))}
              <button
                onClick={handleCreateTemplate}
                className="group relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center transition-all duration-200 bg-[repeating-linear-gradient(45deg,#f8fafc,#f8fafc_10px,#f1f5f9_10px,#f1f5f9_20px)] hover:bg-[repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6_10px,#e5e7eb_10px,#e5e7eb_20px)] hover:shadow-md before:absolute before:inset-0 before:p-[2px] before:rounded-lg before:content-[''] group-hover:before:bg-gradient-to-r group-hover:before:from-blue-600 group-hover:before:to-purple-600 before:opacity-0 group-hover:before:opacity-100 before:transition-[opacity,transform] before:hover:scale-[1.01] border-transparent"
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
    </div>
  )
}
