import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { dynamicHeaderStyles } from './DynamicHeader.styles'

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
      <style>{dynamicHeaderStyles}</style>
      <header className={`dynamicHeader ${getAlignment()}`}>
        <div className="headerContent">
          <Image src={logoSrc} alt="Tecnotree Logo" className="logoImg" width={150} height={20} />
        </div>
        {showLoginButton && <button className="loginButton">Login</button>}
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
