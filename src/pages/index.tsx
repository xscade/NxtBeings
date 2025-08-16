import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin,
  DollarSign,
  Clock,
  Zap,
  Target,
  BookOpen,
  Eye,
  FileText,
  Users
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Badge } from "@/components/ui/Badge";
import { useAccount } from "@/contexts/AccountContext";
import { apiService } from "@/lib/api";

// Dashboard stats configuration
const getStatsConfig = (accountType: string, dashboardData: any) => {
  if (accountType === 'applicant') {
    return [
      { 
        title: "Profile Views", 
        value: dashboardData?.stats?.profileViews?.toString() || "0", 
        change: "+23%", 
        icon: Eye, 
        color: "text-blue-400" 
      },
      { 
        title: "Applications", 
        value: dashboardData?.stats?.applicationsSubmitted?.toString() || "0", 
        change: "+8%", 
        icon: FileText, 
        color: "text-green-400" 
      },
      { 
        title: "AI Skills", 
        value: dashboardData?.stats?.totalSkills?.toString() || "0", 
        change: "+5%", 
        icon: Zap, 
        color: "text-purple-400" 
      },
      { 
        title: "Interviews", 
        value: dashboardData?.stats?.interviewsScheduled?.toString() || "0", 
        change: "+2%", 
        icon: Target, 
        color: "text-orange-400" 
      },
    ];
  } else {
    return [
      { 
        title: "Job Postings", 
        value: dashboardData?.stats?.totalJobPostings?.toString() || "0", 
        change: "+12%", 
        icon: Briefcase, 
        color: "text-blue-400" 
      },
      { 
        title: "Applications", 
        value: dashboardData?.stats?.totalApplications?.toString() || "0", 
        change: "+18%", 
        icon: FileText, 
        color: "text-green-400" 
      },
      { 
        title: "Profile Views", 
        value: dashboardData?.stats?.profileViews?.toString() || "0", 
        change: "+15%", 
        icon: Eye, 
        color: "text-purple-400" 
      },
      { 
        title: "Hires Made", 
        value: dashboardData?.stats?.hiresMade?.toString() || "0", 
        change: "+3%", 
        icon: Users, 
        color: "text-orange-400" 
      },
    ];
  }
};

const recommendedJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    posted: "2 hours ago",
    matchScore: 95,
    tags: ["React", "TypeScript", "AI Tools"],
    aiSkills: ["GPT-4", "Copilot", "GitHub Copilot"]
  },
  {
    id: 2,
    title: "AI Prompt Engineer",
    company: "AI Solutions Inc",
    location: "Remote",
    salary: "$90k - $120k",
    posted: "4 hours ago",
    matchScore: 98,
    tags: ["GPT-4", "Midjourney", "Copilot"],
    aiSkills: ["GPT-4", "Midjourney", "LangChain"]
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    salary: "$100k - $130k",
    posted: "6 hours ago",
    matchScore: 87,
    tags: ["Figma", "AI Design", "Prototyping"],
    aiSkills: ["Midjourney", "Figma AI", "DALL-E"]
  }
];

const aiSkillProgress = [
  { skill: "GPT-4", progress: 95, level: "Expert" },
  { skill: "Copilot", progress: 88, level: "Advanced" },
  { skill: "Midjourney", progress: 92, level: "Expert" },
  { skill: "Claude", progress: 78, level: "Intermediate" },
  { skill: "LangChain", progress: 85, level: "Advanced" }
];

const recentActivity = [
  {
    type: "application",
    title: "Applied to Senior React Developer at TechCorp",
    time: "2 hours ago",
    status: "pending"
  },
  {
    type: "skill",
    title: "Completed GPT-4 Advanced Certification",
    time: "1 day ago",
    status: "completed"
  },
  {
    type: "interview",
    title: "Interview scheduled with AI Solutions Inc",
    time: "2 days ago",
    status: "scheduled"
  }
];

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

export default function NxtBeingDashboard() {
  const { user, accountType, dashboardData, setDashboardData, isLoading, setIsLoading } = useAccount();

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        let data;
        if (accountType === 'applicant') {
          data = await apiService.getApplicantDashboard(user.id);
        } else {
          data = await apiService.getRecruiterDashboard(user.id);
        }
        setDashboardData(data as any);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // For now, use mock data if API fails
        setDashboardData({
          profile: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            currentRole: user.currentRole,
            profileCompletion: 75
          },
          stats: {
            profileViews: 156,
            applicationsSubmitted: 12,
            totalSkills: 15,
            interviewsScheduled: 3
          },
          quickActions: []
        } as any);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id, accountType, setDashboardData, setIsLoading]);

  const statsConfig = getStatsConfig(accountType, dashboardData);

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
            Welcome back, {dashboardData?.profile?.name || user?.firstName}!
          </h1>
          <p className="text-white/60 mt-1">
            {accountType === 'applicant' 
              ? "Here's your AI-powered career dashboard" 
              : "Here's your recruitment dashboard"
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="primary" size="md" className="glass-glow">
            <Zap className="h-3 w-3 mr-1" />
            {accountType === 'applicant' ? 'AI-First Professional' : 'Recruiter'}
          </Badge>
          <PrimaryButton size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            {accountType === 'applicant' ? 'Update Profile' : 'Post Job'}
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
        {/* Recommended Jobs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {accountType === 'applicant' ? 'Recommended Jobs' : 'Recent Applications'}
              </h2>
              <a href="/jobs" className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recommendedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 glass-glow hover:glass-glow-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{job.title}</h3>
                      <p className="text-white/60 text-sm mb-2">{job.company}</p>
                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {job.salary}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {job.posted}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="success" size="sm" className="glass-glow">
                        <span className="font-bold text-lg tracking-wide">{job.matchScore}%</span>
                        <span className="text-xs ml-1">Match</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {job.aiSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full glass-glow"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <PrimaryButton size="sm" variant="outline">
                      {accountType === 'applicant' ? 'Apply Now' : 'View Details'}
                    </PrimaryButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Skills & Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* AI Skills Progress */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {accountType === 'applicant' ? 'AI Skills Progress' : 'Platform Stats'}
              </h2>
              <Zap className="h-5 w-5 text-primary-400" />
            </div>
            <div className="space-y-4">
              {aiSkillProgress.map((skill, index) => (
                <motion.div
                  key={skill.skill}
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{skill.skill}</span>
                    <span className="text-xs text-white/60">{skill.level}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 glass-glow">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 glass-glow"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary-400 tracking-wide futuristic-glow">
                      {skill.progress}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <a href="/activity" className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 glass-glow"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' ? 'bg-green-400' :
                    activity.status === 'scheduled' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <p className="text-xs text-white/60">{activity.time}</p>
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
