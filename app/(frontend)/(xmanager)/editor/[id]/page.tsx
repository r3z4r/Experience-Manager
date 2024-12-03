import Editor from '@/app/(frontend)/_components/Xmanager/Editor'

interface EditorPageProps {
  params: {
    id: string
  }
  searchParams: {
    mode?: 'edit' | 'view'
  }
}

const EditorPage = async ({ params, searchParams }: EditorPageProps) => {
  const templateId = params.id || 'defaultId';
  const mode = searchParams?.mode || 'edit';

  return <Editor templateId={templateId} mode={mode} />
}

export default EditorPage
