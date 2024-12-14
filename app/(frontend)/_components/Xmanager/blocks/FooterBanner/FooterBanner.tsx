import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faTwitter, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { footerBannerStyles } from './FooterBanner.styles'

export function FooterBanner() {
  const quickLinks = ['Life at Tecnotree', 'Investors', 'Digital', 'About Us']
  const socialLinks = [
    { icon: faFacebookF, href: 'https://facebook.com', color: '#1877F2' },
    { icon: faTwitter, href: 'https://twitter.com', color: '#1DA1F2' },
    { icon: faLinkedinIn, href: 'https://linkedin.com', color: '#0A66C2' },
    { icon: faYoutube, href: 'https://youtube.com', color: '#FF0000' },
  ]
  const footerLinks = ['Privacy', 'Internal Committee']

  return (
    <>
      <style>{footerBannerStyles}</style>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-contact">
              <Image
                src="/xpm/images/TT-logo.png"
                alt="Tecnotree Logo"
                className="footer-logo"
                width={50}
                height={50}
              />
              <div className="contact-details">
                <p>Tel +358-980-4781</p>
                <p>marketing@tecnotree.com</p>
              </div>
            </div>
            <div className="footer-links">
              {quickLinks.map((link, index) => (
                <a key={index} href="#" className="quick-link">
                  {link}
                </a>
              ))}
            </div>

            <div className="social-icons">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                  style={{ color: link.color }}
                >
                  <FontAwesomeIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>
          <p className="footer-description">
            Tecnotree is the only full-stack digital BSS provider with over 40 years of deep domain
            knowledge, proven delivery and transformation capability across the globe.
          </p>
          <div className="footer-bottom">
            <div className="footer-legal">
              {footerLinks.map((link, index) => (
                <a key={index} href="#" className="footer-link">
                  {link}
                </a>
              ))}
            </div>
            <p>&copy; 2022 Tecnotree</p>
          </div>
        </div>
      </footer>
    </>
  )
}
