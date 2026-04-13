import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-smooth focus-ring whitespace-nowrap';
    const variantStyles = {
        primary: 'bg-primary text-white hover:bg-primary-hover disabled:opacity-50',
        secondary: 'bg-surface-2 text-text hover:bg-surface-offset disabled:opacity-50',
        outline: 'border border-border text-text hover:bg-surface-2 disabled:opacity-50',
        ghost: 'text-text hover:bg-surface-2 disabled:opacity-50',
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    return (_jsx("button", { ref: ref, disabled: disabled || isLoading, className: clsx(baseStyles, variantStyles[variant], sizeStyles[size], className), ...props, children: isLoading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Loading..."] })) : (children) }));
});
Button.displayName = 'Button';
export default Button;
