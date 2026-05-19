import React, { useState } from 'react'

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a className="px-3 py-2 rounded hover:bg-gray-200" href={href}>
    {children}
  </a>
)

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <div className="text-lg font-semibold text-white">CRM von Oxion Energy</div>

        <div className="flex items-center">
          <button
            className="md:hidden text-white mr-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü umschalten"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <nav className={`${open ? 'block' : 'hidden'} md:flex md:items-center md:space-x-2`}>
            <div className="flex flex-col md:flex-row md:space-x-2">
              <NavLink href="#/">Startseite</NavLink>
              <NavLink href="#/customers">Einkäufer</NavLink>
              <NavLink href="#/suppliers">Verkäufer</NavLink>
              <NavLink href="#/materials">Materialien</NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
