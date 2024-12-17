import React from 'react'
import { HeadingBannerProps } from '../types'
import { HeadingBannerStyles } from './HeadingBanner.styles'

export function HeadingBanner({
  title = 'Choose your Smartphones',
  filterLabel = 'Brand',
  sortLabel = 'Recommended',
}: HeadingBannerProps) {
  return (
    <div style={{ backgroundColor: '#F8F8F8', padding: '2rem' }}>
    <div className="maniContainer">
      <h1 className="headerTitle">{title}</h1>
      <div className="subPart">
        <span className="filter">{filterLabel} ▼</span>
        <span className="sort">Sort by {sortLabel} ▼</span>
      </div>
    </div>
    </div>
  )
}
