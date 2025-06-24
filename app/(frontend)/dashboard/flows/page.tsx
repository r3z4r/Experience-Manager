import { redirect } from 'next/navigation'
import { fetchFlowsAction, createFlowAction } from '@/app/(frontend)/_actions/flows'
import FlowList from './FlowList'

export default async function FlowsDashboardPage() {
  const flows = await fetchFlowsAction()

  async function createFlow() {
    'use server'
    const id = await createFlowAction()
    if (id) {
      redirect(`/flows/builder/${id}`)
    }
  }

  return <FlowList flows={flows} createFlow={createFlow} />
}
