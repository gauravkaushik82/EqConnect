import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export interface GitHubRepository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  lastUpdated: string;
}

export interface GitHubStats {
  followers: number;
  following: number;
  publicRepos: number;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
}

export interface GitHubUser {
  id: string;
  username: string;
  connected: boolean;
  repositories: GitHubRepository[];
  stats: GitHubStats | null;
}

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001';

export function useGithub() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);

  // Get token from localStorage
  const getToken = useCallback(() => {
    return localStorage.getItem('auth_token');
  }, []);

  // Fetch GitHub repositories for authenticated user
  const fetchRepositories = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/github/repositories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setGithubUser((prev) => ({
          ...prev!,
          repositories: data.data || [],
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Fetch GitHub stats for authenticated user
  const fetchStats = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/github/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setGithubUser((prev) => ({
          ...prev!,
          stats: data.data,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub stats');
    }
  }, [getToken]);

  // Sync repositories from GitHub
  const syncRepositories = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/github/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to sync repositories: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchRepositories();
        return data.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync repositories');
    } finally {
      setLoading(false);
    }
  }, [getToken, fetchRepositories]);

  // Get GitHub OAuth URL
  const getGitHubAuthUrl = useCallback(() => {
    return `${API_BASE}/api/github/connect`;
  }, []);

  // Link GitHub account with token from OAuth
  const linkGitHubAccount = useCallback(
    async (githubToken: string) => {
      const token = getToken();
      if (!token) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/api/github/link`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ githubToken }),
        });

        if (!response.ok) {
          throw new Error(`Failed to link GitHub account: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setGithubUser({
            id: data.data.github_id,
            username: data.data.github_username,
            connected: true,
            repositories: [],
            stats: null,
          });
          // Auto-sync after linking
          await syncRepositories();
          return true;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to link GitHub account');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getToken, syncRepositories]
  );

  // Disconnect GitHub account
  const disconnectGitHub = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/github/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to disconnect GitHub: ${response.statusText}`);
      }

      setGithubUser(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect GitHub');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Load GitHub data on mount if user is authenticated and has GitHub connected
  useEffect(() => {
    if (user?.github_username) {
      fetchRepositories();
      fetchStats();
    }
  }, [user?.github_username, fetchRepositories, fetchStats]);

  return {
    githubUser,
    loading,
    error,
    fetchRepositories,
    fetchStats,
    syncRepositories,
    linkGitHubAccount,
    disconnectGitHub,
    getGitHubAuthUrl,
  };
}
