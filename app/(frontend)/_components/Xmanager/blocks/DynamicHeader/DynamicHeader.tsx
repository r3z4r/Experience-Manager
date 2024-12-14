import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

export function DynamicHeader({
  showLoginButton = false,
  tecnotreePosition = 'center',
  logoSrc = '/xpm/images/Tecnotree.png',
}) {
  const getAlignment = () => {
    switch (tecnotreePosition) {
      case 'left':
        return { justifyContent: 'flex-start' }
      case 'center':
        return { justifyContent: 'center' }
      case 'right':
        return { justifyContent: 'flex-end' }
      default:
        return { justifyContent: 'center' }
    }
  }

  return (
    <>
      <style>
        {`
          .dynamic-header {
            width: 100%;
            background-color: #1a1a1a;
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
          }

          .header-content {
            display: flex;
            flex: 1;
            align-items: center;
          }

          .tecnotree-text {
            font-size: 1.5rem;
            color: #00f0ff;
            font-weight: bold;
          }

          .login-button {
            background-color: #00f0ff;
            color: #1a1a1a;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-weight: bold;
            cursor: pointer;
            margin-left: auto;
            transition: background-color 0.3s ease;
          }

          .login-button:hover {
            background-color: #00d0e0;
          }
        `}
      </style>
      <header className="dynamic-header">
        <div className="header-content" style={{ ...getAlignment(), flex: 1 }}>
          <Image src={logoSrc} alt="Tecnotree Logo" className="logo-img" width={150} height={20} />
        </div>
        {showLoginButton && <button className="login-button">Login</button>}
      </header>
    </>
  )
}

DynamicHeader.propTypes = {
  showLoginButton: PropTypes.bool,
  tecnotreePosition: PropTypes.oneOf(['left', 'center', 'right']),
  logoSrc: PropTypes.string.isRequired,
}

DynamicHeader.defaultProps = {
  showLoginButton: false,
  tecnotreePosition: 'center',
}
