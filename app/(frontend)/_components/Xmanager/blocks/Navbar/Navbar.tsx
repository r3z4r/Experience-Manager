import React from 'react'
import { Search, ShoppingCart, Menu } from 'lucide-react'
import { navbarStyles } from './Navbar.styles'

interface NavItem {
  label: string
  href: string
  isButton?: boolean
}

interface NavbarProps {
  logo: {
    src: string
    alt: string
  }
  primaryLinks: NavItem[]
  secondaryLinks: NavItem[]
  showSearch?: boolean
  showCart?: boolean
  className?: string
  theme?: 'light' | 'dark'
}

export function Navbar({
  logo,
  primaryLinks,
  secondaryLinks,
  showSearch = true,
  showCart = true,
  theme = 'light',
}: NavbarProps) {
  return (
    <>
      <style>{navbarStyles}</style>
      <nav className={`navbar navbar-${theme}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-logo">
              <img src={logo.src} alt={logo.alt} />
            </div>

            <div className="navbar-primary-links">
              {primaryLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`navbar-link ${link.isButton ? 'navbar-button' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="navbar-actions">
              {showSearch && (
                <button className="navbar-icon-button">
                  <Search className="icon" />
                </button>
              )}
              {showCart && (
                <button className="navbar-icon-button">
                  <ShoppingCart className="icon" />
                </button>
              )}
              {secondaryLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`navbar-link ${link.isButton ? 'navbar-button' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="navbar-mobile-menu">
              <button className="navbar-icon-button">
                <Menu className="icon" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
