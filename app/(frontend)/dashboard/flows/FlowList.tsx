import Link from 'next/link'
import { FlowSummary } from '@/app/(frontend)/_actions/flows'
import { Plus, FileBarChart2 } from 'lucide-react'

interface Props {
  flows: FlowSummary[]
  createFlow: () => Promise<string | null>
}

export default function FlowList({ flows, createFlow }: Props) {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FileBarChart2 className="w-6 h-6 text-blue-600" /> Flows
        </h1>
        <form action={createFlow}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Create Flow
          </button>
        </form>
      </div>

      {flows.length === 0 ? (
        <p className="text-gray-500">No flows yet. Click “Create Flow” to start.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flows.map((f) => (
            <li key={f.id} className="border rounded p-4 bg-white flex flex-col gap-2">
              <div className="font-medium text-lg">{f.title}</div>
              <div className="text-sm text-gray-500">Status: {f.status}</div>
              <Link
                href={`/flows/builder/${f.id}`}
                className="self-start text-blue-600 hover:underline text-sm"
              >
                Open Builder →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
