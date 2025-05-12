import React from 'react'
import { VASCardDetailsStyles } from './VASDetailsCard.styles'

export type VASCardDetailsProps = {
  title: string
  subtitle: string
  sectionTitle: string
  offerDetails: string
}

export function VASCardDetails({
  title,
  subtitle,
  sectionTitle,
  offerDetails,
}: VASCardDetailsProps) {
  return (
    <>
      <style>{VASCardDetailsStyles}</style>
      <div className="vasCardDetailsWrapper">
        <h4 className="vasCardDetailsTitle">{title}</h4>
        <p className="vasCardDetailsSubtitle">{subtitle}</p>

        <p className="vasCardDetailsSectionTitle">{sectionTitle}</p>

        <details className="vasCardDetailsAccordion">
          <summary>
            OFFER DETAILS <span className="dropdownIcon">▼</span>
          </summary>
          <div className="vasCardDetailsAccordionContent">{offerDetails}</div>
        </details>
      </div>
    </>
  )
}
