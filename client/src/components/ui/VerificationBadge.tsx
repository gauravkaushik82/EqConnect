import React from 'react'
import clsx from 'clsx'

interface VerificationBadgeProps {
  status: 'verified' | 'partial' | 'unverified'
  animated?: boolean
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, animated = false }) => {
  const styles = {
    verified: {
      bg: 'bg-success-light',
      text: 'text-success',
      icon: '✓',
      label: 'Verified',
    },
    partial: {
      bg: 'bg-warning-light',
      text: 'text-warning',
      icon: '⏱',
      label: 'Pending',
    },
    unverified: {
      bg: 'bg-surface-offset',
      text: 'text-text-muted',
      icon: '⊗',
      label: 'Unverified',
    },
  }

  const style = styles[status]

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium',
        style.bg,
        style.text,
        animated && status === 'verified' && 'animate-pulse-subtle'
      )}
    >
      <span className="text-xs">{style.icon}</span>
      <span>{style.label}</span>
    </div>
  )
}

export default VerificationBadge
