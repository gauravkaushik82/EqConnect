import React, { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.5 rounded-lg border transition-smooth focus-ring',
            'bg-surface text-text placeholder-text-faint',
            error
              ? 'border-error focus:border-error'
              : 'border-border focus:border-primary',
            className
          )}
          {...props}
        />
        {error && <p className="text-error text-sm mt-1">{error}</p>}
        {helperText && <p className="text-text-faint text-sm mt-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
