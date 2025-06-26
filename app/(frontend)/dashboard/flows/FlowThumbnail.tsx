'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { ReactFlow, Node, Edge, Background } from 'reactflow'
import 'reactflow/dist/style.css'
import { getFlowAction } from '@/app/(frontend)/_actions/flows'

interface FlowThumbnailProps {
  flowId: string
  className?: string
}

export default function FlowThumbnail({ flowId, className = '' }: FlowThumbnailProps) {
  const [graph, setGraph] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const flowData = await getFlowAction(flowId)
        if (flowData?.graph) {
          setGraph(flowData.graph)
        }
      } catch (error) {
        console.error(`Failed to load graph for flow ${flowId}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGraph()
  }, [flowId])

  // Prepare nodes and edges for thumbnail view
  const { nodes, edges } = useMemo(() => {
    const thumbnailNodes = graph.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        label: node.data?.label || node.type || 'Node',
      },
      style: {
        ...node.style,
        fontSize: '10px',
        padding: '4px 8px',
        minWidth: '60px',
        minHeight: '30px',
      },
    }))

    return {
      nodes: thumbnailNodes,
      edges: graph.edges,
    }
  }, [graph])

  // If no nodes, show empty state
  if (isLoading) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-xs text-gray-500">Loading...</span>
      </div>
    )
  }

  if (!nodes || nodes.length === 0) {
    return (
      <div
        className={`h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-xs text-gray-500">Empty Flow</span>
      </div>
    )
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden h-full w-full ${className}`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        style={{ height: '100%', width: '100%' }}
        fitViewOptions={{
          padding: 0.1,
          minZoom: 0.1,
          maxZoom: 1,
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        panOnDrag={false}
        preventScrolling={false}
        attributionPosition="bottom-left"
      >
        <Background gap={20} size={1} color="#e5e7eb" />
      </ReactFlow>
    </div>
  )
}
