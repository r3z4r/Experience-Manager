// Dynamic runtime page for Flow execution
// Route: /flow/[flowId]/[nodeId]

import { notFound } from 'next/navigation'
import { FlowProvider } from '@/app/(frontend)/_flow/FlowProvider'
import { loadFlow, FlowGraph } from '@/lib/flowRunner'
import RenderFlowPage from './render'
import { getApiUrl } from '@/app/(frontend)/_config/runtime'

interface PageParams {
  params: {
    flowId: string
    nodeId: string
  }
}

export default async function FlowRuntimePage({ params }: PageParams) {
  const { flowId, nodeId } = params

  // --- 1. Fetch Flow from Payload -------------------------
  const flowRes = await fetch(`${await getApiUrl()}/flows/${flowId}`)
  if (!flowRes.ok) notFound()
  const flowData: { graph: FlowGraph } = await flowRes.json()

  const graph = flowData.graph
  const runner = loadFlow(graph)
  const node = runner.getNode(nodeId)
  if (!node) notFound()

  // Expect node.data to include either pageId or pagePath
  const { pageId, pagePath, api } = (node as any).data || {}
  if (!pageId && !pagePath) {
    console.error('Flow node missing page reference')
    notFound()
  }

  // --- 2. Fetch Page HTML ---------------------------------
  let html = ''
  if (pageId) {
    const pageRes = await fetch(`${await getApiUrl()}/pages/${pageId}`)
    if (!pageRes.ok) notFound()
    const pageJson = await pageRes.json()
    html = pageJson.html || ''
  } else if (pagePath) {
    try {
      const res = await fetch(pagePath)
      html = await res.text()
    } catch {
      notFound()
    }
  }

  // --- 3. Render -----------------------------------------
  return (
    <FlowProvider flowId={flowId}>
      {/* Client component handles submit wiring */}
      <RenderFlowPage html={html} graph={graph} nodeId={nodeId} api={api} />
    </FlowProvider>
  )
}

export const dynamic = 'force-dynamic'
