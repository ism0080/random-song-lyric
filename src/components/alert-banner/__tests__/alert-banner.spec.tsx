import React from 'react'
import { render, screen } from '@testing-library/react'

import { AlertBanner } from '..'

describe('Alert Banner', () => {
  it('is rendered', () => {
    const container = render(<AlertBanner errorText='error' />)

    expect(container.baseElement).not.toBeNull()
  })

  it('should display error text', () => {
    render(<AlertBanner errorText='This is the error' />)

    expect(screen.getByText(/This is the error/i)).not.toBeNull()
  })
})
