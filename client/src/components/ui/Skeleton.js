import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from 'clsx';
const Skeleton = ({ className, count = 1 }) => {
    return (_jsx(_Fragment, { children: Array.from({ length: count }).map((_, i) => (_jsx("div", { className: clsx('shimmer-loader rounded-lg', className || 'h-12 w-full mb-4') }, i))) }));
};
export default Skeleton;
