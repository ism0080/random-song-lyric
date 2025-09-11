import React from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Home } from './pages'

export const App = () => (
  <>
    <Home />
    <Analytics />
  </>
)

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
