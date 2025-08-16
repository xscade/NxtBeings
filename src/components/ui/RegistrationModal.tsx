import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Mail, User, Building, CheckCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { PrimaryButton } from './PrimaryButton';
import { Input } from './Input';
import { apiService } from '@/lib/api';
import { useAccount } from '@/contexts/AccountContext';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
  defaultUserType?: UserType;
}

type UserType = 'applicant' | 'recruiter';
type Step = 'userType' | 'basicInfo' | 'professionalInfo' | 'recruiterInfo' | 'companyInfo' | 'complete';

interface RegistrationData {
  userType: UserType;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  currentRole: string;
  // Professional specific
  yearsOfExperience?: number;
  preferredWorkType?: string[];
  // Recruiter specific
  companyName?: string;
  companyIndustry?: string;
  companySize?: string;
  department?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultUserType = 'applicant'
}) => {
  const { login } = useAccount();
  const [currentStep, setCurrentStep] = useState<Step>('userType');
  const [data, setData] = useState<RegistrationData>({
    userType: defaultUserType,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    currentRole: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps: Record<UserType, Step[]> = {
    applicant: ['userType', 'basicInfo', 'professionalInfo', 'complete'],
    recruiter: ['userType', 'basicInfo', 'recruiterInfo', 'companyInfo', 'complete']
  };

  const currentStepIndex = steps[data.userType].indexOf(currentStep);
  const totalSteps = steps[data.userType].length;

  // Update user type when defaultUserType prop changes
  useEffect(() => {
    if (isOpen && defaultUserType !== data.userType) {
      setData(prev => ({ ...prev, userType: defaultUserType }));
      setCurrentStep('userType');
    }
  }, [isOpen, defaultUserType, data.userType]);

  const resetForm = () => {
    setCurrentStep('userType');
    setData({
      userType: defaultUserType,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      currentRole: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };



  const handleNext = async () => {
    // If we're on the last step before complete, trigger registration
    if (currentStepIndex === totalSteps - 2) {
      await handleRegistration();
    } else {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < totalSteps) {
        setCurrentStep(steps[data.userType][nextStepIndex] as Step);
      }
    }
  };

  const handleBack = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[data.userType][prevStepIndex]);
    }
  };

  const handleRegistration = async () => {
    setLoading(true);
    setError('');

    try {
      const registrationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        currentRole: data.currentRole,
        ...(data.userType === 'applicant' && {
          yearsOfExperience: data.yearsOfExperience,
          preferredWorkType: data.preferredWorkType
        }),
        ...(data.userType === 'recruiter' && {
          company: {
            name: data.companyName,
            industry: data.companyIndustry,
            size: data.companySize
          },
          department: data.department
        })
      };

      let response: any;
      if (data.userType === 'applicant') {
        response = await apiService.registerApplicant(registrationData as any);
      } else {
        response = await apiService.registerRecruiter(registrationData as any);
      }

      // Use the new login function from AccountContext
      await login(response.user, response.token);
      
      onSuccess(response);
      handleClose();
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    console.log('canProceed check:', { currentStep, data });
    switch (currentStep) {
      case 'userType':
        return true;
      case 'basicInfo':
        return data.firstName && data.lastName && data.email && data.password && data.currentRole;
      case 'professionalInfo': {
        const canProceedProfessional = data.yearsOfExperience !== undefined && data.preferredWorkType && data.preferredWorkType.length > 0;
        console.log('professionalInfo validation:', { yearsOfExperience: data.yearsOfExperience, preferredWorkType: data.preferredWorkType, canProceed: canProceedProfessional });
        return canProceedProfessional;
      }
      case 'recruiterInfo':
        return data.department;
      case 'companyInfo':
        return data.companyName && data.companyIndustry && data.companySize;
      case 'complete':
        return true;
      default:
        return true;
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
                  Hi! I&apos;m here to help you get started. Are you looking to join as a NxtBeing or hire talent?
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setData({ ...data, userType: 'applicant' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  data.userType === 'applicant'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-primary-400" />
                  <div className="text-left">
                                    <h3 className="font-semibold text-white">NxtBeing (Applicant)</h3>
                <p className="text-white/60 text-sm">Find AI-first opportunities</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setData({ ...data, userType: 'recruiter' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  data.userType === 'recruiter'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Building className="h-6 w-6 text-primary-400" />
                  <div className="text-left">
                                    <h3 className="font-semibold text-white">Recruiter Registration</h3>
                <p className="text-white/60 text-sm">Find AI-first professionals</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );



      case 'basicInfo':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Tell us a bit about yourself
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First name"
                value={data.firstName}
                onChange={(e) => setData({ ...data, firstName: e.target.value })}
                icon={<User className="h-4 w-4" />}
              />
              <Input
                placeholder="Last name"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                icon={<User className="h-4 w-4" />}
              />
            </div>
            
            <Input
              type="email"
              placeholder="Email address"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              icon={<Mail className="h-4 w-4" />}
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              icon={<User className="h-4 w-4" />}
            />
            
            <Input
              placeholder="Current role"
              value={data.currentRole}
              onChange={(e) => setData({ ...data, currentRole: e.target.value })}
              icon={<User className="h-4 w-4" />}
            />
          </div>
        );

      case 'professionalInfo':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Help us match you with the right opportunities
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Years of experience
                </label>
                <select
                  value={data.yearsOfExperience !== undefined ? data.yearsOfExperience.toString() : ''}
                  onChange={(e) => setData({ ...data, yearsOfExperience: Number(e.target.value) })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                >
                  <option value="">Select experience</option>
                  <option value="0">0-1 years</option>
                  <option value="2">2-3 years</option>
                  <option value="4">4-5 years</option>
                  <option value="6">6-8 years</option>
                  <option value="9">9+ years</option>
                </select>
              </div>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Preferred work type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['full-time', 'part-time', 'contract', 'freelance'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const current = data.preferredWorkType || [];
                        const updated = current.includes(type)
                          ? current.filter(t => t !== type)
                          : [...current, type];
                        setData({ ...data, preferredWorkType: updated });
                      }}
                      className={`p-3 rounded-lg border transition-all ${
                        data.preferredWorkType?.includes(type)
                          ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                          : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'recruiterInfo':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Tell us about your role in hiring
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Department (e.g., HR, Engineering, Product)"
                value={data.department || ''}
                onChange={(e) => setData({ ...data, department: e.target.value })}
                icon={<Building className="h-4 w-4" />}
              />
            </div>
          </div>
        );

      case 'companyInfo':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Tell us about your company
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Company name"
                value={data.companyName || ''}
                onChange={(e) => setData({ ...data, companyName: e.target.value })}
                icon={<Building className="h-4 w-4" />}
              />
              
              <Input
                placeholder="Industry"
                value={data.companyIndustry || ''}
                onChange={(e) => setData({ ...data, companyIndustry: e.target.value })}
                icon={<Building className="h-4 w-4" />}
              />
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Company size
                </label>
                <select
                  value={data.companySize || ''}
                  onChange={(e) => setData({ ...data, companySize: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                >
                  <option value="">Select size</option>
                  <option value="startup">Startup (1-50)</option>
                  <option value="small">Small (51-200)</option>
                  <option value="medium">Medium (201-1000)</option>
                  <option value="large">Large (1001-5000)</option>
                  <option value="enterprise">Enterprise (5000+)</option>
                </select>
              </div>
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
                  Perfect! You&apos;re all set to get started.
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Welcome to NxtBeings!
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  Your account has been created successfully
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
                  {data.userType === 'recruiter' ? 'Recruiter Registration' : 'NxtBeings Registration'}
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
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="flex items-center space-x-2 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center space-x-3">
                  <div className="text-white/60 text-sm">
                    {currentStepIndex + 1} of {totalSteps}
                  </div>
                  <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>

                <PrimaryButton
                  onClick={handleNext}
                  disabled={!canProceed() || loading}
                  size="sm"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{currentStepIndex === totalSteps - 2 ? 'Create Account' : 'Next'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </PrimaryButton>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
