import React from 'react'
import { render } from '@testing-library/react'

import { Home } from '..'

describe('Home', () => {
  it('is rendered', () => {
    const container = render(<Home />)

    expect(container.baseElement).not.toBeNull()
  })
})
