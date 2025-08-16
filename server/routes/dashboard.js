import express from 'express';
import Applicant from '../models/Applicant.js';
import Recruiter from '../models/Recruiter.js';

const router = express.Router();

// Get applicant dashboard data
router.get('/applicant/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const applicant = await Applicant.findById(userId)
      .select('-password')
      .populate('workExperience')
      .populate('education')
      .populate('projects');
    
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    
    // Calculate additional stats
    const totalSkills = (applicant.technicalSkills?.length || 0) + (applicant.aiSkills?.length || 0);
    const completedProjects = applicant.projects?.filter(p => !p.isOngoing).length || 0;
    const ongoingProjects = applicant.projects?.filter(p => p.isOngoing).length || 0;
    
    // Get recent activity (mock data for now)
    const recentActivity = [
      {
        type: 'application_submitted',
        title: 'Senior AI Developer at TechCorp',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'pending'
      },
      {
        type: 'profile_viewed',
        title: 'Your profile was viewed by AI Solutions Inc',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        status: 'viewed'
      },
      {
        type: 'skill_added',
        title: 'Added "Machine Learning" to your skills',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'completed'
      }
    ];
    
    // Get recommended jobs (mock data for now)
    const recommendedJobs = [
      {
        id: '1',
        title: 'AI Engineer',
        company: 'TechCorp',
        location: 'Remote',
        salary: '$120k - $150k',
        skills: ['Python', 'TensorFlow', 'Machine Learning'],
        matchScore: 95
      },
      {
        id: '2',
        title: 'ML Developer',
        company: 'AI Solutions Inc',
        location: 'San Francisco, CA',
        salary: '$130k - $160k',
        skills: ['Python', 'PyTorch', 'Deep Learning'],
        matchScore: 88
      },
      {
        id: '3',
        title: 'Data Scientist',
        company: 'DataTech',
        location: 'New York, NY',
        salary: '$110k - $140k',
        skills: ['Python', 'R', 'Statistics'],
        matchScore: 82
      }
    ];
    
    const dashboardData = {
      profile: {
        name: applicant.fullName,
        email: applicant.email,
        avatar: applicant.avatar,
        headline: applicant.headline,
        currentRole: applicant.currentRole,
        location: applicant.location,
        profileCompletion: applicant.profileCompletion
      },
      stats: {
        ...applicant.stats,
        totalSkills,
        completedProjects,
        ongoingProjects,
        yearsOfExperience: applicant.yearsOfExperience
      },
      skills: {
        technical: applicant.technicalSkills || [],
        ai: applicant.aiSkills || [],
        soft: applicant.softSkills || []
      },
      recentActivity,
      recommendedJobs,
      quickActions: [
        { title: 'Update Profile', action: 'update_profile', icon: 'edit' },
        { title: 'Browse Jobs', action: 'browse_jobs', icon: 'search' },
        { title: 'Add Skills', action: 'add_skills', icon: 'plus' },
        { title: 'View Applications', action: 'view_applications', icon: 'list' }
      ]
    };
    
    res.json(dashboardData);
    
  } catch (error) {
    console.error('Error fetching applicant dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recruiter dashboard data
router.get('/recruiter/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const recruiter = await Recruiter.findById(userId)
      .select('-password')
      .populate('jobPostings')
      .populate('teamMembers.recruiterId');
    
    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter not found' });
    }
    
    // Calculate additional stats
    const totalViews = recruiter.jobPostings?.reduce((sum, job) => sum + (job.views || 0), 0) || 0;
    const avgApplicationsPerJob = recruiter.jobPostings?.length > 0 
      ? Math.round(recruiter.stats.totalApplications / recruiter.jobPostings.length) 
      : 0;
    
    // Get recent applications (mock data for now)
    const recentApplications = [
      {
        id: '1',
        applicantName: 'Sarah Chen',
        jobTitle: 'AI Engineer',
        appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'new',
        matchScore: 92
      },
      {
        id: '2',
        applicantName: 'John Doe',
        jobTitle: 'ML Developer',
        appliedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'reviewing',
        matchScore: 85
      },
      {
        id: '3',
        applicantName: 'Jane Smith',
        jobTitle: 'Data Scientist',
        appliedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'shortlisted',
        matchScore: 88
      }
    ];
    
    // Get top performing jobs
    const topPerformingJobs = recruiter.jobPostings
      ?.sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
      .slice(0, 5)
      .map(job => ({
        id: job._id,
        title: job.title,
        applications: job.applicationsCount || 0,
        views: job.views || 0,
        status: job.status
      })) || [];
    
    // Get analytics data (mock data for now)
    const analytics = {
      monthlyViews: [
        { month: 'Jan', views: 1200 },
        { month: 'Feb', views: 1500 },
        { month: 'Mar', views: 1800 },
        { month: 'Apr', views: 2100 },
        { month: 'May', views: 2400 },
        { month: 'Jun', views: 2800 }
      ],
      monthlyApplications: [
        { month: 'Jan', applications: 45 },
        { month: 'Feb', applications: 52 },
        { month: 'Mar', applications: 68 },
        { month: 'Apr', applications: 75 },
        { month: 'May', applications: 89 },
        { month: 'Jun', applications: 102 }
      ]
    };
    
    const dashboardData = {
      profile: {
        name: recruiter.fullName,
        email: recruiter.email,
        avatar: recruiter.avatar,
        headline: recruiter.headline,
        currentRole: recruiter.currentRole,
        company: recruiter.company,
        location: recruiter.location,
        profileCompletion: recruiter.profileCompletion
      },
      stats: {
        ...recruiter.stats,
        totalViews,
        avgApplicationsPerJob,
        teamSize: recruiter.teamMembers?.length || 0
      },
      company: recruiter.company,
      permissions: recruiter.permissions,
      recentApplications,
      topPerformingJobs,
      analytics,
      quickActions: [
        { title: 'Post New Job', action: 'post_job', icon: 'plus' },
        { title: 'View Applications', action: 'view_applications', icon: 'list' },
        { title: 'Analytics', action: 'analytics', icon: 'chart' },
        { title: 'Manage Team', action: 'manage_team', icon: 'users' }
      ]
    };
    
    res.json(dashboardData);
    
  } catch (error) {
    console.error('Error fetching recruiter dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platform-wide analytics (for admin dashboard)
router.get('/analytics', async (req, res) => {
  try {
    const totalApplicants = await Applicant.countDocuments({ isActive: true });
    const totalRecruiters = await Recruiter.countDocuments({ isActive: true });
    const totalJobPostings = await Recruiter.aggregate([
      { $unwind: '$jobPostings' },
      { $match: { 'jobPostings.status': 'active' } },
      { $count: 'total' }
    ]);
    
    const recentRegistrations = await Applicant.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');
    
    const platformStats = {
      totalApplicants,
      totalRecruiters,
      totalActiveJobs: totalJobPostings[0]?.total || 0,
      recentRegistrations: recentRegistrations.map(user => ({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        registeredAt: user.createdAt
      }))
    };
    
    res.json(platformStats);
    
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
