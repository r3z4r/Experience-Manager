// MVP Flow Builder page – renders React Flow canvas loaded with existing graph.
// At this stage it provides read-only visualization. Editing, palettes and inspector
// will be added incrementally.

import { notFound } from 'next/navigation'
import { getFlowAction, saveFlowAction } from '@/app/(frontend)/_actions/flows'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import FlowBuilderClient from './FlowBuilderClient'

interface PageProps {
  params: Promise<{
    id: string // flow document ID (or slug)
  }>
}

export default async function FlowBuilderPage({ params }: PageProps) {
  const { id } = await params
  
  const flowData = await getFlowAction(id)
  if (!flowData) notFound()

  // Get flow status from Payload
  let flowStatus: 'draft' | 'approved' | 'archived' = 'draft'
  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await (payload as any).findByID({
      collection: 'flows',
      id,
    })
    flowStatus = doc?.status || 'draft'
  } catch (error) {
    console.error('Failed to fetch flow status:', error)
  }

  async function saveFlow(flowId: string, graph: any, context?: Record<string, any>) {
    'use server'
    return await saveFlowAction(flowId, graph, context)
  }

  return (
    <FlowBuilderClient
      initialGraph={flowData.graph}
      initialContext={flowData.context}
      flowTitle={flowData.title}
      flowId={id}
      flowStatus={flowStatus}
      saveFlow={saveFlow}
    />
  )
}
