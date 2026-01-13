import { type HTMLAttributes, forwardRef } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'teal'
  size?: 'sm' | 'md'
}

const variants = {
  default: 'bg-slate-100 text-slate-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-coral-100 text-coral-800',
  info: 'bg-primary-100 text-primary-800',
  teal: 'bg-teal-100 text-teal-800',
}

const sizes = {
  sm: 'px-2 py-0.5 text-tiny',
  md: 'px-2.5 py-1 text-small',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'sm', className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-medium rounded-full
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Status badge with dot indicator
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'completed' | 'pending' | 'cancelled' | 'pregnant'
}

const statusConfig = {
  active: { variant: 'info' as const, label: 'Active' },
  completed: { variant: 'success' as const, label: 'Completed' },
  pending: { variant: 'warning' as const, label: 'Pending' },
  cancelled: { variant: 'error' as const, label: 'Cancelled' },
  pregnant: { variant: 'teal' as const, label: 'Pregnant' },
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, className = '', ...props }, ref) => {
    const config = statusConfig[status]
    return (
      <Badge ref={ref} variant={config.variant} className={className} {...props}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
        {config.label}
      </Badge>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'
