import { useState, useCallback } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_URL = `${API_BASE}/api/verification`;
// Helper function to detect document type
function detectDocumentType(fileName) {
    const lower = fileName.toLowerCase();
    if (lower.includes('ugc'))
        return 'ugc_recognition';
    if (lower.includes('accredit'))
        return 'accreditation_certificate';
    if (lower.includes('degree'))
        return 'degree_certificate';
    return 'other';
}
export function useVerification() {
    const [status, setStatus] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    /**
     * Fetch current verification status
     */
    const fetchVerificationStatus = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok)
                throw new Error('Failed to fetch verification status');
            const data = await response.json();
            setStatus(data);
            setError(null);
            return data;
        }
        catch (err) {
            setError(err.message);
            return null;
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    /**
     * Submit verification documents (base64 encoded)
     */
    const submitDocuments = useCallback(async (files, universityName) => {
        try {
            setLoading(true);
            // Convert files to base64
            const documentsData = await Promise.all(files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            base64Data: reader.result,
                            fileName: file.name,
                            fileSize: file.size,
                            mimeType: file.type,
                            type: detectDocumentType(file.name)
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }));
            const response = await fetch(`${API_URL}/submit-documents`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    universityName,
                    documents: documentsData
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit documents');
            }
            const data = await response.json();
            await fetchVerificationStatus();
            setError(null);
            return data;
        }
        catch (err) {
            setError(err.message);
            return null;
        }
        finally {
            setLoading(false);
        }
    }, [token, fetchVerificationStatus]);
    /**
     * Resubmit documents after rejection
     */
    const resubmitDocuments = useCallback(async (files) => {
        try {
            setLoading(true);
            // Convert files to base64
            const documentsData = await Promise.all(files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            base64Data: reader.result,
                            fileName: file.name,
                            fileSize: file.size,
                            mimeType: file.type,
                            type: detectDocumentType(file.name)
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }));
            const response = await fetch(`${API_URL}/resubmit-documents`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documents: documentsData
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to resubmit documents');
            }
            const data = await response.json();
            await fetchVerificationStatus();
            setError(null);
            return data;
        }
        catch (err) {
            setError(err.message);
            return null;
        }
        finally {
            setLoading(false);
        }
    }, [token, fetchVerificationStatus]);
    /**
     * Fetch verification notifications
     */
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/verification/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok)
                throw new Error('Failed to fetch notifications');
            const data = await response.json();
            setNotifications(data.notifications || []);
            setError(null);
            return data.notifications;
        }
        catch (err) {
            setError(err.message);
            return [];
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    /**
     * Get pending verifications (admin only)
     */
    const getPendingVerifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/verification/pending-verifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok)
                throw new Error('Failed to fetch pending verifications');
            const data = await response.json();
            setError(null);
            return data;
        }
        catch (err) {
            setError(err.message);
            return null;
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    /**
     * Approve university verification (admin only)
     */
    const approveVerification = useCallback(async (userId, notes) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/verification/approve`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, notes })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to approve verification');
            }
            const data = await response.json();
            setError(null);
            return data;
        }
        catch (err) {
            setError(err.message);
            return null;
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    /**
     * Reject university verification (admin only)
     */
    const rejectVerification = useCallback(async (userId, reason) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/verification/reject`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, reason })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reject verification');
            }
            const data = await response.json();
            setError(null);
            return data;
        }
        catch (err) {
            setError(err.message);
            return null;
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    return {
        status,
        notifications,
        loading,
        error,
        fetchVerificationStatus,
        submitDocuments,
        resubmitDocuments,
        fetchNotifications,
        getPendingVerifications,
        approveVerification,
        rejectVerification
    };
}
