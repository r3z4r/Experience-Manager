"use client"

// MVP Flow Builder page – renders React Flow canvas loaded with existing graph.
// At this stage it provides read-only visualization. Editing, palettes and inspector
// will be added incrementally.

import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import type { FlowGraph } from '@/lib/flowRunner'

// React Flow must be dynamically imported to avoid SSR issues in Next.js 15
// because it relies on the DOM.
const ReactFlow = dynamic(() => import('reactflow').then((m) => m.ReactFlow), {
  ssr: false,
})

// React Flow global styles
import 'reactflow/dist/style.css'

interface PageProps {
  params: {
    id: string // flow document ID (or slug)
  }
}

export default function FlowBuilderPage({ params }: PageProps) {
  const { id } = params
  const [graph, setGraph] = useState<FlowGraph | null>(null)
  const [loading, setLoading] = useState(true)

  // TODO: replace with authenticated fetch to Payload REST API
  useEffect(() => {
    async function fetchGraph() {
      try {
        const res = await fetch(`/api/flows/${id}`)
        if (!res.ok) throw new Error('Failed to load flow')
        const json = await res.json()
        setGraph(json.graph as FlowGraph)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGraph()
  }, [id])

  if (loading) return <p className="p-4">Loading flow…</p>
  if (!graph) return <p className="p-4 text-red-600">Flow not found</p>

  return (
    <div className="h-screen w-full">
      <ReactFlow nodes={graph.nodes} edges={graph.edges} fitView />
    </div>
  )
}
