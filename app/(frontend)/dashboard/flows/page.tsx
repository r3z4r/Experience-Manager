import { redirect } from 'next/navigation'
import { createFlowAction } from '@/app/(frontend)/_actions/flows'
import FlowList from './FlowList'

export default async function FlowsPage() {
  async function handleCreateFlow() {
    'use server'
    const newFlowId = await createFlowAction({
      title: 'Untitled Flow',
      description: '',
      access: { visibility: 'private' },
    })
    if (newFlowId) {
      redirect(`/dashboard/flows/builder/${newFlowId}`)
    }
  }

  return <FlowList />
}
