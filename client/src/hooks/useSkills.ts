import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
  added_at: string;
}

export interface SkillsData {
  skills: Skill[];
  total_endorsements: number;
}

export function useSkills() {
  const { user } = useAuthStore();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch skills for authenticated user
  const fetchSkills = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/skills`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch skills: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setSkills(data.data.skills || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new skill
  const addSkill = useCallback(
    async (name: string, level: Skill['level']) => {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/api/skills`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, level }),
        });

        if (!response.ok) {
          throw new Error(`Failed to add skill: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setSkills((prev) => [...prev, data.data]);
          return true;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add skill');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update skill level
  const updateSkill = useCallback(
    async (skillId: string, level: Skill['level']) => {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      try {
        const response = await fetch(`${API_BASE}/api/skills/${skillId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ level }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update skill: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setSkills((prev) =>
            prev.map((s) => (s.id === skillId ? data.data : s))
          );
          return true;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update skill');
        return false;
      }
    },
    []
  );

  // Delete skill
  const deleteSkill = useCallback(async (skillId: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE}/api/skills/${skillId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete skill: ${response.statusText}`);
      }

      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill');
      return false;
    }
  }, []);

  // Endorse a skill (for recruiters viewing profile)
  const endorseSkill = useCallback(async (skillId: string, userId: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const response = await fetch(
        `${API_BASE}/api/skills/${skillId}/endorse`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to endorse skill: ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.success) {
        // Update local skill endorsements
        setSkills((prev) =>
          prev.map((s) =>
            s.id === skillId ? { ...s, endorsements: s.endorsements + 1 } : s
          )
        );
        return true;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to endorse skill'
      );
      return false;
    }
  }, []);

  // Load skills on mount
  useEffect(() => {
    if (user?.id) {
      fetchSkills();
    }
  }, [user?.id, fetchSkills]);

  return {
    skills,
    loading,
    error,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    endorseSkill,
  };
}
