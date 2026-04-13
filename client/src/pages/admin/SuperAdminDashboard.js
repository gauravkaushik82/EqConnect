import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, XCircle, Clock, Users, LogOut, Settings, Bell, Search } from 'lucide-react';
import { useVerification } from '../../hooks/useVerification';
import { useAuth } from '../../hooks/useAuth';
export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { getPendingVerifications } = useVerification();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });
    const [universities, setUniversities] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    useEffect(() => {
        loadDashboardData();
    }, []);
    useEffect(() => {
        filterUniversities();
    }, [universities, searchTerm, activeTab]);
    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const data = await getPendingVerifications();
            // Calculate stats
            const total = data.length;
            const pending = data.filter((u) => u.verification_status === 'pending').length;
            const approved = data.filter((u) => u.verification_status === 'approved').length;
            const rejected = data.filter((u) => u.verification_status === 'rejected').length;
            setStats({ total, pending, approved, rejected });
            setUniversities(data);
        }
        catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const filterUniversities = () => {
        let filtered = universities;
        // Filter by tab
        if (activeTab !== 'overview') {
            filtered = filtered.filter(u => {
                if (activeTab === 'pending')
                    return u.verification_status === 'pending';
                if (activeTab === 'verified')
                    return u.verification_status === 'approved';
                if (activeTab === 'rejected')
                    return u.verification_status === 'rejected';
                return true;
            });
        }
        // Filter by search
        if (searchTerm) {
            filtered = filtered.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.id.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredUniversities(filtered);
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const handleViewDetails = (universityId) => {
        navigate(`/admin/verifications?university=${universityId}`);
    };
    const chartData = [
        { name: 'Pending', value: stats.pending, color: '#F59E0B' },
        { name: 'Approved', value: stats.approved, color: '#10B981' },
        { name: 'Rejected', value: stats.rejected, color: '#EF4444' }
    ];
    const barData = [
        { name: 'Pending', count: stats.pending },
        { name: 'Approved', count: stats.approved },
        { name: 'Rejected', count: stats.rejected }
    ];
    const COLORS = ['#F59E0B', '#10B981', '#EF4444'];
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white" }), _jsx("p", { className: "text-white mt-4", children: "Loading dashboard..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900", children: [_jsx("header", { className: "bg-slate-800/50 backdrop-blur border-b border-slate-700", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Super Admin Dashboard" }), _jsxs("p", { className: "text-slate-300 mt-2", children: ["Welcome, ", user?.full_name] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { className: "p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition", children: _jsx(Bell, { size: 20 }) }), _jsx("button", { className: "p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition", children: _jsx(Settings, { size: 20 }) }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition", children: [_jsx(LogOut, { size: 18 }), "Logout"] })] })] }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [_jsx("div", { className: "bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Total Universities" }), _jsx("p", { className: "text-3xl font-bold text-white mt-2", children: stats.total })] }), _jsx(Users, { className: "text-blue-400", size: 32 })] }) }), _jsx("div", { className: "bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Pending Review" }), _jsx("p", { className: "text-3xl font-bold text-yellow-400 mt-2", children: stats.pending })] }), _jsx(Clock, { className: "text-yellow-400", size: 32 })] }) }), _jsx("div", { className: "bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Approved" }), _jsx("p", { className: "text-3xl font-bold text-green-400 mt-2", children: stats.approved })] }), _jsx(CheckCircle, { className: "text-green-400", size: 32 })] }) }), _jsx("div", { className: "bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Rejected" }), _jsx("p", { className: "text-3xl font-bold text-red-400 mt-2", children: stats.rejected })] }), _jsx(XCircle, { className: "text-red-400", size: 32 })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Verification Status Overview" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: barData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#475569" }), _jsx(XAxis, { dataKey: "name", stroke: "#94A3B8" }), _jsx(YAxis, { stroke: "#94A3B8" }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: '#1E293B',
                                                        border: '1px solid #475569',
                                                        borderRadius: '8px'
                                                    }, labelStyle: { color: '#E2E8F0' } }), _jsx(Bar, { dataKey: "count", fill: "#3B82F6" })] }) })] }), _jsxs("div", { className: "bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Status Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: chartData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, value }) => `${name}: ${value}`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: chartData.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: '#1E293B',
                                                        border: '1px solid #475569',
                                                        borderRadius: '8px'
                                                    }, labelStyle: { color: '#E2E8F0' } })] }) })] })] }), _jsxs("div", { className: "bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6", children: [_jsx("div", { className: "flex gap-2", children: ['overview', 'pending', 'verified', 'rejected'].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), className: `px-4 py-2 rounded-lg font-medium transition ${activeTab === tab
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, children: tab.charAt(0).toUpperCase() + tab.slice(1) }, tab))) }), _jsxs("div", { className: "relative w-full md:w-64", children: [_jsx(Search, { className: "absolute left-3 top-3 text-slate-400", size: 18 }), _jsx("input", { type: "text", placeholder: "Search universities...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-slate-700", children: [_jsx("th", { className: "text-left py-3 px-4 font-semibold text-slate-300", children: "University Name" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-slate-300", children: "Status" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-slate-300", children: "Documents" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-slate-300", children: "Submitted" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-slate-300", children: "Action" })] }) }), _jsx("tbody", { children: filteredUniversities.length > 0 ? (filteredUniversities.map((university) => (_jsxs("tr", { className: "border-b border-slate-700/50 hover:bg-slate-700/30 transition", children: [_jsx("td", { className: "py-3 px-4", children: _jsxs("div", { children: [_jsx("p", { className: "text-white font-medium", children: university.name }), _jsx("p", { className: "text-slate-400 text-sm", children: university.id })] }) }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${university.verification_status === 'pending'
                                                                ? 'bg-yellow-900/30 text-yellow-400'
                                                                : university.verification_status === 'approved'
                                                                    ? 'bg-green-900/30 text-green-400'
                                                                    : 'bg-red-900/30 text-red-400'}`, children: university.verification_status.charAt(0).toUpperCase() +
                                                                university.verification_status.slice(1) }) }), _jsxs("td", { className: "py-3 px-4 text-slate-300", children: [university.documents_count, " files"] }), _jsx("td", { className: "py-3 px-4 text-slate-400 text-sm", children: new Date(university.submitted_at).toLocaleDateString() }), _jsx("td", { className: "py-3 px-4", children: _jsx("button", { onClick: () => handleViewDetails(university.id), className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium", children: "Review" }) })] }, university.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "py-8 text-center text-slate-400", children: "No universities found" }) })) })] }) })] })] })] }));
}
