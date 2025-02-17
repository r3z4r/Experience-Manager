import React from 'react'
import { Globe, Wifi, Shield } from 'lucide-react'
import { featuresStyles } from './FootballFeatures.styles'

export function FootballFeatures() {
  const features = [
    {
      icon: <Globe className="w-full h-full" />,
      title: 'Stadium Coverage',
      description: 'Guaranteed connectivity in and around the stadium',
    },
    {
      icon: <Wifi className="w-full h-full" />,
      title: 'Instant Activation',
      description: 'Get connected as soon as you land',
    },
    {
      icon: <Shield className="w-full h-full" />,
      title: 'Match Day Ready',
      description: 'Share your experience with friends and family back home',
    },
  ]

  return (
    <>
      <style>{featuresStyles}</style>
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Why Choose Our Match Day eSIM?</h2>
            <p className="features-description">Stay connected throughout your football journey</p>
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
