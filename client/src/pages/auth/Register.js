import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
function Register() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [retryCountdown, setRetryCountdown] = useState(0);
    const navigate = useNavigate();
    const { register: registerUser, loading, error, user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        // Student fields
        universityName: '',
        degree: '',
        branch: '',
        year: '',
        urn: '',
        // Recruiter fields
        companyName: '',
        designation: '',
        companySize: '',
        industry: '',
        // University fields
        universityDisplayName: ''
    });
    // Password validation state
    const [passwordErrors, setPasswordErrors] = useState([]);
    // Password validation function
    const validatePassword = (pwd) => {
        const errors = [];
        if (pwd.length < 8) {
            errors.push('At least 8 characters');
        }
        if (!/[A-Z]/.test(pwd)) {
            errors.push('One uppercase letter');
        }
        if (!/[a-z]/.test(pwd)) {
            errors.push('One lowercase letter');
        }
        if (!/[0-9]/.test(pwd)) {
            errors.push('One number');
        }
        if (!/[!@#$%^&*]/.test(pwd)) {
            errors.push('One special character (!@#$%^&*)');
        }
        return errors;
    };
    // Update password errors when password changes
    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setFormData(prev => ({
            ...prev,
            password: pwd
        }));
        if (pwd) {
            setPasswordErrors(validatePassword(pwd));
        }
        else {
            setPasswordErrors([]);
        }
    };
    // Redirect if already logged in
    useEffect(() => {
        if (user) {
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
    // Handle rate limit detection
    useEffect(() => {
        if (error && error.includes('rate limit')) {
            setIsRateLimited(true);
            setRetryCountdown(60);
        }
    }, [error]);
    // Handle rate limit countdown
    useEffect(() => {
        if (retryCountdown > 0) {
            const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        else if (retryCountdown === 0 && isRateLimited) {
            setIsRateLimited(false);
        }
    }, [retryCountdown, isRateLimited]);
    const handleChange = (e) => {
        // Handle password separately to show validation
        if (e.target.name === 'password') {
            handlePasswordChange(e);
            return;
        }
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleNextStep = () => {
        if (step === 1 && !role) {
            return;
        }
        if (step === 2) {
            if (!formData.fullName || !formData.email || !formData.password) {
                return;
            }
            // Check password strength
            const errors = validatePassword(formData.password);
            if (errors.length > 0) {
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                return;
            }
        }
        setStep(step + 1);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Build payload based on role
            const payload = {
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: role
            };
            // Add role-specific fields
            if (role === 'student') {
                payload.universityName = formData.universityName;
                payload.degree = formData.degree;
                payload.branch = formData.branch;
                payload.year = formData.year;
                payload.urn = formData.urn;
            }
            else if (role === 'recruiter') {
                payload.companyName = formData.companyName;
                payload.designation = formData.designation;
                payload.companySize = formData.companySize;
                payload.industry = formData.industry;
            }
            else if (role === 'university') {
                payload.universityName = formData.universityDisplayName;
            }
            const result = await registerUser(payload);
            if (!result.success) {
                // Error is handled by useAuth
            }
            // On success, useEffect will handle navigation
        }
        catch (err) {
            // Error handling
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4 py-12", children: _jsxs("div", { className: "w-full max-w-2xl", children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "flex justify-between mb-4", children: [1, 2, 3].map((s) => (_jsx("div", { className: `h-2 flex-1 rounded-full mx-1 ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}` }, s))) }), _jsxs("p", { className: "text-center text-sm text-gray-600", children: ["Step ", step, " of 3"] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "bg-white p-8 rounded-2xl shadow-lg space-y-6", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: [step === 1 && 'Choose Your Role', step === 2 && 'Create Your Account', step === 3 && role === 'student' && 'Academic Information', step === 3 && role === 'recruiter' && 'Company Information', step === 3 && role === 'university' && 'University Information'] }), error && (_jsxs("div", { className: `p-4 rounded-lg text-sm border ${isRateLimited
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                : 'bg-red-50 border-red-200 text-red-700'}`, children: [_jsx("div", { className: "font-semibold mb-2 flex items-center gap-2", children: isRateLimited ? (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u23F1\uFE0F" }), _jsx("span", { children: "Too Many Registration Attempts" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u274C" }), _jsx("span", { children: "Registration Failed" })] })) }), _jsx("p", { className: "mb-3", children: error }), isRateLimited && (_jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-xs opacity-90", children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "What happened:" }), " Supabase Auth blocked your request to prevent abuse. This is temporary."] }), _jsxs("p", { className: "text-xs opacity-90", children: ["\uD83D\uDD04 ", _jsx("strong", { children: "How to fix:" })] }), _jsxs("ul", { className: "text-xs opacity-90 list-disc list-inside space-y-1", children: [_jsxs("li", { children: ["Try again in ", _jsx("strong", { children: retryCountdown }), " second", retryCountdown !== 1 ? 's' : ''] }), _jsx("li", { children: "Or use a different email address" }), _jsx("li", { children: "Or wait and try again later" })] })] }))] })), step === 1 && (_jsx("div", { className: "grid grid-cols-3 gap-4", children: ['Student', 'University', 'Recruiter'].map((r) => (_jsxs("button", { type: "button", onClick: () => setRole(r.toLowerCase()), className: `p-6 rounded-lg border-2 transition-all ${role === r.toLowerCase()
                                    ? 'border-indigo-600 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-200'}`, children: [_jsxs("div", { className: "text-3xl mb-2", children: [r === 'Student' && '👨‍🎓', r === 'University' && '🏫', r === 'Recruiter' && '💼'] }), _jsx("p", { className: "font-semibold text-gray-900", children: r })] }, r))) })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Full Name" }), _jsx("input", { type: "text", name: "fullName", value: formData.fullName, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "John Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "you@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formData.password && passwordErrors.length === 0
                                                ? 'border-green-300 focus:ring-green-600'
                                                : formData.password && passwordErrors.length > 0
                                                    ? 'border-red-300 focus:ring-red-600'
                                                    : 'border-gray-300 focus:ring-indigo-600'}`, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), formData.password && (_jsxs("div", { className: "mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200", children: [_jsx("p", { className: "text-xs font-semibold text-gray-700 mb-2", children: "Password must contain:" }), _jsxs("ul", { className: "space-y-1", children: [_jsxs("li", { className: `text-xs flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-600'}`, children: [_jsx("span", { children: formData.password.length >= 8 ? '✓' : '✗' }), "At least 8 characters"] }), _jsxs("li", { className: `text-xs flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`, children: [_jsx("span", { children: /[A-Z]/.test(formData.password) ? '✓' : '✗' }), "One uppercase letter (A-Z)"] }), _jsxs("li", { className: `text-xs flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`, children: [_jsx("span", { children: /[a-z]/.test(formData.password) ? '✓' : '✗' }), "One lowercase letter (a-z)"] }), _jsxs("li", { className: `text-xs flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`, children: [_jsx("span", { children: /[0-9]/.test(formData.password) ? '✓' : '✗' }), "One number (0-9)"] }), _jsxs("li", { className: `text-xs flex items-center gap-2 ${/[!@#$%^&*]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`, children: [_jsx("span", { children: /[!@#$%^&*]/.test(formData.password) ? '✓' : '✗' }), "One special character (!@#$%^&*)"] })] })] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirm Password" }), _jsx("input", { type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formData.confirmPassword && formData.password === formData.confirmPassword
                                                ? 'border-green-300 focus:ring-green-600'
                                                : formData.confirmPassword && formData.password !== formData.confirmPassword
                                                    ? 'border-red-300 focus:ring-red-600'
                                                    : 'border-gray-300 focus:ring-indigo-600'}`, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), formData.confirmPassword && (_jsx("p", { className: `text-xs mt-2 ${formData.password === formData.confirmPassword
                                                ? 'text-green-600'
                                                : 'text-red-600'}`, children: formData.password === formData.confirmPassword
                                                ? '✓ Passwords match'
                                                : '✗ Passwords do not match' }))] })] })), step === 3 && role === 'student' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "University Name" }), _jsx("input", { type: "text", name: "universityName", value: formData.universityName, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "e.g., IIT Delhi" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Degree" }), _jsxs("select", { name: "degree", value: formData.degree, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", children: [_jsx("option", { value: "", children: "Select degree" }), _jsx("option", { value: "btech", children: "B.Tech" }), _jsx("option", { value: "mtech", children: "M.Tech" }), _jsx("option", { value: "bsc", children: "B.Sc" }), _jsx("option", { value: "msc", children: "M.Sc" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Branch" }), _jsx("input", { type: "text", name: "branch", value: formData.branch, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "e.g., CSE" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Year of Study" }), _jsxs("select", { name: "year", value: formData.year, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", children: [_jsx("option", { value: "", children: "Select year" }), _jsx("option", { value: "1", children: "1st Year" }), _jsx("option", { value: "2", children: "2nd Year" }), _jsx("option", { value: "3", children: "3rd Year" }), _jsx("option", { value: "4", children: "4th Year" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "University Roll Number (URN)" }), _jsx("input", { type: "text", name: "urn", value: formData.urn, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "e.g., 2021CS1001" })] })] })), step === 3 && role === 'recruiter' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Company Name" }), _jsx("input", { type: "text", name: "companyName", value: formData.companyName, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "e.g., TCS" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Designation" }), _jsx("input", { type: "text", name: "designation", value: formData.designation, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "e.g., HR Manager" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Company Size" }), _jsxs("select", { name: "companySize", value: formData.companySize, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", children: [_jsx("option", { value: "", children: "Select size" }), _jsx("option", { value: "startup", children: "Startup (1-50)" }), _jsx("option", { value: "small", children: "Small (51-200)" }), _jsx("option", { value: "medium", children: "Medium (201-1000)" }), _jsx("option", { value: "large", children: "Large (1000+)" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Industry" }), _jsx("input", { type: "text", name: "industry", value: formData.industry, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "e.g., Technology" })] })] })), step === 3 && role === 'university' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "University Name" }), _jsx("input", { type: "text", name: "universityDisplayName", value: formData.universityDisplayName, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "e.g., IIT Delhi" })] }), _jsx("div", { children: _jsx("p", { className: "text-sm text-gray-600", children: "As a university admin, you'll be able to verify student credentials and manage enrollment data." }) })] })), _jsxs("div", { className: "flex gap-4 pt-6", children: [step > 1 && (_jsx("button", { type: "button", onClick: () => setStep(step - 1), className: "flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold", children: "Back" })), step < 3 ? (_jsx("button", { type: "button", onClick: handleNextStep, disabled: step === 2 && (!formData.fullName ||
                                        !formData.email ||
                                        !formData.password ||
                                        !formData.confirmPassword ||
                                        passwordErrors.length > 0 ||
                                        formData.password !== formData.confirmPassword), className: `flex-1 py-2 rounded-lg font-semibold transition-colors ${step === 2 && (!formData.fullName ||
                                        !formData.email ||
                                        !formData.password ||
                                        !formData.confirmPassword ||
                                        passwordErrors.length > 0 ||
                                        formData.password !== formData.confirmPassword)
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'}`, children: "Next" })) : (_jsx("button", { type: "submit", disabled: loading || isRateLimited, className: `flex-1 py-2 rounded-lg font-semibold transition-colors ${isRateLimited
                                        ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400'}`, children: loading ? 'Creating Account...' : isRateLimited ? `Retry in ${retryCountdown}s` : 'Create Account' }))] }), _jsxs("p", { className: "text-center text-gray-600 text-sm", children: ["Already have an account?", ' ', _jsx("a", { href: "/login", className: "text-indigo-600 hover:text-indigo-700 font-semibold", children: "Sign in" })] })] })] }) }));
}
export default Register;
