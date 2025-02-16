import React from 'react'
import { footerStyles } from './Footer.styles'

interface FooterColumn {
  title: string
  links: {
    label: string
    href: string
  }[]
}

interface SocialLink {
  icon: React.ReactNode
  href: string
  label: string
}

interface FooterProps {
  logo: {
    src: string
    alt: string
  }
  description: string
  columns: FooterColumn[]
  socialLinks: SocialLink[]
  bottomText: string
  theme?: 'light' | 'dark'
}

export function Footer({
  logo,
  description,
  columns,
  socialLinks,
  bottomText,
  theme = 'light',
}: FooterProps) {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className={`footer footer-${theme}`}>
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <img src={logo.src} alt={logo.alt} className="footer-logo" />
              <p className="footer-description">{description}</p>
              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="social-link"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {columns.map((column, index) => (
              <div key={index} className="footer-column">
                <h3 className="footer-column-title">{column.title}</h3>
                <ul className="footer-links">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Text */}
          <div className="footer-bottom">
            <p className="footer-copyright">{bottomText}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
