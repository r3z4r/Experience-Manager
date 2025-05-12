// TemplatePageStep: Renders a published GJS page as a wizard step
'use client'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { WizardStepProps } from '@/lib/types/wizard'
import { fetchTemplateById } from '@/app/(frontend)/_actions/templates'
import { renderTemplate } from '@/lib/utils/template-renderer'

export const TemplatePageStep: React.FC<WizardStepProps> = ({ step, goNext, goBack }) => {
  const [html, setHtml] = useState<string>('')
  const [css, setCss] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [iframeHeight, setIframeHeight] = useState(500)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchTemplateById(step.ref)
      .then(async (template) => {
        if (!template) throw new Error('Template not found')
        const { html, css } = await renderTemplate(template, null)
        setHtml(html)
        setCss(css)
      })
      .catch((e) => setError(e.message || 'Failed to load page'))
      .finally(() => setLoading(false))
  }, [step.ref])

  // Handle iframe content loading and inject responsive meta tags
  useEffect(() => {
    if (!iframeRef.current || !html) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return
    
    // Create responsive HTML content with viewport meta tag and responsive CSS
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            /* Base responsive styles */
            body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow-x: hidden;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            * {
              box-sizing: border-box;
            }
            img, video {
              max-width: 100%;
              height: auto;
            }
            /* Template CSS */
            ${css}
          </style>
        </head>
        <body>
          <div id="template-content">${html}</div>
          <script>
            // Script to notify parent of content size changes
            function notifyParentOfHeight() {
              const height = document.body.scrollHeight;
              window.parent.postMessage({ type: 'resize', height }, '*');
            }
            
            // Set up mutation observer to watch for DOM changes
            const observer = new MutationObserver(notifyParentOfHeight);
            observer.observe(document.body, { 
              childList: true, 
              subtree: true,
              attributes: true,
              characterData: true
            });
            
            // Initial height notification
            window.addEventListener('load', notifyParentOfHeight);
            notifyParentOfHeight();
            
            // Handle window resize events
            window.addEventListener('resize', notifyParentOfHeight);
          </script>
        </body>
      </html>
    `
    
    doc.open()
    doc.write(content)
    doc.close()
  }, [html, css])
  
  // Set up message listener for iframe height updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'resize') {
        // Add a small buffer to prevent scrollbars
        setIframeHeight(event.data.height + 20)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])
  
  // Set up resize observer for container width changes
  useLayoutEffect(() => {
    if (!containerRef.current) return
    
    // Create resize observer to handle container width changes
    resizeObserverRef.current = new ResizeObserver(entries => {
      if (iframeRef.current && entries[0]) {
        // Notify iframe of container width change
        iframeRef.current.contentWindow?.postMessage({ 
          type: 'containerResize',
          width: entries[0].contentRect.width 
        }, '*')
      }
    })
    
    // Start observing container
    resizeObserverRef.current.observe(containerRef.current)
    
    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col">
      {loading && (
        <div className="py-8 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading template...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="py-8 text-center bg-red-50 border border-red-100 rounded-lg">
          <div className="text-red-600 mb-2">Failed to load template</div>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="w-full h-full relative rounded-lg overflow-hidden border border-border bg-white">
          <iframe
            ref={iframeRef}
            className="w-full border-0 bg-white"
            style={{ height: `${iframeHeight}px` }}
            sandbox="allow-same-origin allow-scripts"
            title="Template Preview"
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}
