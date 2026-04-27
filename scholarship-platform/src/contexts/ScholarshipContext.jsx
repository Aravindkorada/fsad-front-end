import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ScholarshipContext = createContext();

// Mock scholarship data
const mockScholarships = [
  {
    id: 1,
    name: 'Tech Innovators Scholarship',
    provider: 'Tech Foundation',
    title: 'Tech Innovators Scholarship',
    category: 'Technology',
    amount: 5000,
    description: 'Support for students pursuing technology and innovation.',
    fullDescription: 'A comprehensive scholarship program designed to support talented students in the technology sector. This award recognizes academic excellence and innovative projects.',
    requirements: ['GPA >= 3.5', 'Pursuing CS/IT degree', 'US Citizen or Permanent Resident'],
    eligibility: ['GPA >= 3.5', 'Pursuing CS/IT degree', 'US Citizen or Permanent Resident'],
    deadline: '2026-09-30',
    daysLeft: 135,
    status: 'active',
  },
  {
    id: 2,
    name: 'Global Leaders Grant',
    provider: 'Global Leadership Institute',
    title: 'Global Leaders Grant',
    category: 'Leadership',
    amount: 7500,
    description: 'Funding for future global leaders in public policy.',
    fullDescription: 'This grant supports students demonstrating exceptional leadership potential and commitment to public service.',
    requirements: ['GPA >= 3.3', 'Leadership experience required', 'Essay submission'],
    eligibility: ['GPA >= 3.3', 'Leadership experience required', 'Essay submission'],
    deadline: '2026-10-15',
    daysLeft: 151,
    status: 'active',
  },
  {
    id: 3,
    name: 'STEM Excellence Award',
    provider: 'STEM Foundation',
    title: 'STEM Excellence Award',
    category: 'STEM',
    amount: 6000,
    description: 'Award for outstanding achievements in STEM fields.',
    fullDescription: 'Recognizing excellence in Science, Technology, Engineering, and Mathematics. This award supports groundbreaking research and academic pursuits.',
    requirements: ['GPA >= 3.7', 'STEM major required', 'Research project or portfolio'],
    eligibility: ['GPA >= 3.7', 'STEM major required', 'Research project or portfolio'],
    deadline: '2026-08-20',
    daysLeft: 83,
    status: 'active',
  },
  {
    id: 4,
    name: 'Arts & Culture Fellowship',
    provider: 'Arts Council',
    title: 'Arts & Culture Fellowship',
    category: 'Arts',
    amount: 4500,
    description: 'Encourages creative arts and cultural projects.',
    fullDescription: 'Supporting creativity and cultural expression through funding for artistic endeavors.',
    requirements: ['Portfolio submission', 'Demonstrated artistic talent', 'Any GPA'],
    eligibility: ['Portfolio submission', 'Demonstrated artistic talent', 'Any GPA'],
    deadline: '2026-11-01',
    daysLeft: 167,
    status: 'active',
  },
  {
    id: 5,
    name: 'Women in Engineering Scholarship',
    provider: 'Engineering Society',
    title: 'Women in Engineering Scholarship',
    category: 'Engineering',
    amount: 8000,
    description: 'Empowering women pursuing engineering careers.',
    fullDescription: 'Dedicated to supporting women in engineering disciplines with full scholarships and mentorship.',
    requirements: ['Female applicants', 'Engineering major', 'GPA >= 3.4'],
    eligibility: ['Female applicants', 'Engineering major', 'GPA >= 3.4'],
    deadline: '2026-09-10',
    daysLeft: 115,
    status: 'active',
  },
  {
    id: 6,
    name: 'Community Service Grant',
    provider: 'Community Foundation',
    title: 'Community Service Grant',
    category: 'Community Service',
    amount: 3500,
    description: 'Supports students dedicated to community service.',
    fullDescription: 'For students with demonstrated commitment to serving their communities.',
    requirements: ['200+ hours volunteer work', 'Community leader references', 'Any major'],
    eligibility: ['200+ hours volunteer work', 'Community leader references', 'Any major'],
    deadline: '2026-12-05',
    daysLeft: 211,
    status: 'active',
  },
  {
    id: 7,
    name: 'Environmental Sustainability Award',
    provider: 'Green Future Foundation',
    title: 'Environmental Sustainability Award',
    category: 'Environment',
    amount: 5500,
    description: 'Funding for projects promoting sustainability.',
    fullDescription: 'Supporting students working on environmental solutions and sustainability projects.',
    requirements: ['Environment/Sustainability focus', 'Project proposal', 'GPA >= 3.2'],
    eligibility: ['Environment/Sustainability focus', 'Project proposal', 'GPA >= 3.2'],
    deadline: '2026-10-30',
    daysLeft: 166,
    status: 'active',
  },
  {
    id: 8,
    name: 'Entrepreneurship Seed Fund',
    provider: 'Innovation Hub',
    title: 'Entrepreneurship Seed Fund',
    category: 'Business',
    amount: 10000,
    description: 'Seed funding for student startups.',
    fullDescription: 'Supporting student entrepreneurs with capital and mentorship for their startup ventures.',
    requirements: ['Business plan required', 'Startup team of 2+', 'Any GPA'],
    eligibility: ['Business plan required', 'Startup team of 2+', 'Any GPA'],
    deadline: '2026-09-25',
    daysLeft: 130,
    status: 'active',
  },
  {
    id: 9,
    name: 'Medical Research Scholarship',
    provider: 'Medical Research Foundation',
    title: 'Medical Research Scholarship',
    category: 'Medical',
    amount: 9000,
    description: 'Supports research in medical sciences.',
    fullDescription: 'Funding for students pursuing medical research and development.',
    requirements: ['Pre-med or Medical student', 'Research experience', 'GPA >= 3.6'],
    eligibility: ['Pre-med or Medical student', 'Research experience', 'GPA >= 3.6'],
    deadline: '2026-11-20',
    daysLeft: 186,
    status: 'active',
  },
  {
    id: 10,
    name: 'International Study Grant',
    provider: 'Global Education Fund',
    title: 'International Study Grant',
    category: 'Education',
    amount: 6500,
    description: 'Enables study abroad experiences.',
    fullDescription: 'Making international education accessible to deserving students.',
    requirements: ['Study abroad approved program', 'GPA >= 3.3', 'Language proficiency'],
    eligibility: ['Study abroad approved program', 'GPA >= 3.3', 'Language proficiency'],
    deadline: '2026-12-15',
    daysLeft: 221,
    status: 'active',
  },
];

// Mock scholarship applications data
const mockApplications = [
  {
    id: 1,
    studentId: 1,
    studentName: 'John Doe',
    studentEmail: 'john.doe@email.com',
    scholarshipId: 1,
    scholarshipName: 'Tech Innovators Scholarship',
    appliedDate: '2026-04-01',
    status: 'pending',
    gpa: 3.8,
    major: 'Computer Science',
    essay: 'I am passionate about technology and innovation...',
    documents: ['transcript.pdf', 'recommendation.pdf']
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Jane Smith',
    studentEmail: 'jane.smith@email.com',
    scholarshipId: 2,
    scholarshipName: 'Global Leaders Grant',
    appliedDate: '2026-04-02',
    status: 'approved',
    gpa: 3.9,
    major: 'Political Science',
    essay: 'My goal is to become a leader in public policy...',
    documents: ['transcript.pdf', 'leadership_awards.pdf']
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Mike Johnson',
    studentEmail: 'mike.johnson@email.com',
    scholarshipId: 3,
    scholarshipName: 'STEM Excellence Award',
    appliedDate: '2026-04-03',
    status: 'rejected',
    gpa: 3.6,
    major: 'Engineering',
    essay: 'I have always been fascinated by engineering...',
    documents: ['transcript.pdf', 'research_paper.pdf']
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@email.com',
    scholarshipId: 1,
    scholarshipName: 'Tech Innovators Scholarship',
    appliedDate: '2026-04-04',
    status: 'pending',
    gpa: 3.7,
    major: 'Information Technology',
    essay: 'Technology has the power to change the world...',
    documents: ['transcript.pdf', 'project_portfolio.pdf']
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'David Brown',
    studentEmail: 'david.brown@email.com',
    scholarshipId: 4,
    scholarshipName: 'Arts & Culture Fellowship',
    appliedDate: '2026-04-05',
    status: 'pending',
    gpa: 3.5,
    major: 'Fine Arts',
    essay: 'Art is my passion and my voice...',
    documents: ['transcript.pdf', 'art_portfolio.pdf']
  }
];

export function ScholarshipProvider({ children }) {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState(() => {
    const saved = localStorage.getItem('scholarships');
    return saved ? JSON.parse(saved) : mockScholarships;
  });
  const [appliedScholarships, setAppliedScholarships] = useState(() => {
    const saved = localStorage.getItem('appliedScholarships');
    return saved ? JSON.parse(saved) : [];
  });
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : mockApplications;
  });

  // Initialize sample applications for student user on first load
  useEffect(() => {
    if (user && user.role === 'student') {
      const stored = localStorage.getItem('appliedScholarships');
      if (!stored) {
        const sampleApplications = [
          {
            id: 1001,
            scholarshipId: 1,
            studentId: user.id,
            studentName: user.name,
            studentEmail: user.email,
            appliedDate: '2026-04-01',
            status: 'pending',
            fullName: user.name,
            email: user.email,
            phone: '(555) 123-4567',
            gpa: '3.8',
            essayTopic: 'How technology can solve real-world problems',
            documents: 'transcript.pdf, recommendation.pdf',
            agreeToTerms: true,
          },
          {
            id: 1002,
            scholarshipId: 2,
            studentId: user.id,
            studentName: user.name,
            studentEmail: user.email,
            appliedDate: '2026-04-02',
            status: 'approved',
            fullName: user.name,
            email: user.email,
            phone: '(555) 123-4567',
            gpa: '3.9',
            essayTopic: 'My vision for global leadership',
            documents: 'transcript.pdf, leadership_awards.pdf',
            agreeToTerms: true,
          }
        ];
        setAppliedScholarships(sampleApplications);
        localStorage.setItem('appliedScholarships', JSON.stringify(sampleApplications));
      }
    }
  }, [user?.id]);

  const applyForScholarship = useCallback(
    (scholarshipId, applicationData) => {
      if (!user) {
        throw new Error('User must be logged in to apply for scholarships');
      }

      const scholarship = scholarships.find((s) => s.id.toString() === scholarshipId.toString());

      const newApplication = {
        id: Date.now(),
        scholarshipId,
        scholarshipName: scholarship ? (scholarship.title || scholarship.name) : 'Unknown Scholarship',
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        ...applicationData,
        appliedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        status: 'pending',
      };

      setAppliedScholarships((prev) => {
        const updated = [...prev, newApplication];
        localStorage.setItem('appliedScholarships', JSON.stringify(updated));
        return updated;
      });

      setApplications((prev) => {
        const updated = [...prev, newApplication];
        localStorage.setItem('applications', JSON.stringify(updated));
        return updated;
      });

      return newApplication;
    },
    [user, scholarships]
  );

  const approveApplication = useCallback((applicationId) => {
    setApplications(prev => {
      const updated = prev.map(app =>
        app.id === applicationId
          ? { ...app, status: 'approved' }
          : app
      );
      localStorage.setItem('applications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const rejectApplication = useCallback((applicationId) => {
    setApplications(prev => {
      const updated = prev.map(app =>
        app.id === applicationId
          ? { ...app, status: 'rejected' }
          : app
      );
      localStorage.setItem('applications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addScholarship = useCallback((scholarshipData) => {
    setScholarships(prev => {
      const updated = [...prev, scholarshipData];
      localStorage.setItem('scholarships', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateScholarship = useCallback((scholarshipData) => {
    setScholarships(prev => {
      const updated = prev.map(s => s.id === scholarshipData.id ? scholarshipData : s);
      localStorage.setItem('scholarships', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteScholarship = useCallback((scholarshipId) => {
    setScholarships(prev => {
      const updated = prev.filter(s => s.id !== scholarshipId);
      localStorage.setItem('scholarships', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getAppliedScholarships = useCallback(() => {
    if (!user) return [];
    return scholarships.filter((s) =>
      appliedScholarships.some((app) => app.scholarshipId === s.id && app.studentId === user.id)
    );
  }, [scholarships, appliedScholarships, user]);

  const getApplicationStatus = useCallback(
    (scholarshipId) => {
      if (!user) return null;
      return appliedScholarships.find((app) => app.scholarshipId === scholarshipId && app.studentId === user.id);
    },
    [appliedScholarships, user]
  );

  const isApplied = useCallback(
    (scholarshipId) => {
      if (!user) return false;
      return appliedScholarships.some((app) => app.scholarshipId === scholarshipId && app.studentId === user.id);
    },
    [appliedScholarships, user]
  );

  return (
    <ScholarshipContext.Provider
      value={{
        scholarships,
        appliedScholarships,
        applications,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        applyForScholarship,
        approveApplication,
        rejectApplication,
        getAppliedScholarships,
        getApplicationStatus,
        isApplied,
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
