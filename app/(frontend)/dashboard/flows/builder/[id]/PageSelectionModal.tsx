'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useDebounce } from '@/lib/utils/useDebounce'
import {
  X,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/(frontend)/_components/ui/dialog'
import { Button } from '@/app/(frontend)/_components/ui/button'
import { fetchTemplates } from '@/app/(frontend)/_actions/templates'
import { Page } from '@/payload-types'
import { TemplatePreview } from '@/app/(frontend)/_components/Xmanager/TemplatePreview'

const ITEMS_PER_PAGE = 6

interface PaginatedTemplatesResponse {
  docs: Page[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface PageSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPage: (pageId: string, pageTitle: string) => void
  selectedPageId?: string
}

export default function PageSelectionModal({
  open,
  onOpenChange,
  onSelectPage,
  selectedPageId,
}: PageSelectionModalProps) {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedPage, setSelectedPage] = useState<string | null>(selectedPageId || null)
  const [isPending, startTransition] = useTransition()
  const debouncedSearch = useDebounce(search, 350)

  // Pagination state
  const [pagination, setPagination] = useState({
    totalDocs: 0,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null as number | null,
    nextPage: null as number | null,
  })

  // Sorting state
  const [sortBy, setSortBy] = useState<'name' | 'created'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Define loadPages with useCallback to prevent it from changing on every render
  const loadPages = useCallback(async () => {
    try {
      setLoading(true)
      // Only fetch published pages
      const response = (await fetchTemplates({
        page: pagination.page,
        limit: pagination.limit,
        filter: { status: 'published' },
        sortBy,
        sortOrder,
        search: debouncedSearch,
      })) as PaginatedTemplatesResponse

      // Log the response to debug
      console.log('Fetched pages:', response.docs)

      setPages(response.docs)
      setPagination((prev) => ({
        ...prev,
        totalDocs: response.totalDocs,
        totalPages: response.totalPages,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevPage: response.prevPage,
        nextPage: response.nextPage,
      }))
      setError(null)
    } catch (err: any) {
      console.error('Error loading pages:', err)
      setError(err.message || 'Failed to load pages')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, pagination.limit, pagination.page, sortBy, sortOrder])

  // Load pages when modal opens or when search/sort/pagination changes
  useEffect(() => {
    if (open) {
      loadPages()
    }
  }, [open, loadPages, debouncedSearch])

  // Update selected page when selectedPageId prop changes
  useEffect(() => {
    if (selectedPageId) {
      setSelectedPage(selectedPageId)
    }
  }, [selectedPageId])

  const handleSelectPage = (page: Page) => {
    setSelectedPage(page.id)
    onSelectPage(page.id, page.title || 'Untitled Page')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Page</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${sortBy === 'name' ? 'bg-blue-50 border-blue-200' : ''}`}
                onClick={() => {
                  setSortBy('name')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
              >
                Name
                {sortBy === 'name' &&
                  (sortOrder === 'asc' ? (
                    <ArrowUpNarrowWide size={14} />
                  ) : (
                    <ArrowDownNarrowWide size={14} />
                  ))}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${sortBy === 'created' ? 'bg-blue-50 border-blue-200' : ''}`}
                onClick={() => {
                  setSortBy('created')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
              >
                Date
                {sortBy === 'created' &&
                  (sortOrder === 'asc' ? (
                    <ArrowUpNarrowWide size={14} />
                  ) : (
                    <ArrowDownNarrowWide size={14} />
                  ))}
              </Button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            <p className="font-medium">Error loading pages</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && pages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No pages found matching your search.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {pages.map((page: Page) => (
            <div
              key={page.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedPage === page.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectPage(page)}
            >
              <div className="h-40 bg-gray-100 relative">
                {page.gjsData &&
                typeof page.gjsData === 'object' &&
                page.gjsData !== null &&
                'html' in page.gjsData &&
                'css' in page.gjsData ? (
                  <TemplatePreview
                    html={String(page.gjsData.html || '')}
                    css={String(page.gjsData.css || '')}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-sm">No preview</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 truncate">
                  {page.title || 'Untitled Page'}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {page.slug ? `/${page.slug}` : 'No slug'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
            <div className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.totalDocs)}
              </span>{' '}
              of <span className="font-medium">{pagination.totalDocs}</span> pages
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrevPage}
                onClick={() => {
                  if (pagination.hasPrevPage && pagination.prevPage) {
                    setPagination((prev) => ({ ...prev, page: pagination.prevPage as number }))
                  }
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => {
                  if (pagination.hasNextPage && pagination.nextPage) {
                    setPagination((prev) => ({ ...prev, page: pagination.nextPage as number }))
                  }
                }}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
