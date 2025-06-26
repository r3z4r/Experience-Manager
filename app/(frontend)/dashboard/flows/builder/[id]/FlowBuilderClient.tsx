'use client'

import dynamic from 'next/dynamic'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Save, ArrowRight, CheckCircle, Settings } from 'lucide-react'
import { useNodesState, useEdgesState, Background, Controls, addEdge, Connection } from 'reactflow'
import NodePalette from './NodePalette'
import PropertyInspector from './PropertyInspector'
import ValidationPanel from './ValidationPanel'
import ContextEditor from './ContextEditor'
import { nodeTypes } from './CustomNodes'

const ReactFlow = dynamic(() => import('reactflow').then((m) => m.ReactFlow), {
  ssr: false,
})

// React Flow global styles
import 'reactflow/dist/style.css'

interface Props {
  initialGraph: { nodes: any[]; edges: any[] }
  flowTitle: string
  flowId: string
  flowStatus: 'draft' | 'approved' | 'archived'
  initialContext?: Record<string, any>
  saveFlow: (id: string, graph: any, context?: Record<string, any>) => Promise<boolean>
}

export default function FlowBuilderClient({ initialGraph, flowTitle, flowId, flowStatus, initialContext = {}, saveFlow }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [selectedEdge, setSelectedEdge] = useState<any>(null)
  const [showInspector, setShowInspector] = useState(false)
  const [showContextEditor, setShowContextEditor] = useState(false)
  const [flowContext, setFlowContext] = useState<Record<string, any>>(initialContext || {})
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<'draft' | 'approved' | 'archived'>(flowStatus)
  const hasArrangedRef = useRef(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-arrange nodes in logical flow sequence
  const arrangeNodesLinear = useCallback((nodeList: any[], currentEdges: any[] = edges) => {
    const HORIZONTAL_SPACING = 300 // Increased for better visibility
    const VERTICAL_SPACING = 150
    const BRANCH_VERTICAL_OFFSET = 200 // Offset for branching paths
    
    // If no nodes, return empty array
    if (!nodeList.length) return []
    
    // Create a map of node IDs to nodes for quick lookup
    const nodeMap = nodeList.reduce((map, node) => {
      map[node.id] = node
      return map
    }, {} as Record<string, any>)
    
    // Create maps for connections
    const outgoingConnections: Record<string, string[]> = {}
    const incomingConnections: Record<string, string[]> = {}
    
    // Initialize connection maps
    currentEdges.forEach(edge => {
      if (!outgoingConnections[edge.source]) {
        outgoingConnections[edge.source] = []
      }
      if (!incomingConnections[edge.target]) {
        incomingConnections[edge.target] = []
      }
      outgoingConnections[edge.source].push(edge.target)
      incomingConnections[edge.target].push(edge.source)
    })
    
    // Find start nodes (nodes with type 'start' or nodes with no incoming edges)
    let startNodes = nodeList.filter(node => node.type === 'start')
    if (!startNodes.length) {
      // If no explicit start nodes, find nodes that have no incoming edges
      const targetNodeIds = new Set(currentEdges.map(edge => edge.target))
      startNodes = nodeList.filter(node => !targetNodeIds.has(node.id))
    }
    
    // If still no start nodes, just use the first node
    if (!startNodes.length && nodeList.length > 0) {
      startNodes = [nodeList[0]]
    }
    
    // Build the sequence by traversing the graph from start nodes
    const visited = new Set<string>()
    const sequence: any[] = []
    const nodePositions: Record<string, { x: number, y: number, level: number }> = {}
    let maxLevel = 0
    
    // Breadth-first traversal for better linear layout
    const queue: Array<{ nodeId: string, level: number, branch: number }> = []
    
    // Start with all start nodes at level 0
    startNodes.forEach((node, index) => {
      queue.push({ nodeId: node.id, level: 0, branch: index })
    })
    
    // Process queue for breadth-first traversal
    while (queue.length > 0) {
      const { nodeId, level, branch } = queue.shift()!
      
      if (visited.has(nodeId)) continue
      visited.add(nodeId)
      
      const node = nodeMap[nodeId]
      if (node) {
        sequence.push(node)
        
        // Calculate position based on level and branch
        const x = level * HORIZONTAL_SPACING + 50
        const y = branch * BRANCH_VERTICAL_OFFSET + 50
        
        nodePositions[nodeId] = { x, y, level }
        maxLevel = Math.max(maxLevel, level)
        
        // Add all connected nodes to queue at next level
        const connectedNodeIds = outgoingConnections[nodeId] || []
        connectedNodeIds.forEach((targetId, branchIndex) => {
          // Calculate branch offset based on number of incoming connections
          const targetIncoming = incomingConnections[targetId] || []
          const targetBranchIndex = targetIncoming.indexOf(nodeId)
          const targetBranch = branch + (branchIndex > 0 ? branchIndex : 0)
          
          queue.push({ 
            nodeId: targetId, 
            level: level + 1,
            branch: targetBranch
          })
        })
      }
    }
    
    // Add any remaining nodes that weren't connected
    let remainingBranch = Object.keys(nodePositions).length
    nodeList.forEach(node => {
      if (!visited.has(node.id)) {
        sequence.push(node)
        nodePositions[node.id] = { 
          x: (maxLevel + 1) * HORIZONTAL_SPACING + 50, 
          y: remainingBranch * VERTICAL_SPACING + 50,
          level: maxLevel + 1
        }
        remainingBranch++
      }
    })
    
    // Apply calculated positions to nodes
    return nodeList.map(node => {
      const position = nodePositions[node.id] || { x: 50, y: 50, level: 0 }
      return {
        ...node,
        position: {
          x: position.x,
          y: position.y,
        },
      }
    })
  }, [])

  const autoArrangeNodes = useCallback(() => {
    if (nodes.length > 0) {
      const arrangedNodes = arrangeNodesLinear(nodes)
      setNodes(arrangedNodes)
      setIsInitialized(true)
    }
  }, [arrangeNodesLinear, nodes, setNodes])

  // Auto-arrange nodes in linear layout when nodes change
  useEffect(() => {
    if (nodes.length > 0 && !hasArrangedRef.current) {
      autoArrangeNodes()
      hasArrangedRef.current = true
    }
  }, [nodes.length, autoArrangeNodes])

  // Auto-save functionality with debouncing
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    setHasUnsavedChanges(true)
    
    autoSaveTimeoutRef.current = setTimeout(async () => {
      setAutoSaving(true)
      const success = await saveFlow(flowId, { nodes, edges }, flowContext)
      setAutoSaving(false)
      
      if (success) {
        setHasUnsavedChanges(false)
        setLastSaved(new Date())
      }
    }, 2000) // Auto-save after 2 seconds of inactivity
  }, [flowId, nodes, edges, flowContext, saveFlow])

  // Trigger auto-save when nodes, edges, or context change (but not on initial load)
  useEffect(() => {
    if (isInitialized && (nodes.length > 0 || edges.length > 0)) {
      triggerAutoSave()
    }
  }, [nodes, edges, flowContext, isInitialized, triggerAutoSave])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  const handleSave = useCallback(async () => {
    // Cancel any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    setSaving(true)
    const success = await saveFlow(flowId, { nodes, edges }, flowContext)
    setSaving(false)
    
    if (success) {
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
      console.log('Flow saved successfully')
    } else {
      console.error('Failed to save flow')
    }
  }, [flowId, nodes, edges, flowContext, saveFlow])

  const handleAddNode = useCallback((template: any) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: template.type,
      position: { x: 0, y: 0 }, // Will be auto-positioned
      data: { ...template.data },
    }
    
    setNodes((nds: any[]) => {
      const updatedNodes = [...nds, newNode]
      return arrangeNodesLinear(updatedNodes)
    })
  }, [arrangeNodesLinear, setNodes])

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

  const handleUpdateNode = useCallback((id: string, updates: any) => {
    setNodes((nds: any[]) => nds.map((node: any) => {
      if (node.id === id) {
        // Create a new node object with updated properties
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            ...updates.data
          },
          // Apply any other updates (like position)
          ...(updates.position ? { position: updates.position } : {}),
          ...(updates.type ? { type: updates.type } : {}),
        }
        
        // If this is the currently selected node, update the selectedNode reference
        if (selectedNode && selectedNode.id === id) {
          setSelectedNode(updatedNode)
        }
        
        return updatedNode
      }
      return node
    }))
    
    // Mark that we have unsaved changes
    setHasUnsavedChanges(true)
  }, [setNodes, selectedNode])

  const handleUpdateEdge = useCallback((id: string, updates: any) => {
    setEdges((eds: any[]) => eds.map((edge: any) => {
      if (edge.id === id) {
        const updatedEdge = { ...edge, ...updates }
        
        // If this is the currently selected edge, update the selectedEdge reference
        if (selectedEdge && selectedEdge.id === id) {
          setSelectedEdge(updatedEdge)
        }
        
        return updatedEdge
      }
      return edge
    }))
    
    // Mark that we have unsaved changes
    setHasUnsavedChanges(true)
  }, [setEdges, selectedEdge])

  const handleConnect = useCallback((connection: Connection) => {
    const newEdge = {
      id: `edge-${Date.now()}`,
      ...connection,
      type: 'smoothstep',
      animated: true,
      data: { label: '' },
    }
    setEdges((eds) => addEdge(newEdge, eds))
  }, [setEdges])

  const handleArrangeFlow = useCallback(() => {
    setNodes((nds: any[]) => arrangeNodesLinear(nds))
  }, [arrangeNodesLinear, setNodes])

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{flowTitle}</h1>
            <p className="text-sm text-gray-500">Flow Builder</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Auto-save status indicator */}
            <div className="flex items-center gap-2 text-xs">
              {autoSaving && (
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Auto-saving...
                </div>
              )}
              {lastSaved && !autoSaving && !hasUnsavedChanges && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
              {hasUnsavedChanges && !autoSaving && (
                <div className="text-amber-600">
                  Unsaved changes
                </div>
              )}
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving || autoSaving}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {(saving || autoSaving) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save'}
            </button>

            <button
              onClick={handleArrangeFlow}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              <ArrowRight className="w-4 h-4" />
              Auto Arrange
            </button>

            <button
              onClick={() => setShowContextEditor(true)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              <Settings className="w-4 h-4" />
              Context Editor
            </button>
          </div>
        </div>
      </div>

      {/* Context Editor Modal */}
      {showContextEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-2/3 h-3/4 bg-white rounded-lg shadow-xl overflow-hidden">
            <ContextEditor
              initialContext={flowContext}
              onSaveContext={(context) => {
                setFlowContext(context)
                setShowContextEditor(false)
                setHasUnsavedChanges(true)
              }}
              onClose={() => setShowContextEditor(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <NodePalette onAddNode={handleAddNode} />
        </div>

        {/* Center - React Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            fitView
            className="bg-gray-50"
            nodeTypes={nodeTypes}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Property Inspector */}
        {showInspector && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <PropertyInspector
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              onUpdateNode={handleUpdateNode}
              onUpdateEdge={handleUpdateEdge}
              onClose={() => setShowInspector(false)}
            />
          </div>
        )}
      </div>

      {/* Bottom Panel - Validation */}
      <div className="flex-shrink-0">
        <ValidationPanel
          flowId={flowId}
          flowStatus={currentStatus}
          nodes={nodes}
          edges={edges}
          onStatusChange={setCurrentStatus}
        />
      </div>
    </div>
  )
}
