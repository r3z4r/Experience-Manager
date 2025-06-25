import { redirect } from 'next/navigation'
import { fetchFlowsAction, createFlowAction } from '@/app/(frontend)/_actions/flows'
import FlowList from './FlowList'

export default async function FlowsPage() {
  const flows = await fetchFlowsAction()

  async function handleCreateFlow() {
    'use server'
    const newFlowId = await createFlowAction()
    if (newFlowId) {
      redirect(`/dashboard/flows/builder/${newFlowId}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <FlowList flows={flows} />
    </div>
  )
}
