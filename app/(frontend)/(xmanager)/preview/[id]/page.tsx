import { fetchTemplateById } from '@/app/(frontend)/_actions/templates'
import { SignInForm } from '@/app/(frontend)/_components/auth/SignInForm'
import { PaymentForm } from '@/app/(frontend)/_components/payment/PaymentForm'
import { getCurrentUser } from '@/app/(frontend)/_actions/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PreviewPageProps {
  params: {
    id: string
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const user = await getCurrentUser()
  const template = await fetchTemplateById(params.id)

  if (!template) {
    notFound()
  }

  const isRestricted = template.access?.visibility === 'restricted'
  const isPrivate = template.access?.visibility === 'private'

  if (!user && (isRestricted || isPrivate)) {
    return <SignInForm />
  }

  if (isPrivate && !template.access?.allowedUsers?.includes(user?.id)) {
    return <div className="p-4">You don&apos;t have access to this template.</div>
  }

  if (isRestricted && template.status === 'published') {
    return <PaymentForm templateId={template.id} />
  }

  return (
    <div className="p-4">
      <Link
        href="/template-list"
        style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1001 }}
        className="text-blue-500 hover:underline"
      >
        &larr; Back to Template List
      </Link>
      <style dangerouslySetInnerHTML={{ __html: template.cssContent ?? '' }} />
      <div dangerouslySetInnerHTML={{ __html: template.htmlContent ?? '' }} />
    </div>
  )
}
