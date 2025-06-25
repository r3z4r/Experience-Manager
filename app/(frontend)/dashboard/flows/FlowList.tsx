"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Play, X } from 'lucide-react'
import { fetchFlowsAction, createFlowAction, getFlowAction, type FlowSummary } from '@/app/(frontend)/_actions/flows'
import FlowThumbnail from './FlowThumbnail'

interface FlowWithGraph extends FlowSummary {
  graph?: {
    nodes: any[]
    edges: any[]
  }
}

interface Props {
  flows: FlowSummary[]
}

export default function FlowList({ flows: initialFlows }: Props) {
  const [flows, setFlows] = useState<FlowWithGraph[]>(initialFlows)
  const [isCreating, setIsCreating] = useState(false)
  const [previewFlow, setPreviewFlow] = useState<FlowSummary | null>(null)

  // Load graph data for thumbnails
  useEffect(() => {
    const loadGraphData = async () => {
      const flowsWithGraphs = await Promise.all(
        initialFlows.map(async (flow) => {
          try {
            const flowData = await getFlowAction(flow.id)
            return {
              ...flow,
              graph: flowData?.graph || { nodes: [], edges: [] }
            }
          } catch (error) {
            console.error(`Failed to load graph for flow ${flow.id}:`, error)
            return {
              ...flow,
              graph: { nodes: [], edges: [] }
            }
          }
        })
      )
      setFlows(flowsWithGraphs)
    }

    loadGraphData()
  }, [initialFlows])

  const handleCreateFlow = async () => {
    setIsCreating(true)
    try {
      await createFlowAction()
    } finally {
      setIsCreating(false)
    }
  }

  const handlePreview = (flow: FlowSummary) => {
    setPreviewFlow(flow)
  }

  const closePreview = () => {
    setPreviewFlow(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Flows</h1>
            <p className="text-gray-600">Manage your user journey flows</p>
          </div>
          <button
            onClick={handleCreateFlow}
            disabled={isCreating}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {isCreating ? 'Creating...' : 'Create Flow'}
          </button>
        </div>

        {flows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No flows created yet.</p>
            <button
              onClick={handleCreateFlow}
              disabled={isCreating}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              {isCreating ? 'Creating...' : 'Create Your First Flow'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <div key={flow.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* Thumbnail */}
                <div className="h-48 bg-gray-50">
                  <FlowThumbnail 
                    graph={flow.graph || { nodes: [], edges: [] }} 
                    className="w-full h-full"
                  />
                </div>
                
                {/* Flow Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{flow.title}</h3>
                      <p className="text-sm text-gray-500">/{flow.slug}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      flow.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : flow.status === 'archived'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {flow.status}
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(flow)}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      <Play className="w-4 h-4" />
                      Preview
                    </button>
                    <Link
                      href={`/dashboard/flows/builder/${flow.id}`}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
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

      {/* Preview Modal */}
      {previewFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-none max-h-none m-4 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Preview: {previewFlow.title}</h2>
                <p className="text-sm text-gray-500">Testing flow without publishing</p>
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`/dashboard/flows/preview/${previewFlow.id}`}
                className="w-full h-full border-0"
                title={`Preview of ${previewFlow.title}`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
