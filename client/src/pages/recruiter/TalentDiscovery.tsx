import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useStudentDiscovery } from '../../hooks/useStudentDiscovery';
import { StudentCard } from '../../components/StudentCard';
import { Search, Filter, X, Loader, AlertCircle } from 'lucide-react';

export function TalentDiscovery() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const {
    students,
    totalCount,
    totalStudents,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    getUniqueValues,
  } = useStudentDiscovery();

  const [showFilters, setShowFilters] = useState(false);

  // Redirect if not authenticated or not recruiter
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'recruiter') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user?.role, navigate]);

  const handleViewProfile = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  const universities = getUniqueValues('university');
  const degrees = getUniqueValues('degree');
  const branches = getUniqueValues('branch');
  const years = getUniqueValues('year_of_study') as number[];

  const hasActiveFilters =
    filters.search ||
    filters.university ||
    filters.degree ||
    filters.branch ||
    filters.yearOfStudy ||
    filters.minRepositories > 0;

  if (!user || user.role !== 'recruiter') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Talent Discovery
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Find talented students with GitHub projects
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* University Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  University
                </label>
                <select
                  value={filters.university}
                  onChange={(e) => updateFilter('university', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Universities</option>
                  {universities.map((uni: any) => (
                    <option key={uni} value={String(uni)}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              {/* Degree Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Degree
                </label>
                <select
                  value={filters.degree}
                  onChange={(e) => updateFilter('degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Degrees</option>
                  {degrees.map((deg: any) => (
                    <option key={deg} value={String(deg)}>
                      {deg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Branch
                </label>
                <select
                  value={filters.branch}
                  onChange={(e) => updateFilter('branch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Branches</option>
                  {branches.map((branch: any) => (
                    <option key={branch} value={String(branch)}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year of Study Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Year of Study
                </label>
                <select
                  value={filters.yearOfStudy}
                  onChange={(e) => updateFilter('yearOfStudy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={String(year)}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* GitHub & Repository Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasGithub"
                  checked={filters.hasGithub}
                  onChange={(e) => updateFilter('hasGithub', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="hasGithub"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Has GitHub Connected
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Min. Repositories
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.minRepositories}
                  onChange={(e) =>
                    updateFilter('minRepositories', parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X size={18} />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{totalStudents}</span>{' '}
            students
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-900 rounded-lg flex gap-3">
            <AlertCircle
              size={20}
              className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader className="animate-spin text-blue-600 dark:text-blue-400" size={40} />
          </div>
        )}

        {/* Students Grid */}
        {!loading && students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student: any) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : !loading && students.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {totalStudents === 0
                ? 'No students found yet.'
                : 'No students match your filters.'}
            </p>
            {totalStudents > 0 && hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TalentDiscovery;
