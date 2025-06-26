// Dynamic runtime page for Flow execution
// Route: /flow/[flowId]/[nodeId]

import { notFound } from 'next/navigation'
import { getFlowAction } from '@/app/(frontend)/_actions/flows'
import { FlowProvider } from '@/app/(frontend)/_flow/FlowProvider'
import { FlowRunner, type FlowNode } from '@/lib/flowRunner'
import RenderFlowPage from './render'

interface Props {
  params: Promise<{
    flowId: string
    nodeId: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function FlowRuntimePage({ params, searchParams }: Props) {
  const { flowId, nodeId } = await params
  const search = await searchParams
  const isPreview = search.preview === 'true'

  // Fetch flow data
  const flow = await getFlowAction(flowId)
  if (!flow) {
    notFound()
  }

  // In preview mode, allow access to draft flows
  // In normal mode, only allow published flows
  if (!isPreview && flow.status !== 'approved') {
    notFound()
  }

  // Initialize flow runner with flow context
  const flowRunner = new FlowRunner(flow.graph, flow.context || {})
  
  // Get the current node
  const currentNode = flowRunner.navigateToNode(nodeId)
  if (!currentNode.success) {
    notFound()
  }

  const node = flow.graph.nodes.find((n: FlowNode) => n.id === nodeId)
  if (!node) {
    notFound()
  }

  // Handle different node types
  if (node.type === 'condition') {
    // Condition nodes are processed automatically, redirect to next node
    const result = flowRunner.executeCurrentNode()
    if (result.shouldNavigate && result.navigationUrl) {
      // This would need to be handled with a redirect
      // For now, we'll render an error message
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Processing Flow...</h1>
            <p className="text-gray-600">Redirecting to next step...</p>
          </div>
        </div>
      )
    }
  }

  if (node.type === 'end') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Flow Complete</h1>
          <p className="text-gray-600">You have reached the end of this flow.</p>
          {isPreview && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                🔍 Preview Mode: This flow is being tested and may not be published yet.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // For page nodes, fetch and render the page content
  if (node.type === 'page') {
    const pageId = node.data.pageId
    if (!pageId) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2 text-red-600">Configuration Error</h1>
            <p className="text-gray-600">This flow step is not properly configured.</p>
          </div>
        </div>
      )
    }

    // Fetch page content from Payload
    // For now, we'll render a placeholder
    const pageHtml = `
      <div class="max-w-2xl mx-auto p-6">
        ${isPreview ? `
          <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-700">
              🔍 Preview Mode: This flow is being tested and may not be published yet.
            </p>
          </div>
        ` : ''}
        <h1 class="text-2xl font-bold mb-4">Flow Step: ${node.data.label}</h1>
        <p class="text-gray-600 mb-6">Page ID: ${pageId}</p>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sample Input</label>
            <input 
              type="text" 
              name="sampleInput" 
              data-flow-key="sampleInput"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter some data..."
            />
          </div>
          <button 
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>
      </div>
    `

    return (
      <FlowProvider flowId={flowId} initialContext={{}}>
        <RenderFlowPage 
          html={pageHtml} 
          nodeId={nodeId} 
          flowRunner={flowRunner} 
        />
      </FlowProvider>
    )
  }

  // Default fallback
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Unknown Node Type</h1>
        <p className="text-gray-600">This flow step type is not supported.</p>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
