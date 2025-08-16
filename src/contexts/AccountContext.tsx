import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type AccountType = 'applicant' | 'recruiter';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  currentRole: string;
  userType: AccountType;
  company?: {
    name: string;
    industry: string;
    size: string;
  };
}

interface DashboardData {
  profile: {
    name: string;
    email: string;
    avatar?: string;
    headline?: string;
    currentRole: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    profileCompletion: number;
  };
  stats: {
    applicationsSubmitted?: number;
    interviewsScheduled?: number;
    offersReceived?: number;
    profileViews?: number;
    totalJobPostings?: number;
    activeJobPostings?: number;
    totalApplications?: number;
    hiresMade?: number;
    totalSkills?: number;
    completedProjects?: number;
    ongoingProjects?: number;
    yearsOfExperience?: number;
  };
  skills?: {
    technical: Array<{
      name: string;
      level: string;
      yearsOfExperience: number;
    }>;
    ai: Array<{
      name: string;
      level: string;
      yearsOfExperience: number;
    }>;
    soft: string[];
  };
  recentActivity?: Array<{
    type: string;
    title: string;
    timestamp: Date;
    status: string;
  }>;
  recommendedJobs?: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    skills: string[];
    matchScore: number;
  }>;
  recentApplications?: Array<{
    id: string;
    applicantName: string;
    jobTitle: string;
    appliedAt: Date;
    status: string;
    matchScore: number;
  }>;
  topPerformingJobs?: Array<{
    id: string;
    title: string;
    applications: number;
    views: number;
    status: string;
  }>;
  analytics?: {
    monthlyViews: Array<{ month: string; views: number }>;
    monthlyApplications: Array<{ month: string; applications: number }>;
  };
  quickActions: Array<{
    title: string;
    action: string;
    icon: string;
  }>;
}

interface AccountContextType {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accountType, setAccountType] = useState<AccountType>('applicant');
  const [user, setUser] = useState<User | null>({
    id: '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah@nxtbeings.com',
    avatar: 'SC',
    currentRole: 'AI-First Developer',
    userType: 'applicant'
  });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Save token to localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const value = {
    accountType,
    setAccountType,
    user,
    setUser,
    dashboardData,
    setDashboardData,
    isLoading,
    setIsLoading,
    token,
    setToken
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
