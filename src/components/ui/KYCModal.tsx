import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Phone, CheckCircle, Clock } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { PrimaryButton } from './PrimaryButton';
import { Input } from './Input';
import { apiService } from '@/lib/api';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
  userType: 'applicant' | 'recruiter';
  userId: string;
}

type Step = 'phone' | 'otp' | 'complete';

export const KYCModal: React.FC<KYCModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userType,
  userId
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setCurrentStep('phone');
    setPhone('');
    setOtp('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const sendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await apiService.sendKYCOTP({
        phone,
        userType
      });
      setCurrentStep('otp');
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.verifyKYCOTP({
        phone,
        userType,
        otp,
        userId
      });
      
      onSuccess(response);
      setCurrentStep('complete');
    } catch (error: any) {
      setError(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 'phone') {
      await sendOTP();
    } else if (currentStep === 'otp') {
      await verifyOTP();
    }
  };

  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('phone');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'phone':
        return phone.length >= 10;
      case 'otp':
        return otp.length === 6;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'phone':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Complete your KYC verification by adding your phone number.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone className="h-4 w-4" />}
                className="w-full"
              />
              <p className="text-white/60 text-sm">
                We&apos;ll send a verification code to your phone number
              </p>
            </div>
          </div>
        );

      case 'otp':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-white text-sm">
                  Enter the 6-digit code sent to {phone}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full text-center text-2xl tracking-widest"
              />
              <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
                <Clock className="h-4 w-4" />
                <span>Code expires in 5:00</span>
              </div>
              <button
                onClick={sendOTP}
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                Resend code
              </button>
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
                  KYC verification completed successfully!
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  KYC Verified!
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  Your phone number has been verified for KYC compliance
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
                  KYC Verification
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
                    disabled={currentStep === 'phone'}
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
                        <span>{currentStep === 'otp' ? 'Verify' : 'Next'}</span>
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
