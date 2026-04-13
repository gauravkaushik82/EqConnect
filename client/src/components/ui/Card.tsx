import React, { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, onClick, hoverable = false }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={clsx(
          'bg-surface rounded-xl p-6 shadow-card border border-divider',
          hoverable && 'hover:shadow-lg hover:scale-102 transition-smooth cursor-pointer',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
