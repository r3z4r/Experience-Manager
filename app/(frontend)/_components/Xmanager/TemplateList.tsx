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
  // UI state
  const [selectedTab, setSelectedTab] = useState<'recent' | 'files' | 'pages' | 'templates'>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'created' | 'name'>('created')

  // Filtering and sorting helpers
  const filteredTemplates = templates
    .filter((template) => {
      // Tab filtering (mock logic, adapt as needed)
      if (selectedTab === 'recent') return true
      if (selectedTab === 'files') return template.status === 'published'
      if (selectedTab === 'pages') return template.status === 'draft'
      if (selectedTab === 'templates') return template.status === 'archived'
      return true
    })
    .filter((template) => {
      if (!searchTerm) return true
      return (
        template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .sort((a, b) => {
      if (sortBy === 'created') {
        return (new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      }
      if (sortBy === 'name') {
        return (a.title || '').localeCompare(b.title || '')
      }
      return 0
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
        slug: 'temp-slug', // Temporary slug that will be updated with id
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
    <>
      <header className="flex items-center justify-between py-6 px-8 border-b bg-white">
        <div className="text-xl font-bold text-[#1B3E8A] font-helvetica">Guy Lupo’s Workspace</div>
        <div className="flex gap-3">
          <button className="border border-[#2242A4] text-[#2242A4] bg-white px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition-all">
            Upload Page
          </button>
          <button className="bg-[#2242A4] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#1B3E8A] transition-all">
            Create New +
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between px-8 py-4 gap-4 bg-white border-b">
        <div className="flex gap-2 md:gap-6 items-center w-full md:w-auto overflow-x-auto">
          <button
            className={`px-4 py-2 rounded-lg font-medium shadow-sm ${selectedTab === 'recent' ? 'bg-[#2242A4] text-white' : 'bg-gray-100 text-[#2242A4] hover:bg-blue-50'}`}
            onClick={() => setSelectedTab('recent')}
          >
            Recently viewed
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${selectedTab === 'files' ? 'bg-[#2242A4] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setSelectedTab('files')}
          >
            Shared files
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${selectedTab === 'pages' ? 'bg-[#2242A4] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setSelectedTab('pages')}
          >
            Shared pages
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${selectedTab === 'templates' ? 'bg-[#2242A4] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setSelectedTab('templates')}
          >
            Saved Templates
          </button>
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto mt-3 md:mt-0">
          <div className="relative w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M16 16L19 19"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search Pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#2242A4]"
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created' | 'name')}
          >
            <option value="created">Date created</option>
            <option value="name">Name</option>
          </select>
          <div className="flex gap-1 ml-2">
            <button
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-[#2242A4]' : 'hover:bg-gray-100'}`}
              aria-label="Grid view"
              onClick={() => setViewMode('grid')}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <rect x="3" y="3" width="6" height="6" rx="1" fill="#2242A4" />
                <rect x="11" y="3" width="6" height="6" rx="1" fill="#2242A4" />
                <rect x="3" y="11" width="6" height="6" rx="1" fill="#2242A4" />
                <rect x="11" y="11" width="6" height="6" rx="1" fill="#2242A4" />
              </svg>
            </button>
            <button
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-[#2242A4]' : 'hover:bg-gray-100'}`}
              aria-label="List view"
              onClick={() => setViewMode('list')}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <rect x="3" y="4" width="14" height="3" rx="1" fill="#2242A4" />
                <rect x="3" y="9" width="14" height="3" rx="1" fill="#2242A4" />
                <rect x="3" y="14" width="14" height="3" rx="1" fill="#2242A4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="template-loading">
            <LoadingSpinner
              text="Loading templates"
              subText="Please wait while we fetch your templates..."
            />
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div>
            {viewMode === 'grid' ? (
              <div className="template-grid">
                {filteredTemplates.map((template) => (
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
                              className="template-card-edit"
                              aria-label="Edit template"
                            >
                              <EditIcon className="w-5 h-5" />
                            </Link>
                            <Link
                              href={`/editor/${template.id}`}
                              className="template-card-view"
                              aria-label="View template"
                            >
                              <EyeIcon className="w-5 h-5" />
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
              </div>
            ) : (
              <div className="template-list">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="template-list-item">
                    <div className="template-list-preview">
                      <TemplatePreview
                        html={template.htmlContent}
                        css={template.cssContent}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="template-list-info">
                      <h3 className="template-list-title">{template.title}</h3>
                      <p className="template-list-description">{template.description}</p>
                    </div>
                    <div className="template-list-actions">
                      <button
                        onClick={() => handleDeleteClick(template)}
                        className="template-list-delete"
                        aria-label="Delete template"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateClick(template)}
                        className="template-list-duplicate"
                        aria-label="Duplicate template"
                      >
                        <CopyIcon className="w-5 h-5" />
                      </button>
                      <Link
                        href={`/editor/${template.id}`}
                        className="template-list-edit"
                        aria-label="Edit template"
                      >
                        <EditIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/editor/${template.id}`}
                        className="template-list-view"
                        aria-label="View template"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
    </>
  )
}
