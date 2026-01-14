import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Home } from './pages'
import { configure } from 'onedollarstats'

export const App = () => {
  useEffect(() => {
    configure({ trackLocalhostAs: 'lyric.mackle.im' })
  }, [])

  return (
    <>
      <Home />
      <Analytics />
    </>
  )
}
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
