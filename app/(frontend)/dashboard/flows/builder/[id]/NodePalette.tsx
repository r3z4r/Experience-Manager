'use client'

import { Plus, FileText, GitBranch, Play, Square, Globe } from 'lucide-react'

interface NodeTemplate {
  type: string
  label: string
  icon: React.ReactNode
  data: any
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'start',
    label: 'Start Node',
    icon: <Play className="w-4 h-4" />,
    data: {
      label: 'Start',
    },
  },
  {
    type: 'page',
    label: 'Page Node',
    icon: <FileText className="w-4 h-4" />,
    data: {
      label: 'New Page',
      pageId: null,
      pagePath: null,
    },
  },
  {
    type: 'apiCondition',
    label: 'API + Condition',
    icon: <div className="flex items-center gap-1"><Globe className="w-4 h-4" /><GitBranch className="w-4 h-4" /></div>,
    data: {
      label: 'API + Condition',
      apiEnabled: true,
      apiMethod: 'GET',
      apiUrl: '',
      apiBody: '',
      apiResponseMappings: [
        { contextKey: 'api.response.status', responsePath: 'status' },
        { contextKey: 'api.response.success', responsePath: 'success' }
      ],
      condition: '',
      successLabel: 'Success',
      failureLabel: 'Failure'
    },
  },
  {
    type: 'end',
    label: 'End Node',
    icon: <Square className="w-4 h-4" />,
    data: {
      label: 'End',
    },
  },
]

interface Props {
  onAddNode: (template: NodeTemplate) => void
}

export default function NodePalette({ onAddNode }: Props) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Node Palette
      </h3>
      
      <div className="space-y-2">
        {nodeTemplates.map((template) => (
          <button
            key={template.type}
            onClick={() => onAddNode(template)}
            className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <div className="text-blue-600">{template.icon}</div>
            <span className="text-sm font-medium">{template.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <strong>Tip:</strong> Click a node type to add it to the canvas. Drag nodes to reposition them.
      </div>
    </div>
  )
}
