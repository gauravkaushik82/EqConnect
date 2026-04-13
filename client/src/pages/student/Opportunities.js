import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
function Opportunities() {
    const [selectedType, setSelectedType] = useState('all');
    const opportunities = [
        { id: 1, company: 'Google', title: 'SDE Intern', type: 'internship', match: 95, location: 'Bangalore', skills: ['Python', 'JS'] },
        { id: 2, company: 'Microsoft', title: 'Data Scientist', type: 'job', match: 87, location: 'Hyderabad', skills: ['ML', 'Python'] },
        { id: 3, company: 'Amazon', title: 'DevOps Engineer', type: 'internship', match: 92, location: 'Remote', skills: ['AWS', 'Docker'] },
        { id: 4, company: 'TCS', title: 'Full Stack Developer', type: 'job', match: 78, location: 'Delhi', skills: ['React', 'Node.js'] },
    ];
    const filtered = selectedType === 'all' ? opportunities : opportunities.filter(o => o.type === selectedType);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("nav", { className: "bg-white border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-4", children: _jsx("h1", { className: "text-2xl font-bold text-indigo-600", children: "EqConnect" }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsx("h2", { className: "text-3xl font-bold mb-8", children: "Find Opportunities" }), _jsx("div", { className: "mb-8 flex gap-4", children: ['all', 'internship', 'job'].map(t => (_jsx("button", { onClick: () => setSelectedType(t), className: `px-4 py-2 rounded-lg ${selectedType === t ? 'bg-indigo-600 text-white' : 'bg-white border'}`, children: t.charAt(0).toUpperCase() + t.slice(1) }, t))) }), _jsx("div", { className: "grid md:grid-cols-2 gap-6", children: filtered.map(opp => (_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: opp.company }), _jsx("h3", { className: "font-semibold text-lg", children: opp.title })] }), _jsxs("span", { className: "bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm", children: [opp.match, "%"] })] }), _jsx("p", { className: "text-gray-600 mb-2", children: opp.location }), _jsx("div", { className: "flex gap-2 mb-4", children: opp.skills.map((s, i) => _jsx("span", { className: "px-2 py-1 bg-gray-100 text-sm rounded", children: s }, i)) }), _jsx("button", { className: "w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700", children: "Apply" })] }, opp.id))) })] })] }));
}
export default Opportunities;
