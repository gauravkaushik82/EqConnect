import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useSkills } from '../hooks/useSkills';
import { Plus, Trash2, Award, Loader } from 'lucide-react';
const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
export const SkillsWidget = ({ userId, isEditable = false }) => {
    const { skills, loading, error, addSkill, updateSkill, deleteSkill, endorseSkill } = useSkills();
    const [showForm, setShowForm] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState('beginner');
    const [submitting, setSubmitting] = useState(false);
    const handleAddSkill = async () => {
        if (!newSkillName.trim()) {
            alert('Please enter a skill name');
            return;
        }
        setSubmitting(true);
        try {
            await addSkill(newSkillName.trim(), newSkillLevel);
            setNewSkillName('');
            setNewSkillLevel('beginner');
            setShowForm(false);
        }
        catch (err) {
            console.error('Failed to add skill:', err);
            alert('Failed to add skill. Please try again.');
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleUpdateLevel = async (skillId, newLevel) => {
        try {
            await updateSkill(skillId, newLevel);
        }
        catch (err) {
            console.error('Failed to update skill:', err);
            alert('Failed to update skill. Please try again.');
        }
    };
    const handleDeleteSkill = async (skillId) => {
        if (!confirm('Are you sure you want to delete this skill?'))
            return;
        try {
            await deleteSkill(skillId);
        }
        catch (err) {
            console.error('Failed to delete skill:', err);
            alert('Failed to delete skill. Please try again.');
        }
    };
    const handleEndorseSkill = async (skillId, userId) => {
        try {
            await endorseSkill(skillId, userId);
        }
        catch (err) {
            console.error('Failed to endorse skill:', err);
            alert('Failed to endorse skill. Please try again.');
        }
    };
    const getLevelColor = (level) => {
        switch (level) {
            case 'beginner':
                return 'bg-blue-100 text-blue-800';
            case 'intermediate':
                return 'bg-green-100 text-green-800';
            case 'advanced':
                return 'bg-orange-100 text-orange-800';
            case 'expert':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    if (loading) {
        return (_jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsx("div", { className: "flex items-center justify-center h-40", children: _jsx(Loader, { className: "w-6 h-6 animate-spin text-blue-500" }) }) }));
    }
    return (_jsx("div", { className: "bg-white rounded-lg shadow", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Skills" }), isEditable && (_jsxs("button", { onClick: () => setShowForm(!showForm), className: "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Skill"] }))] }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: error })), showForm && isEditable && (_jsx("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Skill Name" }), _jsx("input", { type: "text", value: newSkillName, onChange: (e) => setNewSkillName(e.target.value), placeholder: "e.g., React, Python, Design", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Proficiency Level" }), _jsx("select", { value: newSkillLevel, onChange: (e) => setNewSkillLevel(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: LEVELS.map((level) => (_jsx("option", { value: level, children: level.charAt(0).toUpperCase() + level.slice(1) }, level))) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleAddSkill, disabled: submitting || !newSkillName.trim(), className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium", children: submitting ? 'Adding...' : 'Add Skill' }), _jsx("button", { onClick: () => {
                                            setShowForm(false);
                                            setNewSkillName('');
                                            setNewSkillLevel('beginner');
                                        }, className: "flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium", children: "Cancel" })] })] }) })), _jsx("div", { className: "space-y-3", children: skills.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-8", children: isEditable ? 'No skills yet. Add your first skill!' : 'No skills added yet.' })) : (skills.map((skill) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-medium text-gray-900", children: skill.name }), _jsx("span", { className: `inline-block px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(skill.level)}`, children: skill.level })] }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Award, { className: "w-4 h-4 text-yellow-500" }), _jsxs("span", { className: "text-sm text-gray-600", children: [skill.endorsements, " ", skill.endorsements === 1 ? 'endorsement' : 'endorsements'] })] })] }), _jsx("div", { className: "flex items-center gap-2", children: isEditable ? (_jsxs(_Fragment, { children: [_jsx("select", { value: skill.level, onChange: (e) => handleUpdateLevel(skill.id, e.target.value), className: "px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500", children: LEVELS.map((level) => (_jsx("option", { value: level, children: level.charAt(0).toUpperCase() + level.slice(1) }, level))) }), _jsx("button", { onClick: () => handleDeleteSkill(skill.id), className: "p-2 text-red-500 hover:bg-red-50 rounded transition", title: "Delete skill", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) : (_jsx("button", { onClick: () => handleEndorseSkill(skill.id, userId || ''), className: "px-3 py-1 text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100 transition font-medium", disabled: !userId, children: "Endorse" })) })] }, skill.id)))) }), skills.length > 0 && (_jsx("div", { className: "mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200", children: _jsxs("p", { className: "text-sm text-blue-700", children: [_jsx("span", { className: "font-medium", children: "Total Endorsements:" }), " ", skills.reduce((sum, s) => sum + s.endorsements, 0)] }) }))] }) }));
};
