import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
function StudentDashboard() {
    const [notifications] = useState([
        { id: 1, message: 'TCS shortlisted you!', type: 'success', time: '2 hours ago' },
        { id: 2, message: 'Interview scheduled for tomorrow at 10 AM', type: 'info', time: '4 hours ago' },
        { id: 3, message: 'Your profile is now 85% complete', type: 'info', time: '1 day ago' }
    ]);
    const opportunities = [
        {
            id: 1,
            company: 'TCS',
            title: 'Software Developer Intern',
            type: 'Internship',
            matchScore: 92,
            skills: ['Java', 'Python', 'SQL'],
            location: 'Bangalore',
            stipend: '₹50,000/month'
        },
        {
            id: 2,
            company: 'Amazon',
            title: 'SDE-1 (Full-time)',
            type: 'Job',
            matchScore: 87,
            skills: ['C++', 'System Design'],
            location: 'Hyderabad',
            stipend: '₹25,00,000/year'
        },
        {
            id: 3,
            company: 'Microsoft',
            title: 'Data Science Internship',
            type: 'Internship',
            matchScore: 78,
            skills: ['Python', 'ML', 'Statistics'],
            location: 'Remote',
            stipend: '₹60,000/month'
        }
    ];
    const applications = [
        { id: 1, company: 'Google', role: 'Software Engineer', status: 'Interviewing', appliedDate: '5 days ago' },
        { id: 2, company: 'Microsoft', role: 'Product Manager', status: 'Shortlisted', appliedDate: '1 week ago' },
        { id: 3, company: 'Amazon', role: 'Data Scientist', status: 'Applied', appliedDate: '2 weeks ago' }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("nav", { className: "bg-white border-b border-gray-200", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-indigo-600", children: "EqConnect" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { className: "text-gray-600 hover:text-gray-900", children: "\uD83D\uDD14" }), _jsx("button", { className: "w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center", children: "A" })] })] }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900", children: "Welcome back, Aditya! \uD83D\uDC4B" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Here's what's happening with your applications today" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm mb-2", children: "Applications" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: "12" }), _jsx("p", { className: "text-xs text-green-600 mt-2", children: "\u2191 3 this week" })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm mb-2", children: "Profile Completion" }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mb-2", children: _jsx("div", { className: "bg-indigo-600 h-2 rounded-full", style: { width: '85%' } }) }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: "85%" })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm mb-2", children: "Match Score" }), _jsx("p", { className: "text-3xl font-bold text-indigo-600", children: "82" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Average match" })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm mb-2", children: "Messages" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: "5" }), _jsx("p", { className: "text-xs text-red-600 mt-2", children: "2 unread" })] })] }), _jsxs("section", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Top Matched Opportunities" }), _jsx("a", { href: "/student/opportunities", className: "text-indigo-600 hover:text-indigo-700 font-semibold", children: "View All \u2192" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: opportunities.map((opp) => (_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: opp.company }), _jsx("h4", { className: "text-lg font-semibold text-gray-900", children: opp.title })] }), _jsxs("span", { className: "px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold", children: [opp.matchScore, "% match"] })] }), _jsxs("p", { className: "text-sm text-gray-600 mb-2", children: [opp.type, " \u2022 ", opp.location] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: opp.skills.slice(0, 2).map((skill, i) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs", children: skill }, i))) }), _jsx("p", { className: "font-semibold text-gray-900 mb-4", children: opp.stipend }), _jsx("button", { className: "w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium", children: "Apply Now" })] }, opp.id))) })] }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Application Pipeline" }), _jsx("div", { className: "space-y-4", children: applications.map((app) => (_jsxs("div", { className: "bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: app.company }), _jsx("p", { className: "text-sm text-gray-600", children: app.role }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Applied ", app.appliedDate] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-sm font-semibold ${app.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' :
                                                                app.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-gray-100 text-gray-700'}`, children: app.status }), _jsx("button", { className: "text-indigo-600 hover:text-indigo-700", children: "\u2192" })] })] }, app.id))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Notifications" }), _jsx("div", { className: "space-y-4", children: notifications.map((notif) => (_jsxs("div", { className: `p-4 rounded-lg border-l-4 ${notif.type === 'success' ? 'bg-green-50 border-green-500' :
                                                'bg-blue-50 border-blue-500'}`, children: [_jsx("p", { className: `font-medium ${notif.type === 'success' ? 'text-green-900' : 'text-blue-900'}`, children: notif.message }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: notif.time })] }, notif.id))) })] })] })] })] }));
}
export default StudentDashboard;
