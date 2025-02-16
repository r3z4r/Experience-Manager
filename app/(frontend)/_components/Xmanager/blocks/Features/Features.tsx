import React from 'react'
import { featuresStyles } from './Features.styles'

interface FeaturesProps {
  title: string
  description: string
  features: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
}

export function Features({ title, description, features }: FeaturesProps) {
  return (
    <>
      <style>{featuresStyles}</style>
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">{title}</h2>
            <p className="features-description">{description}</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
