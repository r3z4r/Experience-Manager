/*
 * Lightweight flow interpreter for React-Flow graphs (Option A).
 * Handles:
 *   • Loading graph JSON exported by React-Flow
 *   • Evaluating edge conditions against context
 *   • Returning next node ID for navigation
 *
 * The evaluator supports a simple rule object model produced by the rule-builder UI:
 *   { key: 'age', op: '>=', value: 18 }
 * or logical groups:
 *   { op: 'AND', rules: [ ... ] }
 *   { op: 'OR', rules: [ ... ] }
 *
 * This implementation intentionally keeps the API minimal for MVP. It can be
 * extended later with additional operators or async predicates.
 */

export type Primitive = string | number | boolean | null
export interface EdgeCondition {
  key?: string
  op: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'includes' | 'AND' | 'OR'
  value?: Primitive
  rules?: EdgeCondition[] // used when op is AND / OR
}

export interface FlowNode {
  id: string
  data: {
    pagePath: string // Next.js route of the page to render
    api?: {
      method: 'GET' | 'POST' | 'PUT' | 'PATCH'
      url: string
      bodyTemplate?: string // e.g. JSON with {{ctx.key}} placeholders
      responseMapping?: Record<string, string> // { ctxKey: 'response.path' }
    }
  }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  data?: {
    condition?: EdgeCondition
  }
}

export interface FlowGraph {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export function loadFlow(graph: FlowGraph) {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]))
  const outgoing = new Map<string, FlowEdge[]>(
    graph.nodes.map((n) => [n.id, []])
  )
  for (const e of graph.edges) {
    if (!outgoing.has(e.source)) outgoing.set(e.source, [])
    outgoing.get(e.source)!.push(e)
  }

  return {
    getNode(id: string) {
      return nodeMap.get(id)
    },

    /**
     * Determine the next node ID given current node and context.
     * Returns undefined if no outgoing edge satisfies its condition.
     */
    getNext(currentId: string, ctx: Record<string, unknown>): string | undefined {
      const edges = outgoing.get(currentId) || []
      for (const edge of edges) {
        const cond = edge.data?.condition
        if (!cond || evaluateCondition(cond, ctx)) return edge.target
      }
      return undefined
    },
  }
}

function evaluateCondition(cond: EdgeCondition, ctx: Record<string, unknown>): boolean {
  const { op } = cond
  if (op === 'AND' || op === 'OR') {
    const rules = cond.rules || []
    return op === 'AND'
      ? rules.every((r) => evaluateCondition(r, ctx))
      : rules.some((r) => evaluateCondition(r, ctx))
  }

  const left = ctx[cond.key as string]
  const right = cond.value
  switch (op) {
    case '==':
      return left === right
    case '!=':
      return left !== right
    case '>':
      return Number(left) > Number(right)
    case '>=':
      return Number(left) >= Number(right)
    case '<':
      return Number(left) < Number(right)
    case '<=':
      return Number(left) <= Number(right)
    case 'includes':
      return Array.isArray(left) && left.includes(right as never)
    default:
      return false
  }
}
