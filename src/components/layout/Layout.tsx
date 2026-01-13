import { type ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />
      <Header
        sidebarCollapsed={collapsed}
        onMobileMenuClick={() => setMobileOpen(true)}
      />

      {/* Main content */}
      <main
        className={`
          pt-16 min-h-screen transition-all duration-300
          ml-0 lg:ml-64
          ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}

interface PageContainerProps {
  children: ReactNode
  title?: string
  description?: string
  actions?: ReactNode
}

export function PageContainer({ children, title, description, actions }: PageContainerProps) {
  return (
    <div className="animate-fade-in">
      {(title || actions) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && <h1 className="text-display text-slate-900">{title}</h1>}
            {description && <p className="mt-1 text-body text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
