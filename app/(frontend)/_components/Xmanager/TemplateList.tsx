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
import {
  TemplateData,
  createTemplate,
  fetchTemplates,
  deleteTemplate,
  PaginatedTemplatesResponse,
} from '@/app/(frontend)/_actions/templates'
import Image from 'next/image'
import { TemplatePreview } from './TemplatePreview'

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
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <div className="flex items-center">
          <Image src="/logo.webp" alt="Logo" width={120} height={120} className="object-contain" />
          <span className="ml-3 font-semibold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-sans">
            Template List
          </span>
        </div>
        <Link
          href="/admin"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Switch to Admin Penel
        </Link>
      </header>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {isLoading ? (
            <div className="col-span-full text-center">Loading templates...</div>
          ) : templates.length > 0 ? (
            <>
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="group border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative bg-white overflow-hidden"
                >
                  <div className="relative w-full h-48 bg-gray-50">
                    <TemplatePreview
                      html={template.htmlContent}
                      css={template.cssContent}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this template?')) {
                        handleDeleteTemplate(template.id)
                      }
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-500 bg-gray-50 hover:bg-red-500 hover:text-white transition-colors rounded-xl shadow-lg z-20"
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
                        <Link
                          href={`/editor/${template.id}`}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center shadow-sm"
                        >
                          <EditIcon className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                        <Link
                          href={`/preview/${template.id}`}
                          className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center shadow-sm"
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
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center transition-all duration-200 bg-[repeating-linear-gradient(45deg,#f8fafc,#f8fafc_10px,#f1f5f9_10px,#f1f5f9_20px)] hover:bg-[repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6_10px,#e5e7eb_10px,#e5e7eb_20px)] hover:border-gray-400 hover:shadow-md hover:scale-[1.005]"
              >
                <div className="text-center">
                  <PlusIcon className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  <span className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    Create New Template
                  </span>
                </div>
              </button>
            </>
          ) : (
            <div className="col-span-full text-center p-8">
              <div className="mx-auto max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first template</p>
                <button
                  onClick={handleCreateTemplate}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
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
              className={`p-2 rounded ${
                pagination.hasPrevPage ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-300'
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
              className={`p-2 rounded ${
                pagination.hasNextPage ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-300'
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
