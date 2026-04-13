import React, { useState } from 'react'
import { useSkills } from '../hooks/useSkills'
import { Plus, Trash2, Award, Loader } from 'lucide-react'

interface SkillsWidgetProps {
  userId?: string
  isEditable?: boolean
}

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const

export const SkillsWidget: React.FC<SkillsWidgetProps> = ({
  userId,
  isEditable = false
}) => {
  const { skills, loading, error, addSkill, updateSkill, deleteSkill, endorseSkill } = useSkills()
  const [showForm, setShowForm] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner')
  const [submitting, setSubmitting] = useState(false)

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) {
      alert('Please enter a skill name')
      return
    }

    setSubmitting(true)
    try {
      await addSkill(newSkillName.trim(), newSkillLevel)
      setNewSkillName('')
      setNewSkillLevel('beginner')
      setShowForm(false)
    } catch (err) {
      console.error('Failed to add skill:', err)
      alert('Failed to add skill. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateLevel = async (skillId: string, newLevel: typeof LEVELS[number]) => {
    try {
      await updateSkill(skillId, newLevel)
    } catch (err) {
      console.error('Failed to update skill:', err)
      alert('Failed to update skill. Please try again.')
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      await deleteSkill(skillId)
    } catch (err) {
      console.error('Failed to delete skill:', err)
      alert('Failed to delete skill. Please try again.')
    }
  }

  const handleEndorseSkill = async (skillId: string, userId: string) => {
    try {
      await endorseSkill(skillId, userId)
    } catch (err) {
      console.error('Failed to endorse skill:', err)
      alert('Failed to endorse skill. Please try again.')
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800'
      case 'intermediate':
        return 'bg-green-100 text-green-800'
      case 'advanced':
        return 'bg-orange-100 text-orange-800'
      case 'expert':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-40">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Skills</h2>
          {isEditable && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {showForm && isEditable && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g., React, Python, Design"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as typeof LEVELS[number])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddSkill}
                  disabled={submitting || !newSkillName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                >
                  {submitting ? 'Adding...' : 'Add Skill'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setNewSkillName('')
                    setNewSkillLevel('beginner')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {skills.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {isEditable ? 'No skills yet. Add your first skill!' : 'No skills added yet.'}
            </p>
          ) : (
            skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{skill.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {skill.endorsements} {skill.endorsements === 1 ? 'endorsement' : 'endorsements'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditable ? (
                    <>
                      <select
                        value={skill.level}
                        onChange={(e) => handleUpdateLevel(skill.id, e.target.value as typeof LEVELS[number])}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                        title="Delete skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEndorseSkill(skill.id, userId || '')}
                      className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100 transition font-medium"
                      disabled={!userId}
                    >
                      Endorse
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {skills.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Total Endorsements:</span> {skills.reduce((sum, s) => sum + s.endorsements, 0)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
