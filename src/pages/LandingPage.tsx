import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Users, 
  Briefcase, 
  Target, 
  ArrowRight,
  Star,
  CheckCircle,
  Play,
  ChevronRight,
  ChevronLeft,
  FileText,
  Search,
  Building,
  CheckCircle2,
  LogIn
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { RegistrationModal } from "@/components/ui/RegistrationModal";
import { LoginModal } from "@/components/ui/LoginModal";
import { AdminLoginModal } from "@/components/ui/AdminLoginModal";
import { useAccount } from "@/contexts/AccountContext";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Zap,
    title: "AI-First Professionals",
    description: "Connect with professionals trained to leverage AI tools for exceptional productivity"
  },
  {
    icon: Target,
    title: "Rigorous Testing",
    description: "Every candidate tested with and without AI to measure real skill and adaptability"
  },
  {
    icon: Users,
    title: "Superhumans at Work",
    description: "Build a workforce of AI-empowered professionals who work faster, smarter, and better"
  },
  {
    icon: Briefcase,
    title: "AI-First Roles",
    description: "Dedicated space for prompt engineers and next-generation AI skills"
  }
];

const applicantTestimonials = [
  {
    name: "Sarah Chen",
    role: "AI-First Developer",
    company: "TechCorp",
    avatar: "SC",
    rating: 4.9,
    text: "NxtBeings helped me showcase my AI skills and land my dream job. The platform truly understands the future of work."
  },
  {
    name: "Marcus Rodriguez",
    role: "Prompt Engineer",
    company: "AI Solutions Inc",
    avatar: "MR",
    rating: 4.8,
    text: "The AI skills testing and certification process gave me credibility in the competitive AI job market."
  },
  {
    name: "Alex Johnson",
    role: "AI Consultant",
    company: "Digital Innovations",
    avatar: "AJ",
    rating: 4.9,
    text: "The internship program gave me real-world experience that made all the difference in my career transition."
  }
];

const recruiterTestimonials = [
  {
    name: "Emma Thompson",
    role: "CTO",
    company: "Innovation Labs",
    avatar: "ET",
    rating: 4.9,
    text: "As a recruiter, I can confidently hire from NxtBeings knowing every candidate has been thoroughly vetted."
  },
  {
    name: "David Kim",
    role: "HR Director",
    company: "TechStart Inc",
    avatar: "DK",
    rating: 4.8,
    text: "The quality of AI professionals from NxtBeings is unmatched. Every hire has exceeded our expectations."
  },
  {
    name: "Lisa Wang",
    role: "VP Engineering",
    company: "FutureTech",
    avatar: "LW",
    rating: 4.9,
    text: "We've hired 5 professionals from NxtBeings and they've all been exceptional. The screening process is incredible."
  }
];

const applicantStats = [
  { number: "500+", label: "AI-First Professionals" },
  { number: "95%", label: "Success Rate" },
  { number: "50+", label: "Partner Companies" },
  { number: "24/7", label: "AI Skills Testing" }
];

const recruiterStats = [
  { number: "500+", label: "Verified Professionals" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "24hr", label: "Average Response Time" },
  { number: "100%", label: "Vetted Candidates" }
];

export default function LandingPage() {
  const [userType, setUserType] = useState<'applicant' | 'recruiter'>('applicant');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { setUser, setToken, setAccountType } = useAccount();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg primary-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-white text-lg futuristic-glow">
              NxtBeings
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a>
            
            {/* User Type Switch */}
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium transition-colors ${userType === 'applicant' ? 'text-primary-400' : 'text-white/60'}`}>
                Applicant
              </span>
              <button
                onClick={() => setUserType(userType === 'applicant' ? 'recruiter' : 'applicant')}
                className="relative w-12 h-6 bg-white/10 rounded-full p-1 transition-all duration-300 hover:bg-white/20"
              >
                <div className={`w-4 h-4 bg-primary-400 rounded-full transition-transform duration-300 ${userType === 'recruiter' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-medium transition-colors ${userType === 'recruiter' ? 'text-primary-400' : 'text-white/60'}`}>
                Recruiter
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <PrimaryButton size="sm" variant="outline" onClick={() => setShowLogin(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </PrimaryButton>
              <PrimaryButton size="sm" onClick={() => setShowRegistration(true)}>
                {userType === 'applicant' ? 'Become NxtBeing' : 'Hire NxtBeing'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Clean Background */}
        <div className="absolute inset-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" className="text-primary-400"/>
            </svg>
          </div>
          
          {/* Floating Orange Accent Elements */}
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 border border-primary-400/20 rounded-full"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <motion.div
            className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-lg"
            animate={{
              y: [0, 30, 0],
              rotate: [0, -360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Subtle Particle Effect */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8"
            >
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm font-medium">The Future of Work Platform</span>
            </motion.div>
            
            <h1 className="text-7xl font-bold text-white mb-6 futuristic-glow leading-tight relative z-10 drop-shadow-2xl">
              {userType === 'applicant' ? (
                <>
                  The Future of
                  <span className="text-primary-400 block drop-shadow-lg bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                    Work is Here
                  </span>
                </>
              ) : (
                <>
                  Find AI-Empowered
                  <span className="text-primary-400 block drop-shadow-lg bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                    Superhumans
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed relative z-10 drop-shadow-lg font-medium">
              {userType === 'applicant' 
                ? "Connect with AI-empowered professionals who work faster, smarter, and better. Build a workforce of true 'superhumans at work.'"
                : "Access a curated network of verified AI professionals. Every candidate has been thoroughly tested and vetted for exceptional performance."
              }
            </p>
            <div className="flex items-center justify-center space-x-4 mb-12 relative z-10">
              {userType === 'applicant' ? (
                <>
                  <PrimaryButton size="lg" className="drop-shadow-xl" onClick={() => setShowRegistration(true)}>
                    Become NxtBeing
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </PrimaryButton>
                  <PrimaryButton size="lg" variant="outline" className="drop-shadow-xl">
                    Learn More
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <PrimaryButton size="lg" className="drop-shadow-xl" onClick={() => setShowRegistration(true)}>
                    Hire NxtBeing
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </PrimaryButton>
                  <PrimaryButton size="lg" variant="outline" className="drop-shadow-xl">
                    View Pricing
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </PrimaryButton>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 relative z-10"
          >
            {(userType === 'applicant' ? applicantStats : recruiterStats).map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary-400 mb-2 futuristic-glow drop-shadow-lg">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm font-medium drop-shadow-md">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 futuristic-glow">
              {userType === 'applicant' ? 'How Our Hiring Process Works' : 'How Our Hiring Process Works'}
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {userType === 'applicant' 
                ? "Our rigorous 4-step process ensures only the most qualified AI-empowered professionals join our platform."
                : "Our rigorous 4-step process ensures you get access to only the most qualified AI-empowered professionals."
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Application",
                description: "Submit your application with AI skills assessment and portfolio review",
                icon: FileText
              },
              {
                step: "02", 
                title: "Screening",
                description: "Pass our comprehensive AI skills testing and technical evaluation",
                icon: Search
              },
              {
                step: "03",
                title: "Internship",
                description: "Complete a 1-month paid internship on a real project",
                icon: Building
              },
              {
                step: "04",
                title: "Profile Creation",
                description: "Get your verified profile created on the platform",
                icon: CheckCircle2
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <GlassCard className="h-full relative overflow-hidden glass-card-hover">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-3xl font-bold text-primary-400/20">
                    {step.step}
                  </div>
                  
                  {/* Connection Line */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-400/40 to-transparent transform -translate-y-1/2 z-10"></div>
                  )}
                  
                  <div className="flex flex-col items-center text-center space-y-6 p-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm border border-primary-400/30 flex items-center justify-center shadow-lg shadow-primary-400/20">
                      <step.icon className="w-8 h-8 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Process Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Quality Assurance",
                description: "Only 15% of applicants make it through our rigorous screening process"
              },
              {
                title: "Real Experience",
                description: "1-month internship provides hands-on experience with actual projects"
              },
              {
                title: "Verified Profiles",
                description: "Every professional on our platform has been thoroughly vetted and tested"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-white/60 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Applicant-Specific Section */}
      {userType === 'applicant' && (
        <section id="applicant-benefits" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4 futuristic-glow">
                Why Join as a Professional?
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Stand out in the AI-first economy with our comprehensive training and verification process.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Zap,
                  title: "AI Skills Certification",
                  description: "Get certified in the latest AI tools and techniques that employers are actively seeking"
                },
                {
                  icon: Target,
                  title: "Guaranteed Placement",
                  description: "Our rigorous screening means you're guaranteed to be placed with top companies"
                },
                {
                  icon: Users,
                  title: "Network Access",
                  description: "Connect with other AI professionals and build your network in the industry"
                },
                {
                  icon: Briefcase,
                  title: "Premium Rates",
                  description: "Earn premium rates as a verified AI professional with proven skills"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="h-full">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-xl bg-primary-500/20 text-primary-400">
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-white/60 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recruiter-Specific Section */}
      {userType === 'recruiter' && (
        <section id="recruiter-benefits" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4 futuristic-glow">
                Why Hire from NxtBeings?
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Access a curated network of verified AI professionals ready to transform your business.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: CheckCircle,
                  title: "Pre-Vetted Talent",
                  description: "Every candidate has been thoroughly tested and verified for AI skills and performance"
                },
                {
                  icon: Zap,
                  title: "Fast Hiring",
                  description: "Skip the lengthy screening process with our pre-verified professionals"
                },
                {
                  icon: Target,
                  title: "Guaranteed Quality",
                  description: "Our 1-month internship ensures candidates can perform in real-world scenarios"
                },
                {
                  icon: Users,
                  title: "Dedicated Support",
                  description: "Get personalized support from our team to find the perfect match for your needs"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="h-full">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-xl bg-primary-500/20 text-primary-400">
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-white/60 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 futuristic-glow">
              Why Choose NxtBeings?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              We're building the workforce of the future, one AI-empowered professional at a time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="h-full">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-primary-500/20 text-primary-400">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/60 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 futuristic-glow">
              {userType === 'applicant' 
                ? 'What Our Professionals Say'
                : 'What Our Clients Say'
              }
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {userType === 'applicant'
                ? 'Join thousands of professionals already transforming their careers with AI.'
                : 'Join thousands of companies already transforming their business with AI professionals.'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(userType === 'applicant' ? applicantTestimonials : recruiterTestimonials).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-white/60 text-sm">{testimonial.role} at {testimonial.company}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-auto">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white/60 text-sm">{testimonial.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6 futuristic-glow">
              Ready to Join the Future?
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Whether you're a professional looking to showcase your AI skills or a company seeking AI-empowered talent, 
              NxtBeings is your gateway to the future of work.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <PrimaryButton size="lg">
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </PrimaryButton>
              <PrimaryButton size="lg" variant="outline">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg primary-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-semibold text-white text-lg futuristic-glow">
                NxtBeings
              </span>
            </div>
            <div className="flex items-center space-x-6 text-white/60 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSuccess={(response) => {
          setUser(response.user);
          setToken(response.token);
          setAccountType(response.user.userType);
          navigate('/dashboard');
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={(response) => {
          setUser(response.user);
          setToken(response.token);
          setAccountType(response.user.userType);
          navigate('/dashboard');
        }}
      />
    </div>
  );
}
