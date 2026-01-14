import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Calendar,
  FileText,
  Settings,
  Baby,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from 'lucide-react'
import { useEffect } from 'react'

interface NavItem {
  name: string
  path: string
  icon: React.ReactNode
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'Patients', path: '/patients', icon: <Users className="h-5 w-5" /> },
  { name: 'Cycles', path: '/cycles', icon: <GitBranch className="h-5 w-5" /> },
  { name: 'Embryology', path: '/embryology', icon: <Baby className="h-5 w-5" /> },
  { name: 'Calendar', path: '/calendar', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Reports', path: '/reports', icon: <FileText className="h-5 w-5" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
]

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function Sidebar({ mobileOpen, onMobileClose, collapsed, onCollapsedChange }: SidebarProps) {
  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-slate-200
          flex flex-col z-50 transition-all duration-300
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Baby className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Kolibianakis IVF</span>
            </div>
          )}
          {collapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Baby className="h-5 w-5 text-white" />
              </div>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-colors duration-200
                    ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                    ${collapsed ? 'lg:justify-center' : ''}
                  `}
                  title={collapsed ? item.name : undefined}
                >
                  {item.icon}
                  <span className={`font-medium ${collapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse button - desktop only */}
        <div className="hidden lg:block p-3 border-t border-slate-100">
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}

// Mobile menu button component
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
      aria-label="Open menu"
    >
      <Menu className="h-6 w-6" />
    </button>
  )
}
