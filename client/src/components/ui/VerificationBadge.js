import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const VerificationBadge = ({ status, animated = false }) => {
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
    };
    const style = styles[status];
    return (_jsxs("div", { className: clsx('inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium', style.bg, style.text, animated && status === 'verified' && 'animate-pulse-subtle'), children: [_jsx("span", { className: "text-xs", children: style.icon }), _jsx("span", { children: style.label })] }));
};
export default VerificationBadge;
