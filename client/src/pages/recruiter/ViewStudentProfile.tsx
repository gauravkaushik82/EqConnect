import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { GithubProjectCard } from '../../components/GithubProjectCard';
import { GithubStatsWidget } from '../../components/GithubStatsWidget';
import { SkillsWidget } from '../../components/SkillsWidget';
import { Github, Loader, AlertCircle, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';

interface StudentProfile {
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    github_username: string | null;
    github_avatar_url: string | null;
  };
  profile: {
    university: string | null;
    degree: string | null;
    branch: string | null;
    year_of_study: number | null;
    bio: string | null;
  };
  repositories: any[];
}

export function ViewStudentProfile() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or not recruiter
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'recruiter') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user?.role, navigate]);

  // Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!studentId) return;

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(
          `http://localhost:3001/api/students/${studentId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch student profile'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  if (!user || user.role !== 'recruiter') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {error || 'Student profile not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const student = profile.user;
  const prof = profile.profile;
  const repos = profile.repositories || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button & Message Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft size={20} />
            Back to Talent Discovery
          </button>
          <button
            onClick={() => navigate('/recruiter/messages')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Message Student
          </button>
        </div>

        {/* Student Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {student.avatar_url ? (
                <img
                  src={student.avatar_url}
                  alt={student.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                  {student.full_name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {student.full_name || 'Student'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {student.email}
                </p>

                {/* Academic Info */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {prof?.university && (
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} />
                      <span>{prof.university}</span>
                    </div>
                  )}
                  {prof?.degree && (
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>
                        {prof.degree}
                        {prof.branch && ` - ${prof.branch}`}
                        {prof.year_of_study && ` (Year ${prof.year_of_study})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GitHub Link */}
            {student.github_username && (
              <a
                href={`https://github.com/${student.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Github size={18} />
                Visit GitHub
              </a>
            )}
          </div>

          {/* Bio */}
          {prof?.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">{prof.bio}</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repositories */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              GitHub Repositories ({repos.length})
            </h2>

            {repos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {repos.map((repo) => (
                  <GithubProjectCard key={repo.id} project={repo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Github size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  No GitHub repositories yet
                </p>
              </div>
            )}

            {/* Skills Section */}
            <div className="mt-8">
              <SkillsWidget userId={studentId} isEditable={false} />
            </div>
          </div>

          {/* Sidebar - Stats */}
          {student.github_username && repos.length > 0 && (
            <div>
              <GithubStatsWidget
                stats={{
                  followers: 0,
                  following: 0,
                  publicRepos: repos.length,
                  bio: prof?.bio || null,
                  avatarUrl: student.github_avatar_url,
                  location: null,
                }}
                username={student.github_username}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewStudentProfile;
