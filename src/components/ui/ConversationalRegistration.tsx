import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Send, User, Building2, CheckCircle } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";

interface RegistrationStep {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multi-select' | 'email' | 'textarea';
  options?: string[];
  placeholder?: string;
  validation?: (value: string) => boolean;
  errorMessage?: string;
}

const registrationSteps: RegistrationStep[] = [
  {
    id: 'userType',
    question: "Hi! I'm here to help you get started. Are you looking to join as a professional or hire talent?",
    type: 'select',
    options: ['Join as a Professional', 'Hire Talent']
  },
  {
    id: 'name',
    question: "Great! What's your name?",
    type: 'text',
    placeholder: "Enter your full name",
    validation: (value) => value.length >= 2,
    errorMessage: "Please enter your full name"
  },
  {
    id: 'email',
    question: "Perfect! What's your email address?",
    type: 'email',
    placeholder: "your.email@example.com",
    validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "Please enter a valid email address"
  },
  {
    id: 'experience',
    question: "How much experience do you have with AI tools and technologies?",
    type: 'select',
    options: ['Beginner (0-1 years)', 'Intermediate (1-3 years)', 'Advanced (3+ years)', 'Expert (5+ years)']
  },
  {
    id: 'skills',
    question: "Which AI skills are you most proficient in? (Select all that apply)",
    type: 'multi-select',
    options: ['ChatGPT', 'Claude', 'Midjourney', 'DALL-E', 'Stable Diffusion', 'Python', 'JavaScript', 'Prompt Engineering', 'Data Analysis', 'Machine Learning']
  },
  {
    id: 'goals',
    question: "What are your primary goals? (Select all that apply)",
    type: 'multi-select',
    options: ['Find remote work', 'Build a portfolio', 'Learn new skills', 'Network with professionals', 'Earn higher income', 'Career transition']
  },
  {
    id: 'availability',
    question: "How many hours per week are you available for work?",
    type: 'select',
    options: ['5-10 hours', '10-20 hours', '20-30 hours', '30+ hours', 'Full-time']
  },
  {
    id: 'motivation',
    question: "Tell me a bit about what motivates you to work with AI. What excites you most?",
    type: 'textarea',
    placeholder: "Share your thoughts...",
    validation: (value) => value.length >= 10,
    errorMessage: "Please share a bit more about your motivation"
  }
];

interface ConversationalRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'applicant' | 'recruiter';
}

export const ConversationalRegistration: React.FC<ConversationalRegistrationProps> = ({
  isOpen,
  onClose,
  userType
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentStepData = registrationSteps[currentStep];

  const handleNext = () => {
    if (!currentStepData) return;

    let isValid = true;
    let value = currentInput;

    if (currentStepData.type === 'multi-select') {
      value = selectedOptions;
      isValid = selectedOptions.length > 0;
    } else if (currentStepData.type === 'select') {
      value = currentInput;
      isValid = currentInput.length > 0;
    } else if (currentStepData.validation) {
      isValid = currentStepData.validation(currentInput);
    }

    if (!isValid) {
      setError(currentStepData.errorMessage || 'Please provide a valid answer');
      return;
    }

    setAnswers(prev => ({ ...prev, [currentStepData.id]: value }));
    setCurrentInput('');
    setSelectedOptions([]);
    setError('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (currentStep < registrationSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Registration complete
        console.log('Registration complete:', answers);
        onClose();
      }
    }, 1000);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCurrentInput('');
      setSelectedOptions([]);
      setError('');
    }
  };

  const handleOptionSelect = (option: string) => {
    if (currentStepData.type === 'multi-select') {
      setSelectedOptions(prev => 
        prev.includes(option) 
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
    } else {
      setCurrentInput(option);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-white">NxtBeings Registration</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Chat Container */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {/* Previous Messages */}
          {currentStep > 0 && (
            <div className="space-y-4">
              {registrationSteps.slice(0, currentStep).map((step, index) => (
                <div key={step.id} className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">N</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl px-4 py-3 max-w-xs">
                      <p className="text-white/90 text-sm">{step.question}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-primary-500/20 rounded-2xl px-4 py-3 max-w-xs">
                      <p className="text-white text-sm">
                        {answers[step.id]}
                        {Array.isArray(answers[step.id]) && (
                          <span className="text-primary-400">
                            {answers[step.id].join(', ')}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">N</span>
                </div>
                <div className="bg-white/5 rounded-2xl px-4 py-3 max-w-xs">
                  <p className="text-white/90 text-sm">{currentStepData.question}</p>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-primary-500/20 rounded-2xl px-4 py-3 max-w-xs">
                  {currentStepData.type === 'select' && (
                    <div className="space-y-2">
                      {currentStepData.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentInput === option
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentStepData.type === 'multi-select' && (
                    <div className="space-y-2">
                      {currentStepData.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedOptions.includes(option)
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {selectedOptions.includes(option) && (
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                          )}
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {(currentStepData.type === 'text' || currentStepData.type === 'email') && (
                    <input
                      type={currentStepData.type}
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={currentStepData.placeholder}
                      className="w-full bg-transparent text-white placeholder-white/60 outline-none text-sm"
                    />
                  )}

                  {currentStepData.type === 'textarea' && (
                    <textarea
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={currentStepData.placeholder}
                      rows={3}
                      className="w-full bg-transparent text-white placeholder-white/60 outline-none text-sm resize-none"
                    />
                  )}

                  {error && (
                    <p className="text-red-400 text-xs mt-2">{error}</p>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">N</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">
              {currentStep + 1} of {registrationSteps.length}
            </span>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / registrationSteps.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <span>{currentStep === registrationSteps.length - 1 ? 'Complete' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
