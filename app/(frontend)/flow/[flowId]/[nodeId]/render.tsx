'use client'

import React, { useEffect, useRef } from 'react'
import { FlowGraph } from '@/lib/flowRunner'
import { useFlowForm } from '@/app/(frontend)/_flow/useFlowForm'

interface RenderFlowPageProps {
  html: string
  graph: FlowGraph
  nodeId: string
  api?: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH'
    url: string
    bodyTemplate?: string
    responseMapping?: Record<string, string>
  }
}

export default function RenderFlowPage({ html, graph, nodeId, api }: RenderFlowPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const handleSubmit = useFlowForm({ graph, currentNodeId: nodeId, api })

  // Attach the submit handler to any form inside the rendered HTML
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const forms = Array.from(container.querySelectorAll('form')) as HTMLFormElement[]
    forms.forEach((f) => f.addEventListener('submit', handleSubmit as EventListener, { once: false }))

    return () => {
      forms.forEach((f) => f.removeEventListener('submit', handleSubmit as EventListener))
    }
  }, [handleSubmit])

  // Render raw HTML
  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
}
