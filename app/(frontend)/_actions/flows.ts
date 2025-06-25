'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { validateFlow, type ValidationResult } from '@/lib/flowValidation'

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
export async function getFlowAction(id: string): Promise<{ graph: any; title: string; status: 'draft' | 'approved' | 'archived' } | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await (payload as any).findByID({
      collection: 'flows',
      id,
    })
    return {
      graph: doc.graph || { nodes: [], edges: [] },
      title: doc.title,
      status: doc.status || 'draft',
    }
  } catch (error) {
    console.error('Failed to fetch flow:', error)
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

/**
 * Validate a flow graph for publishing
 */
export async function validateFlowAction(id: string): Promise<ValidationResult | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await (payload as any).findByID({
      collection: 'flows',
      id,
    })
    
    if (!doc?.graph) {
      return {
        isValid: false,
        errors: [{ id: 'no-graph', type: 'error', message: 'Flow has no graph data' }],
        warnings: [],
      }
    }

    const { nodes = [], edges = [] } = doc.graph
    return validateFlow(nodes, edges)
  } catch (err) {
    console.error('validateFlowAction error', err)
    return null
  }
}

/**
 * Publish a flow (change status to approved)
 */
export async function publishFlowAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // First validate the flow
    const validation = await validateFlowAction(id)
    if (!validation) {
      return { success: false, message: 'Failed to validate flow' }
    }

    if (!validation.isValid) {
      return { 
        success: false, 
        message: `Cannot publish flow with ${validation.errors.length} error${validation.errors.length > 1 ? 's' : ''}` 
      }
    }

    // Update status to approved
    const payload = await getPayload({ config: configPromise })
    await (payload as any).update({
      collection: 'flows',
      id,
      data: { status: 'approved' },
    })

    return { success: true, message: 'Flow published successfully' }
  } catch (err) {
    console.error('publishFlowAction error', err)
    return { success: false, message: 'Failed to publish flow' }
  }
}

/**
 * Unpublish a flow (change status back to draft)
 */
export async function unpublishFlowAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const payload = await getPayload({ config: configPromise })
    await (payload as any).update({
      collection: 'flows',
      id,
      data: { status: 'draft' },
    })

    return { success: true, message: 'Flow unpublished successfully' }
  } catch (err) {
    console.error('unpublishFlowAction error', err)
    return { success: false, message: 'Failed to unpublish flow' }
  }
}

/**
 * Archive a flow (change status to archived)
 */
export async function archiveFlowAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const payload = await getPayload({ config: configPromise })
    await (payload as any).update({
      collection: 'flows',
      id,
      data: { status: 'archived' },
    })

    return { success: true, message: 'Flow archived successfully' }
  } catch (err) {
    console.error('archiveFlowAction error', err)
    return { success: false, message: 'Failed to archive flow' }
  }
}
