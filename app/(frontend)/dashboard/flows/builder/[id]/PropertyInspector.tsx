'use client'

import { useState } from 'react'
import { Settings, X, Plus, Trash2 } from 'lucide-react'

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
]

export default function PropertyInspector({ selectedNode, selectedEdge, onUpdateNode, onUpdateEdge, onClose }: Props) {
  const [nodeData, setNodeData] = useState(selectedNode?.data || {})
  const [edgeData, setEdgeData] = useState(selectedEdge?.data || {})
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

  if (!selectedNode && !selectedEdge) {
    return null
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
