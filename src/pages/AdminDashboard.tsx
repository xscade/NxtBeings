import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Shield,
  Settings,
  Eye,
  UserCheck,
  UserX,
  Building,
  Briefcase,
  Calendar,
  BarChart3,
  Activity
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Badge } from "@/components/ui/Badge";
import { apiService } from "@/lib/api";

interface AdminStats {
  totalApplicants: number;
  totalRecruiters: number;
  totalAdmins: number;
  totalUsers: number;
}

interface RecentActivity {
  applicants: Array<{
    name: string;
    email: string;
    type: string;
    registeredAt: string;
  }>;
  recruiters: Array<{
    name: string;
    email: string;
    company: string;
    type: string;
    registeredAt: string;
  }>;
}

interface MonthlyStats {
  month: string;
  applicants: number;
  recruiters: number;
  total: number;
}

interface AdminDashboardData {
  stats: AdminStats;
  recentActivity: RecentActivity;
  analytics: MonthlyStats[];
  quickActions: Array<{
    title: string;
    action: string;
    icon: string;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getAdminDashboard();
        setDashboardData(data as any);
      } catch (error) {
        console.error('Error loading admin dashboard:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statsConfig = [
    {
      title: "Total Users",
      value: dashboardData?.stats.totalUsers.toString() || "0",
      change: "+12%",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Applicants",
      value: dashboardData?.stats.totalApplicants.toString() || "0",
      change: "+8%",
      icon: UserCheck,
      color: "text-green-400"
    },
    {
      title: "Recruiters",
      value: dashboardData?.stats.totalRecruiters.toString() || "0",
      change: "+15%",
      icon: Building,
      color: "text-purple-400"
    },
    {
      title: "Admins",
      value: dashboardData?.stats.totalAdmins.toString() || "0",
      change: "+0%",
      icon: Shield,
      color: "text-orange-400"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <PrimaryButton onClick={() => window.location.reload()}>
            Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white futuristic-glow">
            Admin Dashboard
          </h1>
          <p className="text-white/60 mt-1">
            Platform administration and analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="primary" size="md" className="glass-glow">
            <Shield className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
          <PrimaryButton size="sm">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </PrimaryButton>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsConfig.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <GlassCard className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-xl bg-white/5 glass-glow ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1 futuristic-glow tracking-wider">
                {stat.value}
              </h3>
              <p className="text-white/60 text-sm mb-2">{stat.title}</p>
              <span className="text-green-400 text-sm font-semibold tracking-wide">{stat.change}</span>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Registrations
              </h2>
              <a href="/admin/users" className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                View all users
              </a>
            </div>
            <div className="space-y-4">
              {/* Recent Applicants */}
              {dashboardData?.recentActivity.applicants.map((user, index) => (
                <motion.div
                  key={`applicant-${index}`}
                  variants={itemVariants}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 glass-glow hover:glass-glow-hover"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <p className="text-white/60 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="success" size="sm" className="glass-glow">
                        Applicant
                      </Badge>
                      <p className="text-white/40 text-xs mt-1">
                        {new Date(user.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Recent Recruiters */}
              {dashboardData?.recentActivity.recruiters.map((user, index) => (
                <motion.div
                  key={`recruiter-${index}`}
                  variants={itemVariants}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 glass-glow hover:glass-glow-hover"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <p className="text-white/60 text-sm">{user.email}</p>
                        <p className="text-white/40 text-xs">{user.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="primary" size="sm" className="glass-glow">
                        Recruiter
                      </Badge>
                      <p className="text-white/40 text-xs mt-1">
                        {new Date(user.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Analytics & Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Monthly Analytics */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Monthly Growth
              </h2>
              <BarChart3 className="h-5 w-5 text-primary-400" />
            </div>
            <div className="space-y-4">
              {dashboardData?.analytics.slice(-3).map((month, index) => (
                <motion.div
                  key={month.month}
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{month.month}</span>
                    <span className="text-xs text-white/60">{month.total} users</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 glass-glow">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 glass-glow"
                      style={{ width: `${(month.total / Math.max(...dashboardData.analytics.map(m => m.total))) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{month.applicants} applicants</span>
                    <span>{month.recruiters} recruiters</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              <Activity className="h-5 w-5 text-primary-400" />
            </div>
            <div className="space-y-3">
              {dashboardData?.quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  variants={itemVariants}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer glass-glow hover:glass-glow-hover"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary-400 text-sm">{action.icon}</span>
                    </div>
                    <span className="text-white font-medium">{action.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
