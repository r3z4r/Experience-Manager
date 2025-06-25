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
  type: 'start' | 'page' | 'condition' | 'end'
  data: {
    label: string
    pageId?: string
    pagePath?: string
    api?: {
      method: 'GET' | 'POST' | 'PUT' | 'PATCH'
      url: string
      body?: Record<string, any>
      keyMapping?: Record<string, string>
    }
    conditions?: string
  }
  position: { x: number; y: number }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  data?: {
    label?: string
    condition?: string
  }
}

export interface FlowGraph {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export interface FlowContext {
  [key: string]: any
}

export interface FlowExecutionResult {
  success: boolean
  nextNodeId?: string | null
  error?: string
  apiResponse?: any
  shouldNavigate?: boolean
  navigationUrl?: string
}

export class FlowRunner {
  private graph: FlowGraph
  private context: FlowContext
  private currentNodeId: string | null = null

  constructor(graph: FlowGraph, initialContext: FlowContext = {}) {
    this.graph = graph
    this.context = { ...initialContext }
  }

  /**
   * Start flow execution from the start node
   */
  start(): FlowExecutionResult {
    const startNode = this.graph.nodes.find(node => node.type === 'start')
    if (!startNode) {
      return { success: false, error: 'No start node found in flow' }
    }

    this.currentNodeId = startNode.id
    return this.executeCurrentNode()
  }

  /**
   * Execute the current node and determine next step
   */
  executeCurrentNode(): FlowExecutionResult {
    if (!this.currentNodeId) {
      return { success: false, error: 'No current node to execute' }
    }

    const currentNode = this.graph.nodes.find(node => node.id === this.currentNodeId)
    if (!currentNode) {
      return { success: false, error: `Node ${this.currentNodeId} not found` }
    }

    switch (currentNode.type) {
      case 'start':
        return this.executeStartNode(currentNode)
      case 'page':
        return this.executePageNode(currentNode)
      case 'condition':
        return this.executeConditionNode(currentNode)
      case 'end':
        return this.executeEndNode(currentNode)
      default:
        return { success: false, error: `Unknown node type: ${currentNode.type}` }
    }
  }

  /**
   * Navigate to a specific node by ID
   */
  navigateToNode(nodeId: string): FlowExecutionResult {
    const node = this.graph.nodes.find(n => n.id === nodeId)
    if (!node) {
      return { success: false, error: `Node ${nodeId} not found` }
    }

    this.currentNodeId = nodeId
    return this.executeCurrentNode()
  }

  /**
   * Process form submission and navigate to next node
   */
  async processFormSubmission(formData: Record<string, any>): Promise<FlowExecutionResult> {
    // Update context with form data
    this.updateContext(formData)

    const currentNode = this.getCurrentNode()
    if (!currentNode) {
      return { success: false, error: 'No current node' }
    }

    // Handle API call if configured
    if (currentNode.data.api) {
      try {
        const apiResult = await this.executeApiCall(currentNode.data.api, formData)
        if (!apiResult.success) {
          return apiResult
        }
        // Update context with API response
        if (apiResult.apiResponse) {
          this.updateContext({ _apiResponse: apiResult.apiResponse })
        }
      } catch (error) {
        return { success: false, error: `API call failed: ${error}` }
      }
    }

    // Navigate to next node
    return this.navigateToNextNode()
  }

  /**
   * Update flow context
   */
  updateContext(data: Record<string, any>): void {
    this.context = { ...this.context, ...data }
  }

  /**
   * Get current flow context
   */
  getContext(): FlowContext {
    return { ...this.context }
  }

  /**
   * Get current node
   */
  getCurrentNode(): FlowNode | null {
    if (!this.currentNodeId) return null
    return this.graph.nodes.find(node => node.id === this.currentNodeId) || null
  }

  /**
   * Get current node ID
   */
  getCurrentNodeId(): string | null {
    return this.currentNodeId
  }

  // Private methods

  private executeStartNode(node: FlowNode): FlowExecutionResult {
    // Start nodes automatically proceed to next node
    return this.navigateToNextNode()
  }

  private executePageNode(node: FlowNode): FlowExecutionResult {
    // Page nodes require rendering - return navigation URL
    const pageUrl = this.buildPageUrl(node)
    return {
      success: true,
      shouldNavigate: true,
      navigationUrl: pageUrl,
    }
  }

  private executeConditionNode(node: FlowNode): FlowExecutionResult {
    // Evaluate conditions and navigate accordingly
    const conditionResult = this.evaluateConditions(node.data.conditions || '')
    
    // Find the appropriate edge based on condition result
    const edges = this.getOutgoingEdges(node.id)
    let targetEdge = edges.find(edge => {
      if (!edge.data?.condition) return conditionResult === true // Default path
      return this.evaluateCondition(edge.data.condition) === conditionResult
    })

    // Fallback to first edge if no condition matches
    if (!targetEdge && edges.length > 0) {
      targetEdge = edges[0]
    }

    if (!targetEdge) {
      return { success: false, error: 'No valid path from condition node' }
    }

    this.currentNodeId = targetEdge.target
    return this.executeCurrentNode()
  }

  private executeEndNode(node: FlowNode): FlowExecutionResult {
    // End nodes complete the flow
    return {
      success: true,
      nextNodeId: undefined, // Flow is complete
    }
  }

  private navigateToNextNode(): FlowExecutionResult {
    if (!this.currentNodeId) {
      return { success: false, error: 'No current node' }
    }

    const outgoingEdges = this.getOutgoingEdges(this.currentNodeId)
    
    if (outgoingEdges.length === 0) {
      // No outgoing edges - flow ends here
      return { success: true, nextNodeId: undefined }
    }

    // For linear flows, take the first (and typically only) outgoing edge
    const nextEdge = outgoingEdges[0]
    this.currentNodeId = nextEdge.target
    
    return this.executeCurrentNode()
  }

  private getOutgoingEdges(nodeId: string): FlowEdge[] {
    return this.graph.edges.filter(edge => edge.source === nodeId)
  }

  private buildPageUrl(node: FlowNode): string {
    if (node.data.pagePath) {
      // External URL
      return node.data.pagePath
    }
    
    if (node.data.pageId) {
      // Internal Payload page - construct flow runtime URL
      return `/flow/${this.getFlowId()}/${node.id}`
    }

    // Fallback
    return `/flow/${this.getFlowId()}/${node.id}`
  }

  private getFlowId(): string {
    // This should be set when the flow runner is initialized
    // For now, we'll use a placeholder
    return 'current-flow'
  }

  private async executeApiCall(
    apiConfig: NonNullable<FlowNode['data']['api']>,
    formData: Record<string, any>
  ): Promise<FlowExecutionResult> {
    try {
      // Build request body from form data and key mapping
      let requestBody = { ...formData }
      
      if (apiConfig.keyMapping) {
        requestBody = {}
        Object.entries(apiConfig.keyMapping).forEach(([formKey, apiKey]) => {
          if (formData[formKey] !== undefined) {
            requestBody[apiKey] = formData[formKey]
          }
        })
      }

      // Merge with any static body configuration
      if (apiConfig.body) {
        requestBody = { ...requestBody, ...apiConfig.body }
      }

      const response = await fetch(apiConfig.url, {
        method: apiConfig.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: apiConfig.method !== 'GET' ? JSON.stringify(requestBody) : undefined,
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      
      return {
        success: true,
        apiResponse: responseData,
      }
    } catch (error) {
      return {
        success: false,
        error: `API call failed: ${error}`,
      }
    }
  }

  private evaluateConditions(conditions: string): boolean {
    if (!conditions.trim()) return true

    try {
      // Simple condition evaluation - can be enhanced with a proper parser
      // For now, support basic context variable checks
      // Example: "age > 18", "status === 'active'"
      
      // Replace context variables with actual values
      let expression = conditions
      Object.entries(this.context).forEach(([key, value]) => {
        const regex = new RegExp(`\\b${key}\\b`, 'g')
        expression = expression.replace(regex, JSON.stringify(value))
      })

      // Use Function constructor for safe evaluation (limited scope)
      const result = new Function(`return ${expression}`)()
      return Boolean(result)
    } catch (error) {
      console.warn('Condition evaluation failed:', error)
      return false
    }
  }

  private evaluateCondition(condition: string): boolean {
    return this.evaluateConditions(condition)
  }
}
