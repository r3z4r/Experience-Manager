"use client"

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useFlow } from './FlowProvider'
import { FlowRunner } from '@/lib/flowRunner'

interface UseFlowFormOptions {
  /** The FlowRunner instance for this journey */
  flowRunner: FlowRunner
  /** The id of the current node corresponding to this page */
  currentNodeId: string
}

/**
 * Helper hook to wire a page form into the Flow system.
 *
 * Usage:
 *   const handleSubmit = useFlowForm({ flowRunner, currentNodeId })
 *   <form onSubmit={handleSubmit}>...</form>
 */
export function useFlowForm({ flowRunner, currentNodeId }: UseFlowFormOptions) {
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
    
    // Update both local context and flow runner context
    updateCtx(patch)
    flowRunner.updateContext(patch)

    // 2. Process form submission through FlowRunner
    try {
      const result = await flowRunner.processFormSubmission(formData)
      
      if (result.success && result.shouldNavigate && result.navigationUrl) {
        // Navigate to the next node
        router.push(result.navigationUrl)
      } else if (!result.success && result.error) {
        console.error('Flow execution error:', result.error)
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }, [flowRunner, updateCtx, router])
}
