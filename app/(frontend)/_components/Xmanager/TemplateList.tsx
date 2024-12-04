'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  TemplateData,
  createTemplate,
  fetchTemplates,
  PaginatedTemplatesResponse,
} from '@/app/(frontend)/_actions/templates'
import Image from 'next/image'

const ITEMS_PER_PAGE = 6

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
        gjsData: {
          'gjs-html': '',
          'gjs-css': '',
          'gjs-components': [],
          'gjs-styles': [],
          'gjs-assets': [],
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

  useEffect(() => {
    fetchTemplatesData(1)
  }, [])

  return (
    <div>
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <div className="flex items-center">
          <Image src="/logo.webp" alt="Logo" width={80} height={100} className="object-contain" />
          <span className="ml-3 text-2xl font-bold text-gray-800 font-helvetica tracking-tight">
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
                  className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{template.title}</h3>
                      <p className="text-gray-600 text-sm">{template.description}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Link
                        href={`/editor/${template.id}`}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/preview/${template.id}`}
                        className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleCreateTemplate}
                className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <PlusIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-gray-600">Create New Template</span>
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
