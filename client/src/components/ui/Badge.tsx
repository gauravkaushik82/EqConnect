import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent'
  className?: string
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, variant = 'default', className }, ref) => {
    const variantStyles = {
      default: 'bg-primary-light text-primary',
      success: 'bg-success-light text-success',
      warning: 'bg-warning-light text-warning',
      error: 'bg-error-light text-error',
      accent: 'bg-accent-light text-accent',
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium',
          variantStyles[variant],
          className
        )}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
