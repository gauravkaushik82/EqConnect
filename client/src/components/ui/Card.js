import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
const Card = React.forwardRef(({ children, className, onClick, hoverable = false }, ref) => {
    return (_jsx("div", { ref: ref, onClick: onClick, className: clsx('bg-surface rounded-xl p-6 shadow-card border border-divider', hoverable && 'hover:shadow-lg hover:scale-102 transition-smooth cursor-pointer', className), children: children }));
});
Card.displayName = 'Card';
export default Card;
