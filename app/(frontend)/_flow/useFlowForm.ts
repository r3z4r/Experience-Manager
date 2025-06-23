"use client"

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useFlow } from './FlowProvider'
import { loadFlow, FlowGraph } from '@/lib/flowRunner'

interface UseFlowFormOptions {
  /** The FlowGraph for this journey (supplied via props or context) */
  graph: FlowGraph
  /** The id of the current node corresponding to this page */
  currentNodeId: string
  /** Optional API settings coming from node.data.api (already resolved) */
  api?: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH'
    url: string
    bodyTemplate?: string
    responseMapping?: Record<string, string>
  }
}

/**
 * Helper hook to wire a page form into the Flow system.
 *
 * Usage:
 *   const handleSubmit = useFlowForm({ graph, currentNodeId, api })
 *   <form onSubmit={handleSubmit}>...</form>
 */
export function useFlowForm({ graph, currentNodeId, api }: UseFlowFormOptions) {
  const { ctx, updateCtx } = useFlow()
  const router = useRouter()

  return useCallback<React.FormEventHandler<HTMLFormElement>>(async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // 1. collect inputs with data-flow-key
    const patch: Record<string, unknown> = {}
    form.querySelectorAll<HTMLElement>('[data-flow-key]').forEach((el) => {
      const key = el.getAttribute('data-flow-key')!
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        patch[key] = el.value
      }
    })
    updateCtx(patch)

    let apiResult: unknown = null
    // 2. optional API call
    if (api) {
      const body = api.bodyTemplate
        ? interpolate(api.bodyTemplate, { ...ctx, ...patch })
        : undefined
      try {
        const res = await fetch(api.url, {
          method: api.method,
          headers: body ? { 'Content-Type': 'application/json' } : undefined,
          body,
        })
        apiResult = await res.json()

        // map keys into context
        if (api.responseMapping) {
          const mapped: Record<string, unknown> = {}
          for (const [ctxKey, path] of Object.entries(api.responseMapping)) {
            mapped[ctxKey] = getByPath(apiResult, path)
          }
          updateCtx(mapped)
        }
      } catch (err) {
        console.error('Flow API call failed', err)
      }
    }

    // 3. determine next node and navigate
    const runner = loadFlow(graph)
    const nextId = runner.getNext(currentNodeId, { ...ctx, ...patch })
    if (!nextId) return // end of flow
    const nextNode = runner.getNode(nextId)
    if (nextNode) router.push(nextNode.data.pagePath)
  }, [api, ctx, currentNodeId, graph, router, updateCtx])
}

function interpolate(template: string, ctx: Record<string, unknown>): string {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => String(getByPath(ctx, key)))
}

function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj)
}
