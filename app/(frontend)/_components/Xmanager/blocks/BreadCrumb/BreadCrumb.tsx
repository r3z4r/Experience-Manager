import React from 'react'
import { breadcrumbStyles } from './BreadCrumb.styles'

interface BreadcrumbItem {
  label: string
  url?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <>
      <style>{breadcrumbStyles}</style>
      <nav className={'breadcrumb'}>
        {items.map((item, index) => (
          <span key={index} className={'breadcrumbItem'}>
            {item.url ? <a href={item.url}>{item.label}</a> : item.label}
            {index < items.length - 1 && <span className={'separator'}>›</span>}
          </span>
        ))}
      </nav>
    </>
  )
}
