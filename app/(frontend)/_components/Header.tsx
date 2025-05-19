'use client'

import React from 'react'

export interface HeaderProps {
  title: string
  breadcrumbs?: { label: string; href: string }[]
  actions?: React.ReactNode
}

export default function Header({ title, breadcrumbs, actions }: HeaderProps) {
  return (
    <div className="bg-white border-b mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <div>
          {breadcrumbs && (
            <nav className="text-sm text-gray-500 mb-1">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  <a href={bc.href} className="hover:underline">
                    {bc.label}
                  </a>
                  {idx < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  )
}
