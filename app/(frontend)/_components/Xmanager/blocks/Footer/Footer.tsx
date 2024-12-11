import { FooterProps } from '../types'
import { footerStyles } from './Footer.styles'

export function Footer({
  logoSrc = '/xpm/logo.webp',
  socialLinks = [
    { icon: '📱', href: '#' },
    { icon: '📘', href: '#' },
    { icon: '🐦', href: '#' },
    { icon: '📸', href: '#' },
  ],
  quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}: FooterProps) {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="Company Logo" className="footer-logo" />
              <p className="footer-description">
                Providing quality healthcare services to improve lives and well-being.
              </p>
              <div className="social-links">
                {socialLinks.map((link, index) => (
                  <a key={index} href={link.href} className="social-link">
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-contact">
              <h3>Contact Us</h3>
              <p>📍 123 Healthcare Street</p>
              <p>📞 +1 234 567 890</p>
              <p>✉️ contact@healthcare.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Healthcare Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
