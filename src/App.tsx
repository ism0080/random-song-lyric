import React from 'react'
import { render } from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

import { Home } from './pages'

export const App = () => <Home />

render(<App />, document.getElementById('app'))
