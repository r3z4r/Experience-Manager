'use client'

import React from 'react'
import { UaeLandingScreenStyles } from './LandingPage.styles'

export default function UaeLandingScreen() {
  const features = [
    {
      icon: '📱',
      title: 'Nationwide Coverage',
      description: 'Reliable network across all Emirates and major cities.',
    },
    {
      icon: '⚡',
      title: 'Ultra-Fast Data',
      description: 'Enjoy blazing 5G internet across the UAE.',
    },
    {
      icon: '🌐',
      title: 'Multilingual Support',
      description: 'Service available in Arabic, English, and more.',
    },
  ]

  return (
    <>
      <style>{UaeLandingScreenStyles}</style>
      <div className="uaeScreenContainer">
        <header className="uaeHeader">
          <div className="uaeLogo">🕌</div>
          <div className="uaeCountryLabel">United Arab Emirates</div>
        </header>

        <section className="uaeHeroSection">
          <h1>Connect Across UAE</h1>
          <p>Affordable data, call, and text plans for all Emirates.</p>
          <button className="uaeSimButton">Get Your SIM Now →</button>
        </section>

        <section className="uaeFeatures">
          <h2>Why Choose Us</h2>
          <div className="uaeFeatureGrid">
            {features.map((feature, idx) => (
              <div className="uaeFeatureCard" key={idx}>
                <div className="uaeFeatureIcon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
