'use client'

import { useState } from 'react'
import { Settings, X } from 'lucide-react'

interface Props {
  selectedNode: any | null
  selectedEdge: any | null
  onUpdateNode: (id: string, data: any) => void
  onUpdateEdge: (id: string, data: any) => void
  onClose: () => void
}

export default function PropertyInspector({ selectedNode, selectedEdge, onUpdateNode, onUpdateEdge, onClose }: Props) {
  const [nodeData, setNodeData] = useState(selectedNode?.data || {})
  const [edgeData, setEdgeData] = useState(selectedEdge?.data || {})

  if (!selectedNode && !selectedEdge) {
    return null
  }

  const handleNodeUpdate = (field: string, value: any) => {
    const updated = { ...nodeData, [field]: value }
    setNodeData(updated)
    if (selectedNode) {
      onUpdateNode(selectedNode.id, updated)
    }
  }

  const handleEdgeUpdate = (field: string, value: any) => {
    const updated = { ...edgeData, [field]: value }
    setEdgeData(updated)
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, updated)
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Properties
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {selectedNode && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Node Label
            </label>
            <input
              type="text"
              value={nodeData.label || ''}
              onChange={(e) => handleNodeUpdate('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter node label..."
            />
          </div>

          {selectedNode.type === 'page' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Page ID
                </label>
                <input
                  type="text"
                  value={nodeData.pageId || ''}
                  onChange={(e) => handleNodeUpdate('pageId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Payload page ID..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Page Path (Alternative)
                </label>
                <input
                  type="text"
                  value={nodeData.pagePath || ''}
                  onChange={(e) => handleNodeUpdate('pagePath', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="External page URL..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  API Configuration
                </label>
                <select
                  value={nodeData.api?.method || 'POST'}
                  onChange={(e) => handleNodeUpdate('api', { ...nodeData.api, method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                </select>
                <input
                  type="text"
                  value={nodeData.api?.url || ''}
                  onChange={(e) => handleNodeUpdate('api', { ...nodeData.api, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="API endpoint URL..."
                />
              </div>
            </>
          )}

          {selectedNode.type === 'condition' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Condition Logic
              </label>
              <textarea
                value={nodeData.conditions || ''}
                onChange={(e) => handleNodeUpdate('conditions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Define conditions..."
              />
            </div>
          )}
        </div>
      )}

      {selectedEdge && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Edge Label
            </label>
            <input
              type="text"
              value={edgeData.label || ''}
              onChange={(e) => handleEdgeUpdate('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter edge label..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Condition
            </label>
            <input
              type="text"
              value={edgeData.condition || ''}
              onChange={(e) => handleEdgeUpdate('condition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Edge condition..."
            />
          </div>
        </div>
      )}

      <div className="mt-6 p-3 bg-blue-50 rounded text-xs text-blue-700">
        <strong>Note:</strong> Changes are automatically saved when you modify properties.
      </div>
    </div>
  )
}
