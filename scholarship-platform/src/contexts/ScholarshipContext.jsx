import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ScholarshipContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export function ScholarshipProvider({ children }) {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get auth headers
  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
    };
  }, [user]);

  // Fetch Scholarships (Public/Student)
  const fetchScholarships = useCallback(async () => {
    try {
      // Assuming GET /api/student/scholarships is public now based on SecurityConfig
      const response = await fetch(`${API_URL}/student/scholarships`);
      if (response.ok) {
        const data = await response.json();
        setScholarships(data);
      }
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    }
  }, []);

  // Fetch Applications based on user role
  const fetchApplications = useCallback(async () => {
    if (!user) {
      setApplications([]);
      return;
    }
    
    try {
      const endpoint = user.role === 'admin' 
        ? `${API_URL}/admin/applications`
        : `${API_URL}/student/applications`;
        
      const response = await fetch(endpoint, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        // Map backend model to frontend expected structure
        const mappedData = data.map(app => ({
          id: app.id,
          scholarshipId: app.scholarship.id,
          scholarshipName: app.scholarship.title,
          studentId: app.student.id,
          studentName: app.student.name,
          studentEmail: app.student.email,
          appliedDate: app.appliedDate || app.createdAt,
          status: app.status.toLowerCase(),
          gpa: app.gpaAtTime,
          essayTopic: app.essayTopic,
          documents: app.documentsUrl,
          agreeToTerms: app.agreeToTerms
        }));
        setApplications(mappedData);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  }, [user, getHeaders]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchScholarships();
      if (user) {
        await fetchApplications();
      }
      setLoading(false);
    };
    loadData();
  }, [user, fetchScholarships, fetchApplications]);

  const applyForScholarship = useCallback(async (scholarshipId, applicationData) => {
    if (!user) throw new Error('User must be logged in to apply');

    const response = await fetch(`${API_URL}/student/applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        scholarshipId: scholarshipId,
        gpa: parseFloat(applicationData.gpa),
        essayTopic: applicationData.essayTopic,
        documentsUrl: applicationData.documents,
        agreeToTerms: applicationData.agreeToTerms
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Failed to apply for scholarship');
    }

    const data = await response.json();
    await fetchApplications();
    return data;
  }, [user, getHeaders, fetchApplications]);

  const approveApplication = useCallback(async (applicationId) => {
    const response = await fetch(`${API_URL}/admin/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'APPROVED' })
    });
    
    if (response.ok) {
      await fetchApplications();
    }
  }, [getHeaders, fetchApplications]);

  const rejectApplication = useCallback(async (applicationId) => {
    const response = await fetch(`${API_URL}/admin/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'REJECTED' })
    });
    
    if (response.ok) {
      await fetchApplications();
    }
  }, [getHeaders, fetchApplications]);

  const addScholarship = useCallback(async (scholarshipData) => {
    const payload = {
      title: scholarshipData.name || scholarshipData.title,
      provider: scholarshipData.provider || 'Unknown Provider',
      category: scholarshipData.category || 'General',
      amount: parseFloat(scholarshipData.amount),
      description: scholarshipData.description,
      fullDescription: scholarshipData.fullDescription,
      requirements: Array.isArray(scholarshipData.requirements) ? scholarshipData.requirements.join('\n') : scholarshipData.requirements,
      eligibility: Array.isArray(scholarshipData.eligibility) ? scholarshipData.eligibility.join('\n') : scholarshipData.eligibility,
      deadline: scholarshipData.deadline,
      status: 'ACTIVE'
    };

    const response = await fetch(`${API_URL}/admin/scholarships`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      await fetchScholarships();
    }
  }, [getHeaders, fetchScholarships]);

  const updateScholarship = useCallback(async (scholarshipData) => {
    const payload = {
      title: scholarshipData.name || scholarshipData.title,
      provider: scholarshipData.provider,
      category: scholarshipData.category,
      amount: parseFloat(scholarshipData.amount),
      description: scholarshipData.description,
      fullDescription: scholarshipData.fullDescription,
      requirements: Array.isArray(scholarshipData.requirements) ? scholarshipData.requirements.join('\n') : scholarshipData.requirements,
      eligibility: Array.isArray(scholarshipData.eligibility) ? scholarshipData.eligibility.join('\n') : scholarshipData.eligibility,
      deadline: scholarshipData.deadline,
      status: scholarshipData.status || 'ACTIVE'
    };

    const response = await fetch(`${API_URL}/admin/scholarships/${scholarshipData.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      await fetchScholarships();
    }
  }, [getHeaders, fetchScholarships]);

  const deleteScholarship = useCallback(async (scholarshipId) => {
    const response = await fetch(`${API_URL}/admin/scholarships/${scholarshipId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (response.ok) {
      await fetchScholarships();
    }
  }, [getHeaders, fetchScholarships]);

  // Derived state for the UI
  const getAppliedScholarships = useCallback(() => {
    if (!user) return [];
    const userApplications = applications.filter(app => app.studentId === user.id);
    return scholarships.filter(s => userApplications.some(app => app.scholarshipId === s.id));
  }, [scholarships, applications, user]);

  const getApplicationStatus = useCallback((scholarshipId) => {
    if (!user) return null;
    return applications.find(app => app.scholarshipId === scholarshipId && app.studentId === user.id);
  }, [applications, user]);

  const isApplied = useCallback((scholarshipId) => {
    if (!user) return false;
    return applications.some(app => app.scholarshipId === scholarshipId && app.studentId === user.id);
  }, [applications, user]);

  return (
    <ScholarshipContext.Provider
      value={{
        scholarships,
        applications, // Note: The UI previously used 'appliedScholarships' for student, but we can compute it
        appliedScholarships: user?.role === 'student' ? applications : [],
        addScholarship,
        updateScholarship,
        deleteScholarship,
        applyForScholarship,
        approveApplication,
        rejectApplication,
        getAppliedScholarships,
        getApplicationStatus,
        isApplied,
        loading
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
}

export function useScholarship() {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error('useScholarship must be used within ScholarshipProvider');
  }
  return context;
}
