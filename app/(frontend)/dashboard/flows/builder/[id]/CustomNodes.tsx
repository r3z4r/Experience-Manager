'use client'

import React from 'react'
import { Handle, Position } from 'reactflow'
import { FileText, GitBranch, Play, Square, Globe } from 'lucide-react'

// Base node component with left and right handles
interface BaseNodeProps {
  data: any
  selected?: boolean
  children: React.ReactNode
  className?: string
  showSourceHandle?: boolean
  showTargetHandle?: boolean
}

function BaseNode({ 
  data, 
  selected, 
  children, 
  className = '', 
  showSourceHandle = true, 
  showTargetHandle = true 
}: BaseNodeProps) {
  return (
    <div className={`
      relative px-4 py-3 bg-white border-2 rounded-lg shadow-sm min-w-[120px]
      ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'}
      ${className}
    `}>
      {/* Target handle (left side) */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
          style={{ left: -6 }}
        />
      )}
      
      {children}
      
      {/* Source handle (right side) */}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
          style={{ right: -6 }}
        />
      )}
    </div>
  )
}

// Start Node - only source handle
export function StartNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <BaseNode 
      data={data} 
      selected={selected} 
      className="bg-green-50 border-green-300"
      showTargetHandle={false}
    >
      <div className="flex items-center gap-2">
        <Play className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">{data.label || 'Start'}</span>
      </div>
    </BaseNode>
  )
}

// End Node - only target handle
export function EndNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <BaseNode 
      data={data} 
      selected={selected} 
      className="bg-red-50 border-red-300"
      showSourceHandle={false}
    >
      <div className="flex items-center gap-2">
        <Square className="w-4 h-4 text-red-600" />
        <span className="text-sm font-medium text-red-800">{data.label || 'End'}</span>
      </div>
    </BaseNode>
  )
}

// Page Node - both handles
export function PageNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <BaseNode data={data} selected={selected} className="bg-blue-50 border-blue-300">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-blue-800">{data.label || 'Page'}</span>
          {data.pagePath && (
            <span className="text-xs text-blue-600">{data.pagePath}</span>
          )}
        </div>
      </div>
    </BaseNode>
  )
}

// Condition Node - both handles
export function ConditionNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <BaseNode data={data} selected={selected} className="bg-yellow-50 border-yellow-300">
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-yellow-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-yellow-800">{data.label || 'Condition'}</span>
          {data.conditions && data.conditions.length > 0 && (
            <span className="text-xs text-yellow-600">
              {data.conditions.length} rule{data.conditions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </BaseNode>
  )
}

// API Node - both handles
export function ApiNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <BaseNode data={data} selected={selected} className="bg-purple-50 border-purple-300">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-purple-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-purple-800">{data.label || 'API Call'}</span>
          {data.method && (
            <span className="text-xs text-purple-600">{data.method.toUpperCase()}</span>
          )}
        </div>
      </div>
    </BaseNode>
  )
}

// Default Node - both handles (fallback)
export function DefaultNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <BaseNode data={data} selected={selected}>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-400 rounded-full" />
        <span className="text-sm font-medium text-gray-800">{data.label || 'Node'}</span>
      </div>
    </BaseNode>
  )
}

// Node types mapping for React Flow
export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  page: PageNode,
  condition: ConditionNode,
  api: ApiNode,
  default: DefaultNode,
}
