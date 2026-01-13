import { type ReactNode } from 'react'
import { FileQuestion, Users, Activity, Calendar, Microscope, FolderOpen, Search } from 'lucide-react'
import { Button } from './Button'

type EmptyStateType = 'patients' | 'cycles' | 'embryos' | 'calendar' | 'documents' | 'search' | 'generic'

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  className?: string
}

const icons: Record<EmptyStateType, ReactNode> = {
  patients: <Users className="h-12 w-12" />,
  cycles: <Activity className="h-12 w-12" />,
  embryos: <Microscope className="h-12 w-12" />,
  calendar: <Calendar className="h-12 w-12" />,
  documents: <FolderOpen className="h-12 w-12" />,
  search: <Search className="h-12 w-12" />,
  generic: <FileQuestion className="h-12 w-12" />,
}

const defaults: Record<EmptyStateType, { title: string; description: string }> = {
  patients: {
    title: 'No patients yet',
    description: 'Get started by adding your first patient to the system.',
  },
  cycles: {
    title: 'No cycles found',
    description: 'Start a new treatment cycle for a patient.',
  },
  embryos: {
    title: 'No embryos recorded',
    description: 'Embryos will appear here after the retrieval procedure.',
  },
  calendar: {
    title: 'No appointments',
    description: 'Schedule appointments to see them here.',
  },
  documents: {
    title: 'No documents',
    description: 'Upload documents to keep records organized.',
  },
  search: {
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
  generic: {
    title: 'Nothing here yet',
    description: 'This section is empty.',
  },
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  const defaultContent = defaults[type]
  const Icon = icons[type]

  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full text-slate-400 mb-4">
        {Icon}
      </div>
      <h3 className="text-h3 text-slate-900 mb-2">{title || defaultContent.title}</h3>
      <p className="text-body text-slate-500 max-w-sm mx-auto mb-6">
        {description || defaultContent.description}
      </p>
      {action && (
        <Button onClick={action.onClick} leftIcon={action.icon}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Compact empty state for inline use
interface EmptyStateInlineProps {
  message: string
  className?: string
}

export function EmptyStateInline({ message, className = '' }: EmptyStateInlineProps) {
  return (
    <div className={`text-center py-8 text-slate-400 ${className}`}>
      <p className="text-small">{message}</p>
    </div>
  )
}
