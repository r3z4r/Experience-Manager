// Preview page for flows - finds start node and redirects to flow runtime
import { redirect, notFound } from 'next/navigation'
import { getFlowAction } from '@/app/(frontend)/_actions/flows'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function FlowPreviewPage({ params }: Props) {
  const { id } = await params

  // Fetch flow data
  const flow = await getFlowAction(id)
  if (!flow) {
    notFound()
  }

  // Find the start node
  const startNode = flow.graph.nodes.find((node: any) => node.type === 'start')
  if (!startNode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold mb-2 text-red-600">Flow Configuration Error</h1>
          <p className="text-gray-600">This flow doesn't have a start node. Please edit the flow and add a start node.</p>
        </div>
      </div>
    )
  }

  // Redirect to the flow runtime with preview mode
  redirect(`/flow/${id}/${startNode.id}?preview=true`)
}

export const dynamic = 'force-dynamic'
