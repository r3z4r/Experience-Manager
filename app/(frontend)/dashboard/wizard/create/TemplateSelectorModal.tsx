// TemplateSelectorModal component extracted for reuse or testability
'use client'
import React, { useEffect, useState } from 'react'
import { fetchTemplates } from '@/app/(frontend)/_actions/templates'
import { TemplatePreview } from '@/app/(frontend)/_components/Xmanager/TemplatePreview'
import { Page } from '@/payload-types'

interface TemplateSelectorModalProps {
  open: boolean
  onClose: () => void
  onSelect: (template: Page) => void
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [templates, setTemplates] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState<{
    hasNextPage: boolean
    hasPrevPage: boolean
    totalDocs: number
  }>({ hasNextPage: false, hasPrevPage: false, totalDocs: 0 })

  const ITEMS_PER_PAGE = 4 // Reduced number of items per page to ensure pagination is visible

  const loadTemplates = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetchTemplates({
        page,
        limit: ITEMS_PER_PAGE,
        filter: { status: 'published' },
      })
      setTemplates(response.docs)
      setTotalPages(response.totalPages)
      setPaginationInfo({
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
        totalDocs: response.totalDocs,
      })
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    loadTemplates(currentPage)
  }, [open, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Template</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl leading-none px-2"
            aria-label="Close selector modal"
          >
            ×
          </button>
        </div>
        {loading ? (
          <div className="text-center py-10">Loading templates...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSelect(t)
                    onClose()
                  }}
                  className="border rounded hover:ring-2 ring-blue-500 overflow-hidden text-left"
                >
                  <TemplatePreview html={t.htmlContent} css={t.cssContent} className="h-40" />
                  <div className="p-2 text-sm truncate">{t.title}</div>
                </button>
              ))}
              {templates.length === 0 && (
                <div className="col-span-full text-center text-gray-500">No templates found</div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 border-t pt-4">
                <div className="text-sm text-gray-500">
                  Showing {templates.length} of {paginationInfo.totalDocs} templates
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginationInfo.hasPrevPage}
                    className={`px-3 py-1 rounded ${!paginationInfo.hasPrevPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current page
                        return (
                          page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                        )
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there are gaps in the sequence
                        const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1

                        return (
                          <React.Fragment key={page}>
                            {showEllipsisBefore && <span className="px-2">...</span>}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        )
                      })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationInfo.hasNextPage}
                    className={`px-3 py-1 rounded ${!paginationInfo.hasNextPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
