import { useEffect, useRef } from 'react'

interface TemplatePreviewProps {
  html: string | null | undefined
  css: string | null | undefined
  className?: string
}

export function TemplatePreview({ html, css, className = '' }: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    // Create the HTML content with CSS
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${css || ''}
            /* Scale content to fit preview */
            body {
              transform: scale(0.25);
              transform-origin: 0 0;
              width: 400%;
              height: 400%;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${html || ''}
        </body>
      </html>
    `

    doc.open()
    doc.write(content)
    doc.close()
  }, [html, css])

  return (
    <iframe
      ref={iframeRef}
      className={`pointer-events-none ${className}`}
      sandbox="allow-same-origin"
      title="Template preview"
    />
  )
}
