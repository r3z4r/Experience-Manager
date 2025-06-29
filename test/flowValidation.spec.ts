import { describe, it, expect } from 'vitest'
import { validateFlow } from '../lib/flowValidation'

interface Node {
  id: string
  type: string
  data: any
  position: { x: number; y: number }
}

describe('flowValidation.validateFlow', () => {
  const startNode: Node = {
    id: 'start',
    type: 'start',
    data: { label: 'Start' },
    position: { x: 0, y: 0 },
  }

  const pageNode: Node = {
    id: 'page1',
    type: 'page',
    data: { label: 'Page', pageId: 'abc123' },
    position: { x: 100, y: 0 },
  }

  const endNode: Node = {
    id: 'end',
    type: 'end',
    data: { label: 'End' },
    position: { x: 200, y: 0 },
  }

  it('returns valid for a proper linear flow', () => {
    const nodes = [startNode, pageNode, endNode]
    const edges = [
      { id: 'e1', source: 'start', target: 'page1' },
      { id: 'e2', source: 'page1', target: 'end' },
    ]

    const result = validateFlow(nodes as any, edges as any)
    expect(result.isValid).toBe(true)
    expect(result.errors.length).toBe(0)
  })

  it('detects missing start node', () => {
    const nodes = [pageNode]
    const edges: any[] = []
    const result = validateFlow(nodes as any, edges as any)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.id === 'no-start')).toBe(true)
  })

  it('detects multiple start nodes', () => {
    const extraStart: Node = { ...startNode, id: 'start2' }
    const nodes = [startNode, extraStart, pageNode]
    const edges: any[] = []
    const result = validateFlow(nodes as any, edges as any)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.id === 'multiple-starts')).toBe(true)
  })
})
