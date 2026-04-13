import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { ChevronRight, AlertCircle } from 'lucide-react';
export function PostJobForm() {
    const { createJob, loading, error } = useJobs();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company_name: '',
        location: '',
        job_type: 'full-time',
        experience_level: 'mid',
        required_skills: [],
        salary_min: '',
        salary_max: '',
        salary_currency: 'USD',
        deadline: '',
    });
    const [skillInput, setSkillInput] = useState('');
    const [success, setSuccess] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.required_skills.includes(skillInput)) {
            setFormData((prev) => ({
                ...prev,
                required_skills: [...prev.required_skills, skillInput],
            }));
            setSkillInput('');
        }
    };
    const handleRemoveSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            required_skills: prev.required_skills.filter((s) => s !== skill),
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createJob({
                ...formData,
                salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
                salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
            });
            setSuccess(true);
            setFormData({
                title: '',
                description: '',
                company_name: '',
                location: '',
                job_type: 'full-time',
                experience_level: 'mid',
                required_skills: [],
                salary_min: '',
                salary_max: '',
                salary_currency: 'USD',
                deadline: '',
            });
            setStep(1);
            setTimeout(() => setSuccess(false), 3000);
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4", children: _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Post a Job" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Fill out the form to post a new job opportunity" }), success && (_jsx("div", { className: "mb-6 p-4 bg-green-50 border border-green-200 rounded-lg", children: _jsx("p", { className: "text-green-800 font-medium", children: "\u2713 Job posted successfully!" }) })), error && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-red-800", children: error })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Job Title *" }), _jsx("input", { type: "text", name: "title", value: formData.title, onChange: handleInputChange, placeholder: "e.g., Senior React Developer", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "3-255 characters" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Company Name *" }), _jsx("input", { type: "text", name: "company_name", value: formData.company_name, onChange: handleInputChange, placeholder: "e.g., TechCorp Inc.", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Location" }), _jsx("input", { type: "text", name: "location", value: formData.location, onChange: handleInputChange, placeholder: "e.g., San Francisco, CA", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Job Type *" }), _jsxs("select", { name: "job_type", value: formData.job_type, onChange: handleInputChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", children: [_jsx("option", { value: "full-time", children: "Full-time" }), _jsx("option", { value: "part-time", children: "Part-time" }), _jsx("option", { value: "contract", children: "Contract" }), _jsx("option", { value: "internship", children: "Internship" }), _jsx("option", { value: "remote", children: "Remote" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Experience Level *" }), _jsxs("select", { name: "experience_level", value: formData.experience_level, onChange: handleInputChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", children: [_jsx("option", { value: "entry", children: "Entry Level" }), _jsx("option", { value: "mid", children: "Mid Level" }), _jsx("option", { value: "senior", children: "Senior" }), _jsx("option", { value: "lead", children: "Lead" })] })] })] })] })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Job Description *" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleInputChange, placeholder: "Describe the role, responsibilities, and what you're looking for...", required: true, rows: 6, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "20-5000 characters" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Required Skills" }), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx("input", { type: "text", value: skillInput, onChange: (e) => setSkillInput(e.target.value), placeholder: "e.g., React, TypeScript", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", onKeyPress: (e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill()) }), _jsx("button", { type: "button", onClick: handleAddSkill, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Add" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: formData.required_skills.map((skill) => (_jsxs("div", { className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2", children: [skill, _jsx("button", { type: "button", onClick: () => handleRemoveSkill(skill), className: "text-blue-700 hover:text-blue-900", children: "\u00D7" })] }, skill))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Salary Min" }), _jsx("input", { type: "number", name: "salary_min", value: formData.salary_min, onChange: handleInputChange, placeholder: "0", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Salary Max" }), _jsx("input", { type: "number", name: "salary_max", value: formData.salary_max, onChange: handleInputChange, placeholder: "0", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Application Deadline" }), _jsx("input", { type: "date", name: "deadline", value: formData.deadline, onChange: handleInputChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })] })] })), _jsxs("div", { className: "flex gap-4 pt-6 border-t border-gray-200", children: [step === 2 && (_jsx("button", { type: "button", onClick: () => setStep(1), className: "px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50", children: "Back" })), step === 1 && (_jsxs("button", { type: "button", onClick: () => setStep(2), className: "ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2", children: ["Next ", _jsx(ChevronRight, { className: "w-4 h-4" })] })), step === 2 && (_jsx("button", { type: "submit", disabled: loading, className: "ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400", children: loading ? 'Publishing...' : 'Publish Job' }))] })] })] }) }) }));
}
export default PostJobForm;
