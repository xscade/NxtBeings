import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Award,
  Calendar,
  Target,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Eye,
  FileText,
  Building,
  MapPin,
  DollarSign,
  Search,
  Filter,
  Plus,
  MessageSquare,
  Clock
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAccount } from '@/contexts/AccountContext';
import { apiService } from '@/lib/api';

export default function RecruiterDashboard() {
  const { user, dashboardData, setDashboardData, isLoading, setIsLoading } = useAccount();
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // Always fetch fresh data from database
        const data = await apiService.getRecruiterDashboard(user.id);
        setDashboardData(data as any);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data from database');
        console.error('Dashboard data error:', err);
        // Show error state instead of mock data
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id, setDashboardData, setIsLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Please log in to view your dashboard</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.firstName || 'Recruiter'}! 👋
        </h1>
        <p className="text-white/60">
          Ready to find the perfect AI-empowered talent for your team?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData?.stats && Object.entries(dashboardData.stats).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  {key === 'activeJobs' && <Briefcase className="h-6 w-6 text-primary-400" />}
                  {key === 'applicationsReceived' && <FileText className="h-6 w-6 text-primary-400" />}
                  {key === 'interviewsScheduled' && <Calendar className="h-6 w-6 text-primary-400" />}
                  {key === 'hiresCompleted' && <Award className="h-6 w-6 text-primary-400" />}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GlassCard className="p-6 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Post New Job</h3>
                <p className="text-white/60 text-sm">Create a job listing</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Search Talent</h3>
                <p className="text-white/60 text-sm">Find AI professionals</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Review Applications</h3>
                <p className="text-white/60 text-sm">Process candidates</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Recent Applications */}
      {dashboardData?.recentApplications && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Applications</h2>
            <PrimaryButton variant="outline" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </PrimaryButton>
          </div>
          <GlassCard className="p-6">
            <div className="space-y-4">
              {dashboardData.recentApplications.map((application, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <span className="text-primary-400 font-semibold">
                        {application.applicantName.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{application.applicantName}</p>
                      <p className="text-white/60 text-sm">{application.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Match Score</p>
                      <p className="text-primary-400 font-semibold">{application.matchScore}%</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-white/40" />
                      <span className="text-white/40 text-sm">{new Date(application.appliedAt).toLocaleDateString()}</span>
                    </div>
                    <PrimaryButton size="sm">
                      Review
                    </PrimaryButton>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Active Job Listings - Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Active Job Listings</h2>
          <PrimaryButton variant="outline" size="sm">
            Manage Jobs
            <ArrowRight className="h-4 w-4 ml-2" />
          </PrimaryButton>
        </div>
        <GlassCard className="p-6">
          <div className="text-center text-white/60">
            <p>Job management features coming soon!</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Hiring Analytics - Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Hiring Analytics</h2>
        <GlassCard className="p-6">
          <div className="text-center text-white/60">
            <p>Advanced analytics features coming soon!</p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
