import type { Node, Edge } from 'reactflow'

export interface ValidationError {
  id: string
  type: 'error' | 'warning'
  message: string
  nodeId?: string
  edgeId?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

/**
 * Validates a flow graph for publishing
 */
export function validateFlow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Check if flow has at least one node
  if (nodes.length === 0) {
    errors.push({
      id: 'no-nodes',
      type: 'error',
      message: 'Flow must contain at least one node',
    })
  }

  // Check for start node
  const startNodes = nodes.filter(node => node.type === 'start' || node.data?.isStart)
  if (startNodes.length === 0) {
    errors.push({
      id: 'no-start',
      type: 'error',
      message: 'Flow must have a start node',
    })
  } else if (startNodes.length > 1) {
    errors.push({
      id: 'multiple-starts',
      type: 'error',
      message: 'Flow can only have one start node',
    })
  }

  // Check for end nodes
  const endNodes = nodes.filter(node => node.type === 'end' || node.data?.isEnd)
  if (endNodes.length === 0) {
    warnings.push({
      id: 'no-end',
      type: 'warning',
      message: 'Flow should have at least one end node',
    })
  }

  // Validate individual nodes
  nodes.forEach(node => {
    // Check for required node properties
    if (!node.data?.label && !node.data?.title) {
      warnings.push({
        id: `node-${node.id}-no-label`,
        type: 'warning',
        message: `Node "${node.id}" has no label or title`,
        nodeId: node.id,
      })
    }

    // Validate page nodes
    if (node.type === 'page') {
      if (!node.data?.pageId) {
        errors.push({
          id: `node-${node.id}-no-page`,
          type: 'error',
          message: `Page node "${node.id}" must have a page selected`,
          nodeId: node.id,
        })
      }
    }

    // Validate condition nodes
    if (node.type === 'condition') {
      if (!node.data?.condition || !node.data.condition.field) {
        errors.push({
          id: `node-${node.id}-no-condition`,
          type: 'error',
          message: `Condition node "${node.id}" must have a condition defined`,
          nodeId: node.id,
        })
      }
    }

    // Validate API nodes
    if (node.type === 'api') {
      if (!node.data?.url) {
        errors.push({
          id: `node-${node.id}-no-url`,
          type: 'error',
          message: `API node "${node.id}" must have a URL defined`,
          nodeId: node.id,
        })
      }
      if (!node.data?.method) {
        errors.push({
          id: `node-${node.id}-no-method`,
          type: 'error',
          message: `API node "${node.id}" must have an HTTP method defined`,
          nodeId: node.id,
        })
      }
    }
  })

  // Validate edges and connectivity
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source)
    const targetNode = nodes.find(n => n.id === edge.target)

    if (!sourceNode) {
      errors.push({
        id: `edge-${edge.id}-invalid-source`,
        type: 'error',
        message: `Edge "${edge.id}" has invalid source node`,
        edgeId: edge.id,
      })
    }

    if (!targetNode) {
      errors.push({
        id: `edge-${edge.id}-invalid-target`,
        type: 'error',
        message: `Edge "${edge.id}" has invalid target node`,
        edgeId: edge.id,
      })
    }

    // Validate condition edges have proper labels
    if (sourceNode?.type === 'condition' && !edge.data?.label) {
      warnings.push({
        id: `edge-${edge.id}-no-label`,
        type: 'warning',
        message: `Condition edge "${edge.id}" should have a label (true/false)`,
        edgeId: edge.id,
      })
    }
  })

  // Check for orphaned nodes (nodes with no connections)
  if (nodes.length > 1) {
    nodes.forEach(node => {
      const hasIncoming = edges.some(edge => edge.target === node.id)
      const hasOutgoing = edges.some(edge => edge.source === node.id)
      
      if (!hasIncoming && !hasOutgoing && node.type !== 'start') {
        warnings.push({
          id: `node-${node.id}-orphaned`,
          type: 'warning',
          message: `Node "${node.id}" is not connected to the flow`,
          nodeId: node.id,
        })
      }
    })
  }

  // Check for unreachable nodes
  if (startNodes.length === 1) {
    const reachableNodes = findReachableNodes(startNodes[0], nodes, edges)
    nodes.forEach(node => {
      if (!reachableNodes.has(node.id) && node.id !== startNodes[0].id) {
        warnings.push({
          id: `node-${node.id}-unreachable`,
          type: 'warning',
          message: `Node "${node.id}" is not reachable from the start node`,
          nodeId: node.id,
        })
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Find all nodes reachable from a starting node
 */
function findReachableNodes(startNode: Node, nodes: Node[], edges: Edge[]): Set<string> {
  const reachable = new Set<string>()
  const queue = [startNode.id]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (reachable.has(currentId)) continue

    reachable.add(currentId)

    // Find all outgoing edges from current node
    const outgoingEdges = edges.filter(edge => edge.source === currentId)
    outgoingEdges.forEach(edge => {
      if (!reachable.has(edge.target)) {
        queue.push(edge.target)
      }
    })
  }

  return reachable
}

/**
 * Get validation summary text
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return 'Flow is valid and ready to publish'
  }
  
  if (result.isValid && result.warnings.length > 0) {
    return `Flow is valid but has ${result.warnings.length} warning${result.warnings.length > 1 ? 's' : ''}`
  }
  
  return `Flow has ${result.errors.length} error${result.errors.length > 1 ? 's' : ''} that must be fixed before publishing`
}
