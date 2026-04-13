import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
function SuperAdminRegister() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        adminCode: ''
    });
    const [passwordErrors, setPasswordErrors] = useState([]);
    const validatePassword = (pwd) => {
        const errors = [];
        if (pwd.length < 8)
            errors.push('At least 8 characters');
        if (!/[A-Z]/.test(pwd))
            errors.push('One uppercase letter');
        if (!/[a-z]/.test(pwd))
            errors.push('One lowercase letter');
        if (!/[0-9]/.test(pwd))
            errors.push('One number');
        if (!/[!@#$%^&*]/.test(pwd))
            errors.push('One special character (!@#$%^&*)');
        return errors;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'password') {
            setPasswordErrors(validatePassword(value));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Validate form
            if (!formData.email || !formData.password || !formData.fullName) {
                throw new Error('All fields are required');
            }
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            if (passwordErrors.length > 0) {
                throw new Error('Password does not meet requirements');
            }
            // Call super admin registration endpoint
            // Note: This requires authentication as an existing super admin
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in as a super admin to create new super admins');
            }
            const response = await fetch('http://localhost:3001/api/super-admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create super admin');
            }
            setSuccess(true);
            setTimeout(() => {
                navigate('/super-admin/dashboard');
            }, 2000);
        }
        catch (err) {
            setError(err.message || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    if (success) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\u2705" }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Super Admin Created!" }), _jsx("p", { className: "text-gray-600", children: "Redirecting to dashboard..." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4 py-12", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8", children: [_jsx(ArrowLeft, { size: 20 }), "Go Back"] }), _jsxs("div", { className: "bg-white p-8 rounded-2xl shadow-lg", children: [_jsx("div", { className: "text-4xl mb-4 text-center", children: "\uD83D\uDD10" }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2 text-center", children: "Create Super Admin" }), _jsx("p", { className: "text-gray-600 text-center mb-6", children: "Only existing super admins can create new super admins" }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Full Name" }), _jsx("input", { type: "text", name: "fullName", value: formData.fullName, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "John Admin", disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "admin@example.com", disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "Enter password", disabled: loading }), passwordErrors.length > 0 && (_jsx("ul", { className: "mt-2 space-y-1 text-xs text-gray-600", children: passwordErrors.map((err, i) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-red-500", children: "\u2717" }), " ", err] }, i))) }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirm Password" }), _jsx("input", { type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600", placeholder: "Confirm password", disabled: loading })] }), _jsxs("button", { type: "submit", disabled: loading || passwordErrors.length > 0, className: "w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center gap-2", children: [loading && _jsx(Loader, { size: 18, className: "animate-spin" }), "Create Super Admin"] })] }), _jsx("p", { className: "text-center text-gray-600 text-sm mt-6", children: "\u2139\uFE0F Make sure you are logged in as a super admin" })] })] }) }));
}
export default SuperAdminRegister;
