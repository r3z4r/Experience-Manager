import Editor from '@/app/(frontend)/_components/Xmanager/Editor'

const EditorPage = async ({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return <Editor templateId={params.id} mode={(searchParams.mode as 'edit' | 'view') ?? 'edit'} />
}

export default EditorPage
