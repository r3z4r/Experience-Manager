// Dynamic runtime page for Flow execution
// Route: /flow/[flowId]/[nodeId]

import { notFound } from 'next/navigation'
import { getFlowAction } from '@/app/(frontend)/_actions/flows'
import { FlowProvider } from '@/app/(frontend)/_flow/FlowProvider'
import { FlowRunner, type FlowNode } from '@/lib/flowRunner'
import RenderFlowPage from './render'

interface Props {
  params: {
    flowId: string
    nodeId: string
  }
}

export default async function FlowRuntimePage({ params }: Props) {
  const { flowId, nodeId } = params

  // Fetch flow data
  const flow = await getFlowAction(flowId)
  if (!flow) {
    notFound()
  }

  // Initialize flow runner
  const flowRunner = new FlowRunner(flow.graph, {})
  
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
            <p className="text-gray-600">Condition node should redirect automatically.</p>
          </div>
        </div>
      )
    }
  }

  if (node.type === 'end') {
    // End node - show completion message
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Flow Complete</h1>
          <p className="text-gray-600">You have reached the end of this flow.</p>
        </div>
      </div>
    )
  }

  // For page nodes, fetch and render the page content
  let pageHtml = ''
  if (node.data.pageId) {
    // Fetch page from Payload CMS
    try {
      const { getPayload } = await import('payload')
      const payload = await getPayload({ config: (await import('@payload-config')).default })
      const page = await payload.findByID({
        collection: 'pages',
        id: node.data.pageId,
      })
      pageHtml = page.htmlContent || page.jsContent || ''
    } catch (error) {
      console.error('Failed to fetch page:', error)
      pageHtml = '<div>Error loading page content</div>'
    }
  } else if (node.data.pagePath) {
    // External page - this would need different handling
    pageHtml = `<div>External page: ${node.data.pagePath}</div>`
  } else {
    // Default content for nodes without page data
    pageHtml = `<div class="p-8"><h1>${node.data.label}</h1><p>This is a flow node without specific page content.</p></div>`
  }

  return (
    <FlowProvider flowId={flowId} initialContext={flowRunner.getContext()}>
      <RenderFlowPage 
        html={pageHtml} 
        nodeId={nodeId}
        flowRunner={flowRunner}
      />
    </FlowProvider>
  )
}

export const dynamic = 'force-dynamic'
