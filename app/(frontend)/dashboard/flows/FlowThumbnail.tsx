"use client"

import React, { useMemo } from 'react'
import { ReactFlow, Node, Edge, Background } from 'reactflow'
import 'reactflow/dist/style.css'

interface FlowThumbnailProps {
  graph: {
    nodes: Node[]
    edges: Edge[]
  }
  className?: string
}

export default function FlowThumbnail({ graph, className = '' }: FlowThumbnailProps) {
  // Prepare nodes and edges for thumbnail view
  const { nodes, edges } = useMemo(() => {
    const thumbnailNodes = graph.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        label: node.data?.label || node.type || 'Node'
      },
      style: {
        ...node.style,
        fontSize: '10px',
        padding: '4px 8px',
        minWidth: '60px',
        minHeight: '30px'
      }
    }))

    return {
      nodes: thumbnailNodes,
      edges: graph.edges
    }
  }, [graph])

  // If no nodes, show empty state
  if (!nodes || nodes.length === 0) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-xs text-gray-500">Empty Flow</span>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{
          padding: 0.1,
          minZoom: 0.1,
          maxZoom: 1
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
        <Background 
          gap={20} 
          size={1} 
          color="#e5e7eb"
        />
      </ReactFlow>
    </div>
  )
}
