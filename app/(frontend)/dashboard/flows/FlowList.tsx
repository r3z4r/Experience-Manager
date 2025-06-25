'use client'

import Link from 'next/link'
import { Plus, Edit, CheckCircle, AlertCircle, Archive } from 'lucide-react'
import type { FlowSummary } from '@/app/(frontend)/_actions/flows'

interface Props {
  flows: FlowSummary[]
  onCreateFlow: () => Promise<void>
}

export default function FlowList({ flows, onCreateFlow }: Props) {
  const getStatusBadge = (status: 'draft' | 'approved' | 'archived') => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Published
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            <Archive className="w-3 h-3" />
            Archived
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Draft
          </span>
        )
    }
  }

  const getStatusColor = (status: 'draft' | 'approved' | 'archived') => {
    switch (status) {
      case 'approved':
        return 'border-l-green-500'
      case 'archived':
        return 'border-l-gray-400'
      default:
        return 'border-l-yellow-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flows</h1>
          <p className="text-gray-600">Manage your user journey flows</p>
        </div>
        <button
          onClick={onCreateFlow}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Create Flow
        </button>
      </div>

      {flows.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flows yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first user journey flow</p>
          <button
            onClick={onCreateFlow}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Create Your First Flow
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className={`bg-white rounded-lg border border-gray-200 border-l-4 ${getStatusColor(flow.status)} p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{flow.title}</h3>
                    {getStatusBadge(flow.status)}
                  </div>
                  <p className="text-sm text-gray-500">Slug: {flow.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/flows/builder/${flow.id}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
