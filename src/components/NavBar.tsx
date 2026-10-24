import React, { JSX } from 'react'
import './NavBar.css'

export type Page = 'home' | 'about' | 'contact'

interface NavBarProps {
  current: Page
  // Opens the intro; only the home page has one
  onHelp?: () => void
}

const LINKS: { page: Page; href: string; label: string }[] = [
  { page: 'about', href: './about.html', label: 'About' },
  { page: 'contact', href: './contact.html', label: 'Contact' },
]

function NavBar({ current, onHelp }: NavBarProps): JSX.Element {
  return (
    <nav className="nav" aria-label="Main">
      <a
        className="nav-brand"
        href="./"
        aria-current={current === 'home' ? 'page' : undefined}
      >
        Learn Dvorak
      </a>
      <div className="nav-links">
        {LINKS.map(({ page, href, label }) => (
          <a
            key={page}
            className="nav-link"
            href={href}
            aria-current={current === page ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
        {onHelp && (
          <button
            type="button"
            className="nav-help"
            aria-label="How to play"
            title="How to play"
            onClick={(e) => {
              // Otherwise the intro hands focus back here on close, and the
              // next Space or Enter typed into the Passage reopens it
              e.currentTarget.blur()
              onHelp()
            }}
          >
            ?
          </button>
        )}
      </div>
    </nav>
  )
}

export default NavBar
