import { CustomBlockProps } from '../types'
import { headerStyles } from './Header.styles'

export function Header({ className = '' }: CustomBlockProps) {
  return (
    <>
      <style>{headerStyles}</style>
      <header className="basic-header">
        <div className="header-wrapper">
          <div className="header-left">
            <div className="logo-placeholder">LOGO</div>
          </div>

          <nav className="header-nav">
            <ul className="nav-list">
              <li>
                <a href="#" className="nav-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="header-right">
            <button className="auth-button">Sign In</button>
          </div>
        </div>
      </header>
    </>
  )
}
