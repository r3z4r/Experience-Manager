import { MomentsHeaderProps } from '../types'
import { momentsHeaderStyles } from './MomentsHeader.styles'

export function MomentsHeader({
  className = '',
  logoSrc = '/logo.webp',
  logoAlt = 'Moments Healthcare',
  navLinks = [
    { href: '/', label: 'Home' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ],
  showLanguageSelector = true,
}: MomentsHeaderProps) {
  return (
    <>
      <style>{momentsHeaderStyles}</style>
      <header className="moments-header">
        <div className="header-container">
          <div className="logo-wrapper">
            <img src={logoSrc} alt={logoAlt} className="logo" />
          </div>
          <nav className="nav-menu">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="login-button">Login/Register</button>
            {showLanguageSelector && (
              <div className="language-selector">
                <span>🇬🇧</span>
                <span>English (UK)</span>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
