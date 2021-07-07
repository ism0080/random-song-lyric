import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { Search } from '..'

const onSubmit = () => null

describe('Search', () => {
  it('is rendered', () => {
    const container = render(<Search onSubmit={onSubmit} loading={false} />)

    expect(container.baseElement).not.toBeNull()
  })

  it('should display required error when value is invalid', async () => {
    render(<Search onSubmit={onSubmit} loading={false} />)
    fireEvent.submit(screen.getByRole('button'))

    expect(await screen.findAllByRole('alert')).toHaveLength(1)
  })

  it('should accept value in textbox', () => {
    render(<Search onSubmit={onSubmit} loading={false} />)
    fireEvent.input(screen.getByRole('textbox', { name: /artist/i }), {
      target: {
        value: 'kanye'
      }
    })

    expect((screen.getByRole('textbox', { name: /artist/i }) as HTMLInputElement).value).toBe('kanye')
  })

  it('should show button text when not loading', () => {
    render(<Search onSubmit={onSubmit} loading={false} />)

    expect((screen.getByRole('button') as HTMLButtonElement).firstChild?.textContent).toEqual('Get Lyric')
  })

  it('should show button spinner when loading', () => {
    render(<Search onSubmit={onSubmit} loading />)

    expect((screen.getByRole('button') as HTMLButtonElement).firstChild?.nodeName).toEqual('SPAN')
  })
})
