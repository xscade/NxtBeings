import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Phone, User, Building, CheckCircle, Clock } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { PrimaryButton } from './PrimaryButton';
import { Input } from './Input';
import { apiService } from '@/lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

type Step = 'userType' | 'credentials' | 'complete';

interface LoginData {
  userType: 'applicant' | 'recruiter';
  email: string;
  password: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('userType');
  const [data, setLoginData] = useState<LoginData>({
    userType: 'applicant',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setCurrentStep('userType');
    setLoginData({
      userType: 'applicant',
      email: '',
      password: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.login({
        email: data.email,
        password: data.password,
        userType: data.userType
      });
      
      onSuccess(response);
      setCurrentStep('complete');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 'credentials') {
      await handleLogin();
    }
  };

  const handleBack = () => {
    if (currentStep === 'credentials') {
      setCurrentStep('userType');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'userType':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Welcome back! How would you like to sign in?
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setLoginData({ ...data, userType: 'applicant' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  data.userType === 'applicant'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-primary-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-white">Professional</h3>
                    <p className="text-white/60 text-sm">Sign in to your account</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setLoginData({ ...data, userType: 'recruiter' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  data.userType === 'recruiter'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Building className="h-6 w-6 text-primary-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-white">Recruiter</h3>
                    <p className="text-white/60 text-sm">Sign in to your account</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 'credentials':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Enter your login credentials to access your account.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => setLoginData({ ...data, email: e.target.value })}
                icon={<Mail className="h-4 w-4" />}
                className="w-full"
              />
              <Input
                type="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => setLoginData({ ...data, password: e.target.value })}
                icon={<User className="h-4 w-4" />}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Welcome back! Redirecting you to your dashboard...
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Login Successful!
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  You'll be redirected shortly
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'userType':
        return true;
      case 'credentials':
        return data.email && data.password;
      default:
        return true;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {data.userType === 'recruiter' ? 'Recruiter Login' : 'Professional Login'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                {renderStepContent()}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Navigation */}
              {currentStep !== 'complete' && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 'userType'}
                    className="flex items-center space-x-2 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  <PrimaryButton
                    onClick={handleNext}
                    disabled={!canProceed() || loading}
                    size="sm"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Next</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </PrimaryButton>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
