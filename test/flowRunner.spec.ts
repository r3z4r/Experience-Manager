import { describe, it, expect } from 'vitest'

import { FlowRunner, FlowGraph } from '../lib/flowRunner'

const buildGraph = (): FlowGraph => ({
  nodes: [
    {
      id: 'start',
      type: 'start',
      position: { x: 0, y: 0 },
      data: { label: 'Start' },
    },
    {
      id: 'cond',
      type: 'condition',
      position: { x: 100, y: 0 },
      data: {
        label: 'Condition',
        branches: [
          {
            label: 'GT10',
            condition: 'context.value > 10',
          },
        ],
        defaultBranchLabel: 'Default',
      },
    },
    {
      id: 'gtNode',
      type: 'end',
      position: { x: 200, y: -50 },
      data: { label: 'Greater Than 10' },
    },
    {
      id: 'defaultNode',
      type: 'end',
      position: { x: 200, y: 50 },
      data: { label: 'Default' },
    },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'cond' },
    { id: 'e2', source: 'cond', target: 'gtNode', data: { label: 'GT10' } },
    { id: 'e3', source: 'cond', target: 'defaultNode', data: { label: 'Default' } },
  ],
})

describe('FlowRunner dynamic branching', () => {
  it('navigates to matching branch when condition is true', async () => {
    const graph = buildGraph()
    const runner = new FlowRunner(graph, { context: { value: 15 } })
    const startResult = await runner.start()
    expect(startResult.success).toBe(true)
    expect(runner.getCurrentNodeId()).toBe('gtNode')
  })

  it('falls back to default branch when no conditions match', async () => {
    const graph = buildGraph()
    const runner = new FlowRunner(graph, { context: { value: 5 } })
    const startResult = await runner.start()
    expect(startResult.success).toBe(true)
    expect(runner.getCurrentNodeId()).toBe('defaultNode')
  })
})
