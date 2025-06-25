'use client'

import { useState, useEffect, useTransition } from 'react'
import { useDebounce } from '@/lib/utils/useDebounce'
import Link from 'next/link'
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  EyeIcon,
  TrashIcon,
  CopyIcon,
  ArrowDownNarrowWideIcon,
  ArrowUpNarrowWideIcon,
  XIcon,
  SearchIcon,
  MoreHorizontal,
  Settings,
  Globe,
  Lock,
  Users,
  Play,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  fetchFlowsAction,
  createFlowAction,
  updateFlowMetadataAction,
  type FlowSummary,
} from '@/app/(frontend)/_actions/flows'
import { Button } from '@/app/(frontend)/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/(frontend)/_components/ui/dropdown-menu'
import { LoadingSpinner } from '@/app/(frontend)/_components/ui/loading-spinner'
import { useUser } from '@/app/(frontend)/_context/UserContext'
import FlowThumbnail from './FlowThumbnail'

const ITEMS_PER_PAGE = 4

interface PaginatedFlowsResponse {
  docs: FlowSummary[]
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

export default function FlowList() {
  const router = useRouter()
  const [flows, setFlows] = useState<FlowSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<Omit<PaginatedFlowsResponse, 'docs'>>({
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
  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'recent', label: 'Recently Viewed' },
    { key: 'draft', label: 'Draft' },
    { key: 'approved', label: 'Published' },
    { key: 'archived', label: 'Archived' },
  ] as const
  type TabKey = (typeof statusTabs)[number]['key']
  const [selectedTab, setSelectedTab] = useState<TabKey>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'created' | 'name'>('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const { user } = useUser()

  const debouncedSearch = useDebounce(searchTerm, 350)
  const [isPending, startTransition] = useTransition()

  // Metadata editing modal state
  const [editingFlow, setEditingFlow] = useState<FlowSummary | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    visibility: 'private' as 'public' | 'private' | 'restricted',
  })

  useEffect(() => {
    if (!user) {
      setIsLoading(true)
      setFlows([])
      return
    }

    setIsLoading(true)
    startTransition(() => {
      const filter: Record<string, unknown> = {}
      if (debouncedSearch.trim() === '' && selectedTab !== 'recent' && selectedTab !== 'all') {
        filter.status = selectedTab
      }

      fetchFlowsAction()
        .then((flowsData) => {
          // Apply client-side filtering and sorting for now
          let filteredFlows = flowsData

          // Filter by search term
          if (debouncedSearch.trim()) {
            filteredFlows = filteredFlows.filter((flow) =>
              flow.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
            )
          }

          // Filter by status
          if (selectedTab !== 'all' && selectedTab !== 'recent') {
            filteredFlows = filteredFlows.filter((flow) => flow.status === selectedTab)
          }

          // Sort flows
          filteredFlows.sort((a, b) => {
            let comparison = 0
            if (sortBy === 'name') {
              comparison = a.title.localeCompare(b.title)
            } else {
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            }
            return sortOrder === 'asc' ? comparison : -comparison
          })

          // Apply pagination
          const startIndex = (pagination.page - 1) * ITEMS_PER_PAGE
          const endIndex = startIndex + ITEMS_PER_PAGE
          const paginatedFlows = filteredFlows.slice(startIndex, endIndex)

          setFlows(paginatedFlows)
          setPagination((prev) => ({
            ...prev,
            totalDocs: filteredFlows.length,
            totalPages: Math.ceil(filteredFlows.length / ITEMS_PER_PAGE),
            hasPrevPage: pagination.page > 1,
            hasNextPage: endIndex < filteredFlows.length,
            prevPage: pagination.page > 1 ? pagination.page - 1 : null,
            nextPage: endIndex < filteredFlows.length ? pagination.page + 1 : null,
          }))
        })
        .catch((error) => {
          console.error('Error fetching flows:', error)
          toast.error('Failed to load flows')
          setFlows([])
        })
        .finally(() => {
          setIsLoading(false)
        })
    })
  }, [debouncedSearch, sortBy, selectedTab, pagination.page, sortOrder, user])

  const handleCreateFlow = async () => {
    try {
      const newFlowId = await createFlowAction({
        title: 'New Flow',
        description: 'A new flow to get started',
        access: {
          visibility: 'private',
          allowedUsers: [],
        },
      })

      if (newFlowId) {
        toast.success('Flow created successfully!')
        router.push(`/dashboard/flows/builder/${newFlowId}`)
      }
    } catch (error) {
      console.error('Error creating flow:', error)
      toast.error('Failed to create flow')
    }
  }

  const handleEditClick = (flow: FlowSummary) => {
    setEditingFlow(flow)
    setEditForm({
      title: flow.title,
      description: flow.description || '',
      visibility: flow.access?.visibility || 'private',
    })
  }

  const handleSaveMetadata = async () => {
    if (!editingFlow) return

    try {
      await updateFlowMetadataAction(editingFlow.id, {
        title: editForm.title,
        description: editForm.description,
        access: {
          visibility: editForm.visibility,
          allowedUsers: editingFlow.access?.allowedUsers || [],
        },
      })

      // Update local state
      setFlows((prev) =>
        prev.map((flow) =>
          flow.id === editingFlow.id
            ? {
                ...flow,
                title: editForm.title,
                description: editForm.description,
                access: {
                  visibility: editForm.visibility,
                  allowedUsers: editingFlow.access?.allowedUsers || [],
                },
              }
            : flow,
        ),
      )

      toast.success('Flow updated successfully!')
      setEditingFlow(null)
    } catch (error) {
      console.error('Error updating flow:', error)
      toast.error('Failed to update flow')
    }
  }

  const getAccessIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4" />
      case 'restricted':
        return <Users className="w-4 h-4" />
      default:
        return <Lock className="w-4 h-4" />
    }
  }

  const getAccessLabel = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'Public'
      case 'restricted':
        return 'Restricted'
      default:
        return 'Private'
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between py-6 px-8 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Flows</h1>
          <span className="text-sm text-gray-500">
            {pagination.totalDocs} {pagination.totalDocs === 1 ? 'flow' : 'flows'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateFlow} className="button-primary button-md">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Flow
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-4">
        {/* Tabs */}
        <div className="flex gap-1 md:gap-2 items-center flex-shrink-0 w-full md:w-auto overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              aria-pressed={selectedTab === tab.key}
              type="button"
              className={`m-0.5 px-4 py-1.5 rounded-full font-medium whitespace-nowrap border transition-colors duration-150
                ${
                  selectedTab === tab.key
                    ? 'bg-[#2242A4] text-white border-[#2242A4]'
                    : 'bg-white text-[#2242A4] border-gray-300 hover:bg-blue-50'
                }
                focus:outline-none focus:ring-2 focus:ring-[#2242A4]`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls: search, sort, view toggle */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto justify-end">
          {/* Search */}
          <div className="relative w-56 md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search Flows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2 h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#2242A4]"
            />
            {searchTerm.trim() !== '' && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort group */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-1 h-10">
            <label
              htmlFor="sortBy"
              className="text-sm text-gray-700 mr-1 ml-2 hidden md:inline-block"
            >
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'created' | 'name')}
              className="bg-transparent text-[#2242A4] font-medium focus:outline-none px-2 py-1 h-8"
              aria-label="Sort field"
            >
              <option value="created">Created Date</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'))}
              className={`ml-1 flex items-center justify-center px-2 h-8 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2242A4] ${
                sortOrder === 'asc' ? 'text-blue-600' : 'text-[#2242A4]'
              }`}
              aria-pressed={sortOrder === 'asc'}
              aria-label={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              type="button"
            >
              {sortOrder === 'asc' ? <ArrowDownNarrowWideIcon /> : <ArrowUpNarrowWideIcon />}
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex gap-1 ml-2">
            <button
              className={`p-2 h-10 w-10 flex items-center justify-center rounded ${viewMode === 'grid' ? 'bg-blue-100 text-[#2242A4]' : 'hover:bg-gray-100 text-[#2242A4]'}`}
              aria-label="Grid view"
              onClick={() => setViewMode('grid')}
              type="button"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="11" y="3" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="3" y="11" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" />
              </svg>
            </button>
            <button
              className={`p-2 h-10 w-10 flex items-center justify-center rounded ${viewMode === 'list' ? 'bg-blue-100 text-[#2242A4]' : 'hover:bg-gray-100 text-[#2242A4]'}`}
              aria-label="List view"
              onClick={() => setViewMode('list')}
              type="button"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="13" width="14" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : flows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium">No flows found</p>
            <p className="text-sm">Create your first flow to get started</p>
          </div>
        ) : (
          <div
            className={`p-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}`}
          >
            {flows.map((flow) => (
              <div
                key={flow.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gray-50 border-b border-gray-200">
                  <FlowThumbnail flowId={flow.id} />
                </div>

                {/* Card Header with Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild className="group">
                        <Link
                          href={`/dashboard/flows/builder/${flow.id}`}
                          className="flex items-center"
                        >
                          <EditIcon className="w-4 h-4 mr-2" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="group">
                        <Link
                          href={`/dashboard/flows/preview/${flow.id}`}
                          target="_blank"
                          className="flex items-center"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          <span>Preview</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditClick(flow)}
                        className="flex items-center group"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Card Footer */}
                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-gray-900 truncate">{flow.title}</h3>
                    {flow.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{flow.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        Edited {new Date(flow.updatedAt || flow.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {getAccessIcon(flow.access?.visibility || 'private')}
                          <span>{getAccessLabel(flow.access?.visibility || 'private')}</span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            flow.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : flow.status === 'archived'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {flow.status === 'approved'
                            ? 'Published'
                            : flow.status === 'archived'
                              ? 'Archived'
                              : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay with Quick Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/flows/builder/${flow.id}`}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <EditIcon className="w-4 h-4 text-gray-700" />
                    </Link>
                    <Link
                      href={`/dashboard/flows/preview/${flow.id}`}
                      target="_blank"
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Play className="w-4 h-4 text-gray-700" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Flow Card */}
            <div className="h-[300px] group relative">
              <Button
                onClick={handleCreateFlow}
                className="h-full w-full border-4 border-transparent rounded-lg p-6 flex items-center justify-center transition-all duration-200 bg-[repeating-linear-gradient(45deg,#f8fafc,#f8fafc_10px,#f1f5f9_10px,#f1f5f9_20px)] hover:bg-[repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6_10px,#e5e7eb_10px,#e5e7eb_20px)] hover:shadow-md"
                variant="ghost"
              >
                <div className="relative text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#2242A4] text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-[#2242A4] transition-colors">
                    Create New Flow
                  </p>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {pagination.pagingCounter} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.totalDocs)} of{' '}
            {pagination.totalDocs} flows
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={!pagination.hasNextPage}
            >
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Metadata Edit Modal */}
      {editingFlow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Edit Flow Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flow Name</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2242A4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2242A4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Type</label>
                <select
                  value={editForm.visibility}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      visibility: e.target.value as 'public' | 'private' | 'restricted',
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2242A4]"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditingFlow(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveMetadata}
                className="bg-[#2242A4] hover:bg-[#1a3583] text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
