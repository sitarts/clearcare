import { Search, Bell, Command, Menu, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchHotkey } from '../../hooks'
import { SearchModal } from '../ui'
import { useAuth } from '../../contexts'

interface HeaderProps {
  sidebarCollapsed?: boolean
  onMobileMenuClick: () => void
}

export function Header({ sidebarCollapsed = false, onMobileMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { user, signOut } = useAuth()

  // Get user display name from metadata or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Cmd+K / Ctrl+K to open search
  useSearchHotkey(() => {
    setSearchOpen(true)
  })

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <header
        className={`
          fixed top-0 right-0 h-16 bg-white border-b border-slate-200
          flex items-center justify-between px-4 md:px-6 z-20
          transition-all duration-300
          left-0 lg:left-64
          ${sidebarCollapsed ? 'lg:left-20' : 'lg:left-64'}
        `}
      >
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search trigger button */}
        <div className="flex-1 max-w-xl mx-4 lg:mx-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all duration-200 text-left"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span className="flex-1 text-sm text-slate-400">Search patients, cycles...</span>
            <kbd className="hidden md:flex items-center gap-1 px-2 py-0.5 text-tiny text-slate-400 bg-white border border-slate-200 rounded">
              <Command className="h-3 w-3" />
              <span>K</span>
            </kbd>
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={displayName}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-xs font-medium text-primary-600">{initials}</span>
                )}
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {displayName}
              </span>
              <ChevronDown className="hidden md:block h-4 w-4 text-slate-400" />
            </button>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setUserMenuOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </button>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
