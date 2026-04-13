import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
const Badge = React.forwardRef(({ children, variant = 'default', className }, ref) => {
    const variantStyles = {
        default: 'bg-primary-light text-primary',
        success: 'bg-success-light text-success',
        warning: 'bg-warning-light text-warning',
        error: 'bg-error-light text-error',
        accent: 'bg-accent-light text-accent',
    };
    return (_jsx("div", { ref: ref, className: clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium', variantStyles[variant], className), children: children }));
});
Badge.displayName = 'Badge';
export default Badge;
