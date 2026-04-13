import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const Avatar = ({ src, alt = 'Avatar', initials, size = 'md', status }) => {
    const sizeStyles = {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
    };
    const statusColors = {
        online: 'bg-success',
        offline: 'bg-text-muted',
        away: 'bg-warning',
    };
    return (_jsxs("div", { className: "relative inline-flex", children: [_jsx("div", { className: clsx('rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-medium overflow-hidden', sizeStyles[size]), children: src ? (_jsx("img", { src: src, alt: alt, className: "w-full h-full object-cover" })) : (initials || _jsx("span", { children: "?" })) }), status && (_jsx("div", { className: clsx('absolute bottom-0 right-0 rounded-full border-2 border-surface', statusColors[status], size === 'sm' && 'h-2.5 w-2.5', size === 'md' && 'h-3 w-3', size === 'lg' && 'h-4 w-4', size === 'xl' && 'h-5 w-5') }))] }));
};
export default Avatar;
