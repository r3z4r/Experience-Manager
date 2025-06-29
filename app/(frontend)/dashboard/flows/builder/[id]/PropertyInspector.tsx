'use client'

import { useState } from 'react'
import { Settings, X, Plus, Trash2, FileText, Globe, GitBranch } from 'lucide-react'
import { Button } from '@/app/(frontend)/_components/ui/button'
import PageSelectionModal from './PageSelectionModal'

interface Props {
  selectedNode: any | null
  selectedEdge: any | null
  onUpdateNode: (id: string, data: any) => void
  onUpdateEdge: (id: string, data: any) => void
  onClose: () => void
}

// Common fields for API response data and context variables
const COMMON_FIELDS = [
  { value: 'user.email', label: 'User Email' },
  { value: 'user.role', label: 'User Role' },
  { value: 'form.name', label: 'Form Name' },
  { value: 'form.email', label: 'Form Email' },
  { value: 'form.age', label: 'Form Age' },
  { value: 'context.step', label: 'Current Step' },
  { value: 'context.score', label: 'Score' },
  // API response fields
  { value: 'api.response.status', label: 'API Response Status' },
  { value: 'api.response.success', label: 'API Response Success' },
  { value: 'api.response.data.id', label: 'API Response - ID' },
  { value: 'api.response.data.name', label: 'API Response - Name' },
  { value: 'api.response.data.email', label: 'API Response - Email' },
  { value: 'api.response.data.status', label: 'API Response - Status' },
  { value: 'api.response.data.result', label: 'API Response - Result' },
]

// Operators for condition expressions
const OPERATORS = [
  { value: '==', label: 'equals' },
  { value: '!=', label: 'not equals' },
  { value: '>', label: 'greater than' },
  { value: '<', label: 'less than' },
  { value: '>=', label: 'greater than or equal' },
  { value: '<=', label: 'less than or equal' },
  { value: 'includes', label: 'contains' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' },
]

export default function PropertyInspector({ selectedNode, selectedEdge, onUpdateNode, onUpdateEdge, onClose }: Props) {
  const [nodeData, setNodeData] = useState(selectedNode?.data || {})
  const [edgeData, setEdgeData] = useState(selectedEdge?.data || {})
  const [isPageSelectionOpen, setIsPageSelectionOpen] = useState(false)

  const handleNodeUpdate = (key: string, value: any) => {
    const updatedData = { ...nodeData, [key]: value }
    setNodeData(updatedData)
    
    // Update the node with properly formatted data structure
    onUpdateNode(selectedNode.id, { 
      data: updatedData 
    })
    
    // Also update the node label if title or label is changed
    if (key === 'title' || key === 'label') {
      // Create a new object for the update to ensure React Flow detects the change
      const nodeLabel = updatedData.title || updatedData.label || 'Unnamed'
      onUpdateNode(selectedNode.id, {
        data: { ...updatedData, label: nodeLabel }
      })
    }
  }

  const handleEdgeUpdate = (field: string, value: any) => {
    const updated = { ...edgeData, [field]: value }
    setEdgeData(updated)
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, updated)
    }
  }

  if (!selectedNode && !selectedEdge) {
    return null
  }

  const handleSelectPage = (pageId: string, pageTitle: string) => {
    handleNodeUpdate('pageId', pageId)
    handleNodeUpdate('pageTitle', pageTitle)
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
      
      {/* Page Selection Modal */}
      <PageSelectionModal
        open={isPageSelectionOpen}
        onOpenChange={setIsPageSelectionOpen}
        onSelectPage={handleSelectPage}
        selectedPageId={nodeData.pageId}
      />

      {selectedNode && (
        <div className="space-y-4">
          {/* Common node properties */}
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
          
          {/* API+Condition node specific properties */}
          {selectedNode.type === 'apiCondition' && (
            <>
              {/* API Configuration Section */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  API Configuration
                </h4>
                
                {/* API Enable Toggle */}
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="apiEnabled"
                    checked={nodeData.apiEnabled ?? false}
                    onChange={(e) => handleNodeUpdate('apiEnabled', e.target.checked)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="apiEnabled" className="text-sm text-gray-600">
                    Make API call before condition check
                  </label>
                </div>

                {/* Only show API config if enabled */}
                {nodeData.apiEnabled && (
                  <>
                    {/* Method Selection */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Method
                      </label>
                      <select
                        value={nodeData.apiMethod || 'GET'}
                        onChange={(e) => handleNodeUpdate('apiMethod', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>

                    {/* URL Input */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        URL
                      </label>
                      <input
                        type="text"
                        value={nodeData.apiUrl || ''}
                        onChange={(e) => handleNodeUpdate('apiUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://api.example.com/endpoint"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can use context variables with {'{{'} and {'}}'}
                      </p>
                    </div>

                    {/* Request Body (for POST/PUT) */}
                    {(nodeData.apiMethod === 'POST' || nodeData.apiMethod === 'PUT') && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Request Body (JSON)
                        </label>
                        <textarea
                          value={nodeData.apiBody || ''}
                          onChange={(e) => handleNodeUpdate('apiBody', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder='{"key": "{{context.value}}"}'                          
                          rows={4}
                        />
                      </div>
                    )}

                    {/* Response Mapping */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Response Mapping
                        </label>
                        <button
                          onClick={() => {
                            const mappings = [...(nodeData.apiResponseMappings || [])]
                            mappings.push({ contextKey: '', responsePath: '' })
                            handleNodeUpdate('apiResponseMappings', mappings)
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                          type="button"
                        >
                          + Add Mapping
                        </button>
                      </div>
                      
                      {(nodeData.apiResponseMappings || []).map((mapping: { contextKey: string; responsePath: string }, index: number) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={mapping.contextKey}
                            onChange={(e) => {
                              const mappings = [...(nodeData.apiResponseMappings || [])]
                              mappings[index].contextKey = e.target.value
                              handleNodeUpdate('apiResponseMappings', mappings)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="api.response.success"
                          />
                          <input
                            type="text"
                            value={mapping.responsePath}
                            onChange={(e) => {
                              const mappings = [...(nodeData.apiResponseMappings || [])]
                              mappings[index].responsePath = e.target.value
                              handleNodeUpdate('apiResponseMappings', mappings)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="data.success"
                          />
                          <button
                            onClick={() => {
                              const mappings = [...(nodeData.apiResponseMappings || [])]
                              mappings.splice(index, 1)
                              handleNodeUpdate('apiResponseMappings', mappings)
                            }}
                            className="p-2 text-gray-400 hover:text-red-500"
                            type="button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Dynamic Branch Section */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <GitBranch className="w-4 h-4" />
                  Branch Configuration
                </h4>
                
                {/* Dynamic Branch Configuration */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Branch Configuration</h4>
                    <button
                      onClick={() => {
                        const branches = [...(nodeData.branches || [])]
                        branches.push({ label: `Branch ${branches.length + 1}`, condition: '' })
                        handleNodeUpdate('branches', branches)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      type="button"
                    >
                      <Plus className="w-3 h-3" /> Add Branch
                    </button>
                  </div>
                  
                  {/* Default branch is always present */}
                  <div className="mb-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Default Branch (when no conditions match)
                      </label>
                    </div>
                    <input
                      type="text"
                      value={nodeData.defaultBranchLabel || 'Default'}
                      onChange={(e) => handleNodeUpdate('defaultBranchLabel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Default branch label"
                    />
                  </div>
                  
                  {/* Dynamic branches */}
                  {(nodeData.branches || []).map((branch: { label: string; condition: string }, index: number) => (
                    <div key={index} className="mb-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Branch {index + 1}
                        </label>
                        <button
                          onClick={() => {
                            const branches = [...(nodeData.branches || [])]
                            branches.splice(index, 1)
                            handleNodeUpdate('branches', branches)
                          }}
                          className="text-gray-400 hover:text-red-500"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="mb-2">
                        <input
                          type="text"
                          value={branch.label}
                          onChange={(e) => {
                            const branches = [...(nodeData.branches || [])]
                            branches[index].label = e.target.value
                            handleNodeUpdate('branches', branches)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Branch label"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Condition
                        </label>
                        <textarea
                          value={branch.condition}
                          onChange={(e) => {
                            const branches = [...(nodeData.branches || [])]
                            branches[index].condition = e.target.value
                            handleNodeUpdate('branches', branches)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="api.response.status === 'success'"
                          rows={2}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use context variables directly, e.g., <code>api.response.status === 'success'</code>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {selectedNode.type === 'page' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Page
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nodeData.pageId || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Select a page..."
                  />
                  <Button 
                    onClick={() => setIsPageSelectionOpen(true)}
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-2"
                  >
                    <FileText className="w-4 h-4" />
                    Browse
                  </Button>
                </div>
                {nodeData.pageTitle && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{nodeData.pageTitle}</p>
                )}
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
                <label className="text-xs font-medium text-gray-700 mb-1 inline-block">
                  API Configuration
                </label>
                <div className="space-y-2">
                  <select
                    value={nodeData.api?.method || 'POST'}
                    onChange={(e) => handleNodeUpdate('api', { ...nodeData.api, method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="storeResponse"
                      checked={nodeData.api?.storeResponse || false}
                      onChange={(e) => handleNodeUpdate('api', { ...nodeData.api, storeResponse: e.target.checked })}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                    />
                    <label htmlFor="storeResponse" className="text-xs text-gray-700">
                      Store response in flow context
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useForConditions"
                      checked={nodeData.api?.useForConditions || false}
                      onChange={(e) => handleNodeUpdate('api', { ...nodeData.api, useForConditions: e.target.checked })}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                    />
                    <label htmlFor="useForConditions" className="text-xs text-gray-700">
                      Use response for conditions
                    </label>
                  </div>
                  
                  {nodeData.api?.storeResponse && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 inline-block">
                        Response Context Path
                      </label>
                      <input
                        type="text"
                        value={nodeData.api?.responsePath || 'api.response'}
                        onChange={(e) => handleNodeUpdate('api', { ...nodeData.api, responsePath: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="api.response"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Path in flow context where API response will be stored
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {selectedNode.type === 'condition' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Dynamic Branches
                </label>
                <button
                  onClick={() => {
                    const branches = [...(nodeData.branches || [])]
                    branches.push({ label: `Branch ${branches.length + 1}`, condition: '' })
                    handleNodeUpdate('branches', branches)
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="w-3 h-3" />
                  Add Branch
                </button>
              </div>
              
              <div className="space-y-3">
                {(nodeData.branches || []).map((branch: { label: string; condition: string }, index: number) => (
                  <div key={index} className="mb-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Branch {index + 1}
                      </label>
                      <button
                        onClick={() => {
                          const branches = [...(nodeData.branches || [])]
                          branches.splice(index, 1)
                          handleNodeUpdate('branches', branches)
                        }}
                        className="text-gray-400 hover:text-red-500"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mb-2">
                      <input
                        type="text"
                        value={branch.label}
                        onChange={(e) => {
                          const branches = [...(nodeData.branches || [])]
                          branches[index].label = e.target.value
                          handleNodeUpdate('branches', branches)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Branch label"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <textarea
                        value={branch.condition}
                        onChange={(e) => {
                          const branches = [...(nodeData.branches || [])]
                          branches[index].condition = e.target.value
                          handleNodeUpdate('branches', branches)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="api.response.status === 'success'"
                        rows={2}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use context variables directly, e.g., <code>api.response.status === 'success'</code>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
