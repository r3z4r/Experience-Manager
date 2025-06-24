'use client'

import dynamic from 'next/dynamic'
import React, { useCallback, useState } from 'react'
import { Save } from 'lucide-react'
import NodePalette from './NodePalette'
import PropertyInspector from './PropertyInspector'

// React Flow must be dynamically imported to avoid SSR issues
const ReactFlow = dynamic(() => import('reactflow').then((m) => m.ReactFlow), {
  ssr: false,
})

// React Flow global styles
import 'reactflow/dist/style.css'

interface Props {
  initialGraph: { nodes: any[]; edges: any[] }
  flowTitle: string
  flowId: string
  saveFlow: (id: string, graph: any) => Promise<boolean>
}

export default function FlowBuilderClient({ initialGraph, flowTitle, flowId, saveFlow }: Props) {
  const [nodes, setNodes] = useState(initialGraph.nodes)
  const [edges, setEdges] = useState(initialGraph.edges)
  const [saving, setSaving] = useState(false)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [selectedEdge, setSelectedEdge] = useState<any>(null)
  const [showInspector, setShowInspector] = useState(false)

  const handleSave = useCallback(async () => {
    setSaving(true)
    const success = await saveFlow(flowId, { nodes, edges })
    setSaving(false)
    if (success) {
      console.log('Flow saved successfully')
    } else {
      console.error('Failed to save flow')
    }
  }, [flowId, nodes, edges, saveFlow])

  const handleAddNode = useCallback((template: any) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: template.type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { ...template.data },
    }
    setNodes((nds) => [...nds, newNode])
  }, [])

  const handleNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node)
    setSelectedEdge(null)
    setShowInspector(true)
  }, [])

  const handleEdgeClick = useCallback((event: any, edge: any) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
    setShowInspector(true)
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    setShowInspector(false)
  }, [])

  const handleUpdateNode = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node))
    )
  }, [])

  const handleUpdateEdge = useCallback((id: string, data: any) => {
    setEdges((eds) =>
      eds.map((edge) => (edge.id === id ? { ...edge, data: { ...edge.data, ...data } } : edge))
    )
  }, [])

  const handleConnect = useCallback((connection: any) => {
    const newEdge = {
      id: `edge-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      data: { label: '' },
    }
    setEdges((eds) => [...eds, newEdge])
  }, [])

  return (
    <div className="h-screen w-full flex">
      {/* Node Palette */}
      <NodePalette onAddNode={handleAddNode} />

      {/* Main Flow Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">{flowTitle}</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              setNodes((nds) => {
                return changes.reduce((acc, change) => {
                  if (change.type === 'position' && 'id' in change && change.position) {
                    return acc.map((node) =>
                      node.id === change.id ? { ...node, position: change.position } : node
                    )
                  }
                  if (change.type === 'select' && 'id' in change) {
                    return acc.map((node) =>
                      node.id === change.id ? { ...node, selected: change.selected } : node
                    )
                  }
                  if (change.type === 'remove' && 'id' in change) {
                    return acc.filter((node) => node.id !== change.id)
                  }
                  return acc
                }, nds)
              })
            }}
            onEdgesChange={(changes) => {
              setEdges((eds) => {
                return changes.reduce((acc, change) => {
                  if (change.type === 'select' && 'id' in change) {
                    return acc.map((edge) =>
                      edge.id === change.id ? { ...edge, selected: change.selected } : edge
                    )
                  }
                  if (change.type === 'remove' && 'id' in change) {
                    return acc.filter((edge) => edge.id !== change.id)
                  }
                  return acc
                }, eds)
              })
            }}
            onConnect={handleConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            fitView
            nodesDraggable
            nodesConnectable
            elementsSelectable
          />
        </div>
      </div>

      {/* Property Inspector */}
      {showInspector && (
        <PropertyInspector
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onUpdateNode={handleUpdateNode}
          onUpdateEdge={handleUpdateEdge}
          onClose={() => setShowInspector(false)}
        />
      )}
    </div>
  )
}
