import { StudentWithGithub } from '../hooks/useStudentDiscovery';
import { Github, BookOpen, GraduationCap } from 'lucide-react';

interface StudentCardProps {
  student: StudentWithGithub;
  onViewProfile: (studentId: string) => void;
}

export function StudentCard({ student, onViewProfile }: StudentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {student.avatar_url ? (
            <img
              src={student.avatar_url}
              alt={student.full_name || 'Student'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {student.full_name?.charAt(0) || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {student.full_name || 'Unnamed Student'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {student.email}
            </p>
          </div>
        </div>

        {student.github_username && (
          <a
            href={`https://github.com/${student.github_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View GitHub Profile"
          >
            <Github size={24} />
          </a>
        )}
      </div>

      {/* Student Info */}
      <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
        {student.university && (
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="flex-shrink-0" />
            <span>{student.university}</span>
          </div>
        )}

        {student.degree && (
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="flex-shrink-0" />
            <span>
              {student.degree}
              {student.branch && ` - ${student.branch}`}
              {student.year_of_study && ` (Year ${student.year_of_study})`}
            </span>
          </div>
        )}
      </div>

      {/* GitHub Stats */}
      {student.github_username && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Github size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              {student.github_username}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {student.repositories_count} public {student.repositories_count === 1 ? 'repository' : 'repositories'}
          </div>
        </div>
      )}

      {/* Bio */}
      {student.bio && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {student.bio}
        </p>
      )}

      {/* Action Button */}
      <button
        onClick={() => onViewProfile(student.id)}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Full Profile
      </button>
    </div>
  );
}
