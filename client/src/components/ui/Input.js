import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
const Input = React.forwardRef(({ label, error, helperText, className, ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-text mb-2", children: label })), _jsx("input", { ref: ref, className: clsx('w-full px-4 py-2.5 rounded-lg border transition-smooth focus-ring', 'bg-surface text-text placeholder-text-faint', error
                    ? 'border-error focus:border-error'
                    : 'border-border focus:border-primary', className), ...props }), error && _jsx("p", { className: "text-error text-sm mt-1", children: error }), helperText && _jsx("p", { className: "text-text-faint text-sm mt-1", children: helperText })] }));
});
Input.displayName = 'Input';
export default Input;
