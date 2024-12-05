import { useEffect, useRef, useState } from 'react'

interface TemplatePreviewProps {
  html: string | null | undefined
  css: string | null | undefined
  className?: string
}

export function TemplatePreview({ html, css, className = '' }: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    setIsLoading(true)

    // Create the HTML content with CSS
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            /* Hide scrollbars but allow scrolling */
            ::-webkit-scrollbar {
              display: none;
            }
            
            html {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            
            body {
              transform: scale(0.25);
              transform-origin: top left;
              width: 400%;
              height: 400%;
              overflow: hidden;
              background: white;
            }
            
            /* Your template CSS */
            ${css || ''}
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

    setIsLoading(false)
  }, [html, css])

  return (
    <div className="relative w-full h-full overflow-hidden rounded-t-lg">
      {isLoading && <div className="absolute inset-0 bg-gray-50 animate-pulse" />}
      <iframe
        ref={iframeRef}
        className={`pointer-events-none w-full h-full bg-white ${
          isLoading ? 'invisible' : 'visible'
        } ${className}`}
        sandbox="allow-same-origin"
        title="Template preview"
      />
    </div>
  )
}
