import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [retryCountdown, setRetryCountdown] = useState(0);
    const navigate = useNavigate();
    const { login, loading, error, user } = useAuth();
    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            // Route based on role
            if (user.role === 'student') {
                navigate('/student/dashboard');
            }
            else if (user.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            }
            else if (user.role === 'university') {
                navigate('/university/dashboard');
            }
            else if (user.role === 'admin') {
                navigate('/admin');
            }
        }
    }, [user, navigate]);
    // Handle rate limit timer
    useEffect(() => {
        if (error && error.includes('rate limit')) {
            setIsRateLimited(true);
            setRetryCountdown(60);
        }
    }, [error]);
    useEffect(() => {
        if (retryCountdown > 0) {
            const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        else if (retryCountdown === 0 && isRateLimited) {
            setIsRateLimited(false);
        }
    }, [retryCountdown, isRateLimited]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (!email || !password) {
            return;
        }
        const result = await login(email, password);
        if (!result.success) {
            // Error is already set by useAuth hook
        }
        // On success, useEffect will handle navigation
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4", children: _jsxs("div", { className: "w-full max-w-md space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Welcome Back" }), _jsx("p", { className: "text-gray-600", children: "Sign in to your EqConnect account" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "bg-white p-8 rounded-2xl shadow-lg space-y-6", children: [error && (_jsxs("div", { className: `p-4 rounded-lg text-sm border ${isRateLimited
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                : 'bg-red-50 border-red-200 text-red-700'}`, children: [_jsx("div", { className: "font-semibold mb-2 flex items-center gap-2", children: isRateLimited ? (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u23F1\uFE0F" }), _jsx("span", { children: "Too Many Login Attempts" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u274C" }), _jsx("span", { children: "Sign In Failed" })] })) }), _jsx("p", { className: "mb-3", children: error }), isRateLimited && (_jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-xs opacity-90", children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "What happened:" }), " Supabase Auth blocked your request to prevent abuse. This is temporary."] }), _jsxs("p", { className: "text-xs opacity-90", children: ["\uD83D\uDD04 ", _jsx("strong", { children: "How to fix:" })] }), _jsxs("ul", { className: "text-xs opacity-90 list-disc list-inside space-y-1", children: [_jsxs("li", { children: ["Try again in ", _jsx("strong", { children: retryCountdown }), " second", retryCountdown !== 1 ? 's' : ''] }), _jsx("li", { children: "Or use a different email address to register a new account" }), _jsx("li", { children: "Or wait and try again later" })] })] }))] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "you@example.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", className: "rounded" }), _jsx("span", { className: "text-sm text-gray-600", children: "Remember me" })] }), _jsx("a", { href: "#", className: "text-sm text-indigo-600 hover:text-indigo-700", children: "Forgot password?" })] }), _jsx("button", { type: "submit", disabled: loading || isRateLimited, className: `w-full py-2 rounded-lg font-semibold transition-colors ${isRateLimited
                                ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400'}`, children: loading ? 'Signing in...' : isRateLimited ? `Retry in ${retryCountdown}s` : 'Sign In' }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "Or continue with" }) })] }), _jsxs("button", { type: "button", className: "w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2", children: [_jsx("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: _jsx("text", { x: "12", y: "18", children: "G" }) }), "Sign in with Google"] }), _jsxs("button", { type: "button", className: "w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2", children: [_jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 100 100", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "20", y: "10", width: "50", height: "60", rx: "4", fill: "#5B4FD6" }), _jsx("polygon", { points: "70,10 70,30 90,30", fill: "white" }), _jsx("path", { d: "M 32 42 Q 20 42 20 54 Q 20 66 32 66 L 48 66 Q 60 66 60 54 Q 60 42 48 42", fill: "white", stroke: "#5B4FD6", strokeWidth: "3", strokeLinejoin: "round" }), _jsx("circle", { cx: "40", cy: "52", r: "3", fill: "#5B4FD6" }), _jsx("rect", { x: "39", y: "55", width: "2", height: "5", fill: "#5B4FD6" })] }), "Sign in with DigiLocker"] })] }), _jsxs("p", { className: "text-center text-gray-600", children: ["Don't have an account?", ' ', _jsx("a", { href: "/register", className: "text-indigo-600 hover:text-indigo-700 font-semibold", children: "Sign up" })] })] }) }));
}
export default Login;
