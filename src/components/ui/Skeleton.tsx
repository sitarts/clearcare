import { type HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = 'bg-slate-200'
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const computedStyle = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1em' : undefined),
    ...style,
  }

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={computedStyle}
      {...props}
    />
  )
}

// Card skeleton for patient/cycle cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-card shadow-card border border-slate-100 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="text" height={16} width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" height={14} />
        <Skeleton variant="text" height={14} width="80%" />
      </div>
    </div>
  )
}

// Table row skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton variant="text" height={16} width={i === 0 ? '70%' : '50%'} />
        </td>
      ))}
    </tr>
  )
}

// Stats card skeleton
export function StatsSkeleton() {
  return (
    <div className="bg-white rounded-card shadow-card border border-slate-100 p-6">
      <Skeleton variant="text" height={14} width="60%" className="mb-2" />
      <Skeleton variant="text" height={32} width="40%" />
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-card shadow-card border border-slate-100 p-6 space-y-4">
        <Skeleton variant="text" height={24} width="30%" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" height={14} width="40%" />
              <Skeleton variant="rectangular" height={40} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Page header skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="space-y-2">
        <Skeleton variant="text" height={32} width={200} />
        <Skeleton variant="text" height={16} width={300} />
      </div>
      <Skeleton variant="rectangular" height={40} width={120} />
    </div>
  )
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsSkeleton key={i} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-card shadow-card border border-slate-100 p-6 space-y-4">
          <Skeleton variant="text" height={24} width="40%" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" height={16} width="60%" />
                <Skeleton variant="text" height={12} width="30%" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-card shadow-card border border-slate-100 p-6 space-y-4">
          <Skeleton variant="text" height={24} width="40%" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" height={16} width="60%" />
                <Skeleton variant="text" height={12} width="30%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Patient list skeleton
export function PatientListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// Cycle kanban skeleton
export function CycleKanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-72">
          <div className="px-4 py-3 rounded-t-lg bg-slate-100">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="circular" width={24} height={24} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-b-lg p-3 min-h-[400px] space-y-3">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                <Skeleton variant="text" height={16} width="70%" />
                <Skeleton variant="text" height={12} width="40%" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
