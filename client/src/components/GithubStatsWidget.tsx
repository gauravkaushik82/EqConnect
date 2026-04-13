import { GitHubStats } from '../hooks/useGithub';
import { BookOpen, MapPin } from 'lucide-react';

interface GithubStatsWidgetProps {
  stats: GitHubStats;
  username: string;
}

export function GithubStatsWidget({ stats, username }: GithubStatsWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub Stats</h3>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        >
          View Profile
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.followers}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.following}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.publicRepos}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Repos</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {stats.bio && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">{stats.bio}</p>
          </div>
        )}
        {stats.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={16} />
            <span>{stats.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <BookOpen size={16} />
          <span className="text-blue-600 dark:text-blue-400">
            <a
              href={`https://github.com/${username}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              View all repositories
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
