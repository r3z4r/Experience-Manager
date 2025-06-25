"use client"

import React from 'react'
import { FlowRunner } from '@/lib/flowRunner'
import { useFlowForm } from '@/app/(frontend)/_flow/useFlowForm'

interface FlowFormProps {
  flowRunner: FlowRunner
  nodeId: string
  className?: string
  children: React.ReactNode
}

/**
 * Drop-in replacement for a regular <form>. It wires the form into the Flow system
 * (context capture, optional API call, automatic navigation) using `useFlowForm`.
 *
 * Example:
 * <FlowForm flowRunner={flowRunner} nodeId="node-1"> ...inputs... </FlowForm>
 */
export function FlowForm({ flowRunner, nodeId, className, children }: FlowFormProps) {
  const handleSubmit = useFlowForm({ flowRunner, currentNodeId: nodeId })
  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {children}
    </form>
  )
}
