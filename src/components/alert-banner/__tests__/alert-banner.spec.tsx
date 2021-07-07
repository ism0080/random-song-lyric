import React from 'react'
import { render, screen } from '@testing-library/react'

import { AlertBanner } from '..'

const onError = () => null

describe('Alert Banner', () => {
  it('is rendered', () => {
    const container = render(<AlertBanner setError={onError} errorText='error' />)

    expect(container.baseElement).not.toBeNull()
  })

  it('should display error text', () => {
    render(<AlertBanner setError={onError} errorText='This is the error' />)

    expect(screen.getByText(/This is the error/i)).not.toBeNull()
  })
})
