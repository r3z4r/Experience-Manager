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

interface ConditionRule {
  field: string
  operator: string
  value: string
  logicalOperator?: 'AND' | 'OR'
}

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

export default function PropertyInspector({ selectedNode, selectedEdge, onUpdateNode, onUpdateEdge, onClose }: Props) {
  const [nodeData, setNodeData] = useState(selectedNode?.data || {})
  const [edgeData, setEdgeData] = useState(selectedEdge?.data || {})
  const [isPageSelectionOpen, setIsPageSelectionOpen] = useState(false)
  const [conditionRules, setConditionRules] = useState<ConditionRule[]>(() => {
    if (selectedNode?.type === 'condition' && selectedNode.data.condition) {
      // Try to parse existing condition back to rules (simplified)
      return [{ field: '', operator: '==', value: selectedNode.data.condition }]
    }
    return [{ field: '', operator: '==', value: '' }]
  })

  const updateConditionRules = (rules: ConditionRule[]) => {
    setConditionRules(rules)
    if (selectedNode && onUpdateNode) {
      // Convert rules back to JavaScript expression
      const condition = buildConditionExpression(rules)
      onUpdateNode(selectedNode.id, {
        data: { ...selectedNode.data, condition }
      })
    }
  }

  const buildConditionExpression = (rules: ConditionRule[]): string => {
    if (rules.length === 0) return 'true'
    
    return rules
      .filter(rule => rule.field && rule.operator && rule.value)
      .map((rule, index) => {
        const { field, operator, value } = rule
        let expression = ''
        
        if (index > 0 && rule.logicalOperator) {
          expression += ` ${rule.logicalOperator} `
        }
        
        // Handle different operators
        switch (operator) {
          case 'includes':
            expression += `(${field} && ${field}.toString().includes('${value}'))`
            break
          case 'startsWith':
            expression += `(${field} && ${field}.toString().startsWith('${value}'))`
            break
          case 'endsWith':
            expression += `(${field} && ${field}.toString().endsWith('${value}'))`
            break
          default:
            // For numeric comparisons, try to parse as number
            const numValue = isNaN(Number(value)) ? `'${value}'` : value
            expression += `(${field} ${operator} ${numValue})`
        }
        
        return expression
      })
      .join('')
  }

  const addConditionRule = () => {
    const newRules = [...conditionRules, { field: '', operator: '==', value: '', logicalOperator: 'AND' as const }]
    updateConditionRules(newRules)
  }

  const removeConditionRule = (index: number) => {
    const newRules = conditionRules.filter((_, i) => i !== index)
    updateConditionRules(newRules)
  }

  const updateConditionRule = (index: number, updates: Partial<ConditionRule>) => {
    const newRules = conditionRules.map((rule, i) => 
      i === index ? { ...rule, ...updates } : rule
    )
    updateConditionRules(newRules)
  }

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

              {/* Condition Section */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <GitBranch className="w-4 h-4" />
                  Condition Rules
                </h4>
                
                {/* Condition Rules */}
                {conditionRules.map((rule: ConditionRule, index: number) => (
                  <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                    {index > 0 && (
                      <div className="mb-2">
                        <select
                          value={rule.logicalOperator || 'AND'}
                          onChange={(e) => updateConditionRule(index, { logicalOperator: e.target.value as 'AND' | 'OR' })}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <select
                        value={rule.field}
                        onChange={(e) => updateConditionRule(index, { field: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select field...</option>
                        {COMMON_FIELDS.map(field => (
                          <option key={field.value} value={field.value}>{field.label}</option>
                        ))}
                      </select>
                      
                      <div className="flex gap-2">
                        <select
                          value={rule.operator}
                          onChange={(e) => updateConditionRule(index, { operator: e.target.value })}
                          className="w-1/3 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {OPERATORS.map(op => (
                            <option key={op.value} value={op.value}>{op.label}</option>
                          ))}
                        </select>
                        
                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => updateConditionRule(index, { value: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Value..."
                        />
                        
                        <button
                          onClick={() => removeConditionRule(index)}
                          className="p-2 text-gray-400 hover:text-red-500"
                          disabled={conditionRules.length === 1}
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addConditionRule}
                  className="w-full flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Condition Rule
                </Button>
                
                {/* Path Configuration */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Path Configuration</h4>
                  
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Success Path Label
                    </label>
                    <input
                      type="text"
                      value={nodeData.successLabel || 'Success'}
                      onChange={(e) => handleNodeUpdate('successLabel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Failure Path Label
                    </label>
                    <input
                      type="text"
                      value={nodeData.failureLabel || 'Failure'}
                      onChange={(e) => handleNodeUpdate('failureLabel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                  Condition Rules
                </label>
                <button
                  onClick={addConditionRule}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="w-3 h-3" />
                  Add Rule
                </button>
              </div>
              
              <div className="space-y-3">
                {conditionRules.map((rule, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3 space-y-2">
                    {index > 0 && (
                      <div>
                        <select
                          value={rule.logicalOperator || 'AND'}
                          onChange={(e) => updateConditionRule(index, { 
                            logicalOperator: e.target.value as 'AND' | 'OR' 
                          })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <select
                          value={rule.field}
                          onChange={(e) => updateConditionRule(index, { field: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="">Select field</option>
                          {COMMON_FIELDS.map(field => (
                            <option key={field.value} value={field.value}>
                              {field.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <select
                          value={rule.operator}
                          onChange={(e) => updateConditionRule(index, { operator: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          {OPERATORS.map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => updateConditionRule(index, { value: e.target.value })}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                          placeholder="Value"
                        />
                        {conditionRules.length > 1 && (
                          <button
                            onClick={() => removeConditionRule(index)}
                            className="px-1 py-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-2">
                <label className="block text-xs text-gray-500 mb-1">Generated Expression:</label>
                <code className="block w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono">
                  {buildConditionExpression(conditionRules)}
                </code>
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
