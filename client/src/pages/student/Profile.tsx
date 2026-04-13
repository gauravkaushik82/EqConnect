import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useGithub } from '../../hooks/useGithub';
import { GithubProjectCard } from '../../components/GithubProjectCard';
import { GithubStatsWidget } from '../../components/GithubStatsWidget';
import { SkillsWidget } from '../../components/SkillsWidget';
import { Github, Loader, AlertCircle, Trash2, RefreshCw, MessageCircle } from 'lucide-react';

export function StudentProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { githubUser, loading, error, syncRepositories, disconnectGitHub } = useGithub();
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle GitHub OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('github_token');
    
    if (token) {
      // Token from OAuth callback - link account automatically
      // The useGithub hook will auto-sync
      window.history.replaceState({}, document.title, '/profile');
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Quick Actions */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => navigate('/student/messages')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <MessageCircle size={18} />
            Messages
          </button>
        </div>

        {/* User Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.full_name || 'Student'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {user.role === 'student' ? 'Student' : 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {!user.github_username ? (
              // Not Connected
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <Github size={48} className="mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Connect GitHub
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Showcase your GitHub projects and repositories to recruiters on your profile.
                </p>
                <a
                  href={`http://localhost:3001/api/github/connect`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Github size={20} />
                  Connect GitHub Account
                </a>
              </div>
            ) : (
              // Connected - Show Repositories
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    GitHub Repositories
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => syncRepositories()}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                      Sync
                    </button>
                    <button
                      onClick={() => setShowDisconnectConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <Trash2 size={16} />
                      Disconnect
                    </button>
                  </div>
                </div>

                {/* Disconnect Confirmation Modal */}
                {showDisconnectConfirm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Disconnect GitHub?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This will remove all your GitHub repositories from your profile. You can reconnect anytime.
                      </p>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setShowDisconnectConfirm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            await disconnectGitHub();
                            setShowDisconnectConfirm(false);
                          }}
                          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-900 rounded-lg flex gap-3">
                    <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="animate-spin text-blue-600" size={32} />
                  </div>
                )}

                {/* Repositories Grid */}
                {!loading && githubUser?.repositories && githubUser.repositories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {githubUser.repositories.map((repo) => (
                      <GithubProjectCard key={repo.id} project={repo} />
                    ))}
                  </div>
                ) : !loading ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">
                      No repositories found. Try syncing your GitHub profile.
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Skills Section */}
            <div className="mt-8">
              <SkillsWidget isEditable={true} />
            </div>
          </div>

          {/* Sidebar - Stats */}
          {user.github_username && githubUser?.stats && (
            <div>
              <GithubStatsWidget stats={githubUser.stats} username={user.github_username} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
