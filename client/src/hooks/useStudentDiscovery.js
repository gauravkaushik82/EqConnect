import { useState, useEffect, useCallback } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export function useStudentDiscovery() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        university: '',
        degree: '',
        branch: '',
        yearOfStudy: '',
        hasGithub: true,
        minRepositories: 0,
    });
    // Fetch students from backend
    const fetchStudents = useCallback(async () => {
        const token = localStorage.getItem('auth_token');
        if (!token)
            return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch students: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success) {
                setStudents(data.data || []);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch students');
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Apply filters to students
    useEffect(() => {
        let filtered = [...students];
        // Filter by search (name or email)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter((s) => s.full_name?.toLowerCase().includes(searchLower) ||
                s.email.toLowerCase().includes(searchLower));
        }
        // Filter by university
        if (filters.university) {
            filtered = filtered.filter((s) => s.university === filters.university);
        }
        // Filter by degree
        if (filters.degree) {
            filtered = filtered.filter((s) => s.degree === filters.degree);
        }
        // Filter by branch
        if (filters.branch) {
            filtered = filtered.filter((s) => s.branch === filters.branch);
        }
        // Filter by year of study
        if (filters.yearOfStudy) {
            filtered = filtered.filter((s) => s.year_of_study === parseInt(filters.yearOfStudy));
        }
        // Filter by GitHub connection
        if (filters.hasGithub) {
            filtered = filtered.filter((s) => s.github_username !== null);
        }
        // Filter by minimum repositories
        if (filters.minRepositories > 0) {
            filtered = filtered.filter((s) => s.repositories_count >= filters.minRepositories);
        }
        // Sort by repositories count (descending)
        filtered.sort((a, b) => b.repositories_count - a.repositories_count);
        setFilteredStudents(filtered);
    }, [students, filters]);
    // Update single filter
    const updateFilter = useCallback((key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);
    // Clear all filters
    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            university: '',
            degree: '',
            branch: '',
            yearOfStudy: '',
            hasGithub: true,
            minRepositories: 0,
        });
    }, []);
    // Get unique values for filters
    const getUniqueValues = useCallback((key) => {
        const values = students
            .map((s) => s[key])
            .filter((v) => v !== null && v !== undefined);
        return [...new Set(values)].sort();
    }, [students]);
    // Load students on mount
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);
    return {
        students: filteredStudents,
        totalCount: filteredStudents.length,
        totalStudents: students.length,
        loading,
        error,
        filters,
        updateFilter,
        clearFilters,
        getUniqueValues,
        fetchStudents,
    };
}
