"use client"

import React from 'react'
import { FlowGraph } from '@/lib/flowRunner'
import { useFlowForm } from '@/app/(frontend)/_flow/useFlowForm'

interface FlowFormProps {
  graph: FlowGraph
  nodeId: string
  /** Optional API settings coming from node.data.api (already resolved) */
  api?: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH'
    url: string
    bodyTemplate?: string
    responseMapping?: Record<string, string>
  }
  className?: string
  children: React.ReactNode
}

/**
 * Drop-in replacement for a regular <form>. It wires the form into the Flow system
 * (context capture, optional API call, automatic navigation) using `useFlowForm`.
 *
 * Example:
 * <FlowForm graph={graph} nodeId="node-1"> ...inputs... </FlowForm>
 */
export function FlowForm({ graph, nodeId, api, className, children }: FlowFormProps) {
  const handleSubmit = useFlowForm({ graph, currentNodeId: nodeId, api })
  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {children}
    </form>
  )
}
