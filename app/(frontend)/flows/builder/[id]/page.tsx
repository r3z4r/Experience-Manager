// MVP Flow Builder page – renders React Flow canvas loaded with existing graph.
// At this stage it provides read-only visualization. Editing, palettes and inspector
// will be added incrementally.

import { notFound } from 'next/navigation'
import { getFlowAction, saveFlowAction } from '@/app/(frontend)/_actions/flows'
import FlowBuilderClient from './FlowBuilderClient'

interface PageProps {
  params: {
    id: string // flow document ID (or slug)
  }
}

export default async function FlowBuilderPage({ params }: PageProps) {
  const { id } = params
  
  const flowData = await getFlowAction(id)
  if (!flowData) notFound()

  async function saveFlow(flowId: string, graph: any) {
    'use server'
    return await saveFlowAction(flowId, graph)
  }

  return (
    <FlowBuilderClient
      initialGraph={flowData.graph}
      flowTitle={flowData.title}
      flowId={id}
      saveFlow={saveFlow}
    />
  )
}
