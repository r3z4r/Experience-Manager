import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import NodePalette from '@/app/(frontend)/dashboard/flows/builder/[id]/NodePalette'

// Helper to click by text
const clickByText = (text: string) => {
  const btn = screen.getByText(text)
  fireEvent.click(btn)
}

describe('NodePalette', () => {
  it('calls onAddNode with correct template when buttons are clicked', () => {
    const handler = vi.fn()
    render(<NodePalette onAddNode={handler} />)

    clickByText('Start Node')
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ type: 'start' }))

    clickByText('Page Node')
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ type: 'page' }))

    clickByText('API + Condition')
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ type: 'apiCondition' }))

    clickByText('End Node')
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ type: 'end' }))

    // Total calls should be 4 (one per click)
    expect(handler).toHaveBeenCalledTimes(4)
  })
})
