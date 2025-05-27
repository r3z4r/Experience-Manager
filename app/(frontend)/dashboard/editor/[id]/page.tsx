import Editor from '@/app/(frontend)/_components/Xmanager/Editor'

const EditorPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mode?: 'edit' | 'view' }>
}) => {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return <Editor templateId={resolvedParams.id} mode={resolvedSearchParams.mode ?? 'edit'} />
}

export default EditorPage
