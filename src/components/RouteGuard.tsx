import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from '@/contexts/AccountContext';

import { AccountType } from '@/contexts/AccountContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredUserType?: AccountType;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { user, token, isLoading, isAuthenticated } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !token || !user) {
      console.log('Not authenticated, redirecting to login');
      navigate('/', { replace: true });
      return;
    }

    // If user type is required and doesn't match, redirect to appropriate dashboard
    if (requiredUserType && user.userType !== requiredUserType) {
      console.log(`User type mismatch. Required: ${requiredUserType}, Actual: ${user.userType}`);
      switch (user.userType) {
        case 'applicant':
          navigate('/nxtbeing/dashboard', { replace: true });
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
      return;
    }

    // If on generic dashboard route, redirect to specific dashboard
    if (location.pathname === '/dashboard') {
      console.log('Redirecting from generic dashboard to specific dashboard');
      switch (user.userType) {
        case 'applicant':
          navigate('/nxtbeing/dashboard', { replace: true });
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
      return;
    }
  }, [user, token, requiredUserType, navigate, location.pathname, isLoading, isAuthenticated]);

  // Show loading while checking authentication or during initial load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show loading while redirecting
  if (location.pathname === '/dashboard') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Redirecting to your dashboard...</div>
      </div>
    );
  }

  // If not authenticated, show loading (will redirect)
  if (!isAuthenticated || !token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};
