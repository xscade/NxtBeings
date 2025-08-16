import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api';

export type AccountType = 'applicant' | 'recruiter' | 'admin';

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
  logout: () => void;
  login: (userData: any, authToken: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accountType, setAccountType] = useState<AccountType>('applicant');
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to clear all data
  const clearAllData = useCallback(() => {
    console.log('=== CLEARING ALL DATA ===');
    setUser(null);
    setToken(null);
    setDashboardData(null);
    setAccountType('applicant');
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('dashboardData');
    apiService.setToken(null);
    console.log('=== DATA CLEARED ===');
  }, []);

  // Logout function
  const logout = useCallback(() => {
    console.log('Logging out');
    clearAllData();
    window.location.href = '/';
  }, [clearAllData]);

  // Login function - completely rewritten for stability
  const login = useCallback(async (userData: any, authToken: string) => {
    try {
      console.log('=== LOGIN START ===');
      console.log('Logging in user:', userData.email);
      
      // Set authentication state immediately
      setIsAuthenticated(true);
      setUser(userData);
      setToken(authToken);
      setAccountType(userData.userType);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      
      // Update API service token
      apiService.setToken(authToken);
      
      console.log('=== LOGIN COMPLETE ===');
      
      // Fetch dashboard data in background (don't await)
      fetchDashboardData(userData.userType, userData.id).catch(console.error);
      
    } catch (error) {
      console.error('Error during login:', error);
      clearAllData();
      throw error;
    }
  }, [clearAllData]);

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async (userType: string, userId: string) => {
    try {
      console.log('Fetching dashboard data for:', { userType, userId });
      
      let data;
      if (userType === 'applicant') {
        data = await apiService.getApplicantDashboard(userId);
      } else if (userType === 'recruiter') {
        data = await apiService.getRecruiterDashboard(userId);
      }
      
      if (data) {
        setDashboardData(data as any);
        localStorage.setItem('dashboardData', JSON.stringify(data));
        console.log('Dashboard data updated successfully');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  // Initialize app on mount - only run once
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('=== APP INITIALIZATION START ===');
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        const savedDashboardData = localStorage.getItem('dashboardData');
        
        if (savedUser && savedToken) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log('Found saved session for:', parsedUser.email);
            
            // Set initial state from localStorage immediately
            setUser(parsedUser);
            setToken(savedToken);
            setAccountType(parsedUser.userType);
            setIsAuthenticated(true);
            apiService.setToken(savedToken);
            
            if (savedDashboardData) {
              try {
                setDashboardData(JSON.parse(savedDashboardData));
              } catch (error) {
                console.error('Error parsing saved dashboard data:', error);
                localStorage.removeItem('dashboardData');
              }
            }
            
            // Validate token in background
            try {
              const response = await fetch(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:3001'}/api/auth/validate`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${savedToken}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                const userData = await response.json();
                console.log('Token validated successfully');
                
                // Update with fresh data
                setUser(userData.user);
                setAccountType(userData.user.userType);
                localStorage.setItem('user', JSON.stringify(userData.user));
                
                // Fetch fresh dashboard data
                fetchDashboardData(userData.user.userType, userData.user.id).catch(console.error);
              } else {
                console.log('Token validation failed, clearing session');
                clearAllData();
              }
            } catch (error) {
              console.error('Error validating token:', error);
              // Keep the session on network errors
            }
            
          } catch (error) {
            console.error('Error parsing saved user data:', error);
            clearAllData();
          }
        } else {
          console.log('No saved session found');
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
        clearAllData();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('=== APP INITIALIZATION COMPLETE ===');
      }
    };

    initializeApp();
  }, []); // Empty dependency array - only run once

  // Save user data to localStorage when it changes (only after initialization)
  useEffect(() => {
    if (isInitialized && user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user, isInitialized]);

  // Save token to localStorage when it changes (only after initialization)
  useEffect(() => {
    if (isInitialized && token) {
      localStorage.setItem('token', token);
      apiService.setToken(token);
    }
  }, [token, isInitialized]);

  // Save dashboard data to localStorage when it changes (only after initialization)
  useEffect(() => {
    if (isInitialized && dashboardData) {
      localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    }
  }, [dashboardData, isInitialized]);

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
    setToken,
    logout,
    login,
    isAuthenticated
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
