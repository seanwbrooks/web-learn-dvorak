import React, { JSX, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import NavBar, { Page } from './NavBar'
import '../../tokens.css'
import '../../index.css'
import './Site.css'

interface SiteProps {
  current: Page
  // Opens the intro; only the home page has one
  onHelp?: () => void
  // Rendered outside the 75% zoom, e.g. the intro dialog
  outside?: ReactNode
  children: ReactNode
}

// The shell every page shares: the background, the page borders and zoom
// that keep a page within one laptop screen, the nav bar, and the footer
function Site({ current, onHelp, outside, children }: SiteProps): JSX.Element {
  return (
    <div className="app">
      {outside}
      <div className="app-content">
        <NavBar current={current} onHelp={onHelp} />
        {children}
      </div>
      <footer className="site-footer">
        © {new Date().getFullYear()} Sean Brooks
      </footer>
    </div>
  )
}

// Renders a page into its HTML file's #root
export function mount(page: JSX.Element): void {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>{page}</React.StrictMode>
  )
}

export default Site
