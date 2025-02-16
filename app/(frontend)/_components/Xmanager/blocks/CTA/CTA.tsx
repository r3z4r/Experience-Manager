import React from 'react'
import { ctaStyles } from './CTA.styles'

interface CTAProps {
  title: string
  description: string
  buttonText: string
  buttonUrl: string
  backgroundImage?: string
}

export function CTA({ title, description, buttonText, buttonUrl, backgroundImage }: CTAProps) {
  return (
    <>
      <style>{ctaStyles}</style>
      <section
        className="cta-section"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        }}
      >
        <div className="cta-overlay"></div>
        <div className="cta-container">
          <h2 className="cta-title">{title}</h2>
          <p className="cta-description">{description}</p>
          <a href={buttonUrl} className="cta-button">
            {buttonText}
          </a>
        </div>
      </section>
    </>
  )
}
