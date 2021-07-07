import React from 'react'
import { render, screen } from '@testing-library/react'

import { Lyrics } from '..'

describe('Lyrics', () => {
  it('is rendered', () => {
    const container = render(<Lyrics image='test.png' title='Hello' lyrics='World' />)

    expect(container.baseElement).not.toBeNull()
  })

  it('should render title', () => {
    render(<Lyrics image='test.png' title='Lyric Title' lyrics='World' />)

    expect(screen.getByText(/Lyric Title/i)).not.toBeNull()
  })

  it('should render lyrics', () => {
    render(<Lyrics image='test.png' title='Lyric Title' lyrics='The song lyrics' />)

    expect(screen.getByText(/The song lyrics/i)).not.toBeNull()
  })
})
