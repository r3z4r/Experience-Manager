'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Minimal fields we show in the dashboard
export interface FlowSummary {
  id: string
  title: string
  slug: string
  status: 'draft' | 'approved' | 'archived'
}

/**
 * Fetch all flows from Payload CMS ordered newest first.
 */
export async function fetchFlowsAction(): Promise<FlowSummary[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await (payload as any).find({
      collection: 'flows',
      sort: '-createdAt',
      limit: 100,
    })
    return result.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      status: doc.status,
    }))
  } catch (err) {
    console.error('fetchFlowsAction error', err)
    return []
  }
}

/**
 * Create a new flow with default data and return its ID.
 */
export async function createFlowAction(): Promise<string | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const timestamp = Date.now()
    const title = 'Untitled Flow'
    const slug = `flow-${timestamp}`
    const doc = await (payload as any).create({
      collection: 'flows',
      data: {
        title,
        slug,
        status: 'draft',
        graph: { nodes: [], edges: [] },
      },
    })
    return doc.id as string
  } catch (err) {
    console.error('createFlowAction error', err)
    return null
  }
}

/**
 * Get a single flow by ID for the builder.
 */
export async function getFlowAction(id: string): Promise<{ graph: any; title: string } | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await (payload as any).findByID({
      collection: 'flows',
      id,
    })
    return {
      graph: doc.graph || { nodes: [], edges: [] },
      title: doc.title || 'Untitled Flow',
    }
  } catch (err) {
    console.error('getFlowAction error', err)
    return null
  }
}

/**
 * Save flow graph changes back to Payload.
 */
export async function saveFlowAction(id: string, graph: any): Promise<boolean> {
  try {
    const payload = await getPayload({ config: configPromise })
    await (payload as any).update({
      collection: 'flows',
      id,
      data: { graph },
    })
    return true
  } catch (err) {
    console.error('saveFlowAction error', err)
    return false
  }
}
