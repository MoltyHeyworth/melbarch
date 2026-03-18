'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/houses?q=${encodeURIComponent(searchValue.trim())}`)
      setSearchValue('')
    }
  }

  const navLinks = [
    { href: '/houses', label: 'Browse' },
    { href: '/architects', label: 'Architects' },
    { href: '/import', label: 'Import' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // Don't show navbar on login page
  if (pathname === '/login') return null

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: logo */}
          <Link
            href="/houses"
            className="text-lg font-semibold text-[#1A1A2E] tracking-tight shrink-0"
          >
            MelbArch
          </Link>

          {/* Center: nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isActive(link.href)
                    ? 'text-[#1A1A2E] bg-gray-100 font-medium'
                    : 'text-[#6B7280] hover:text-[#1A1A2E] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: search + add hint */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-40 lg:w-56 px-3 py-1.5 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A96E] placeholder:text-gray-400"
              />
            </form>
            <span className="hidden lg:inline text-xs text-[#6B7280]">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">N</kbd> Add
            </span>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#6B7280] hover:text-[#1A1A2E]"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm rounded transition-colors ${
                  isActive(link.href)
                    ? 'text-[#1A1A2E] bg-gray-100 font-medium'
                    : 'text-[#6B7280] hover:text-[#1A1A2E]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="sm:hidden mt-2 px-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  )
}
