import React from 'react'
import ReactDOM from 'react-dom/client'
import About from './pages/About'
import './tokens.css'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <About />
  </React.StrictMode>
)
