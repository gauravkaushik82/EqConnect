import { GitHubRepository } from '../hooks/useGithub';
import { Star, GitFork, Eye, Calendar } from 'lucide-react';

interface GithubProjectCardProps {
  project: GitHubRepository;
}

export function GithubProjectCard({ project }: GithubProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {project.name}
          </a>
        </div>
        {project.language && (
          <span className="ml-2 px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {project.language}
          </span>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500" />
          <span>{project.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork size={16} className="text-gray-500" />
          <span>{project.forks.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye size={16} className="text-blue-500" />
          <span>{project.watchers.toLocaleString()}</span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Calendar size={14} />
        <span>Updated {formatDate(project.lastUpdated)}</span>
      </div>
    </div>
  );
}
