'use client'

import React, { useEffect, useRef } from 'react'
import { FlowRunner } from '@/lib/flowRunner'
import { useFlowForm } from '@/app/(frontend)/_flow/useFlowForm'

interface RenderFlowPageProps {
  html: string
  nodeId: string
  flowRunner: FlowRunner
}

export default function RenderFlowPage({ html, nodeId, flowRunner }: RenderFlowPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const handleSubmit = useFlowForm({ flowRunner, currentNodeId: nodeId })

  // Attach the submit handler to any form inside the rendered HTML
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const forms = Array.from(container.querySelectorAll('form')) as HTMLFormElement[]
    
    // Create a wrapper function to handle the event type conversion
    const eventWrapper = (event: Event) => {
      if (event.target instanceof HTMLFormElement) {
        // Convert Event to FormEvent for React handler using unknown
        handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>)
      }
    }
    
    forms.forEach((f) => f.addEventListener('submit', eventWrapper, { once: false }))

    return () => {
      forms.forEach((f) => f.removeEventListener('submit', eventWrapper))
    }
  }, [handleSubmit])

  // Render raw HTML
  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
}
