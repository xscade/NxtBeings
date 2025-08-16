import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Applicant from '../models/Applicant.js';
import Recruiter from '../models/Recruiter.js';

const router = express.Router();

// Admin login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        role: admin.role,
        permissions: admin.permissions 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: admin.getPublicProfile()
    });

  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // Get platform statistics
    const totalApplicants = await Applicant.countDocuments({ isActive: true });
    const totalRecruiters = await Recruiter.countDocuments({ isActive: true });
    const totalAdmins = await Admin.countDocuments({ isActive: true });
    
    // Get recent registrations
    const recentApplicants = await Applicant.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');
    
    const recentRecruiters = await Recruiter.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email company createdAt');

    // Get platform analytics
    const monthlyStats = await getMonthlyStats();
    
    const dashboardData = {
      stats: {
        totalApplicants,
        totalRecruiters,
        totalAdmins,
        totalUsers: totalApplicants + totalRecruiters
      },
      recentActivity: {
        applicants: recentApplicants.map(user => ({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          type: 'applicant',
          registeredAt: user.createdAt
        })),
        recruiters: recentRecruiters.map(user => ({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          company: user.company?.name,
          type: 'recruiter',
          registeredAt: user.createdAt
        }))
      },
      analytics: monthlyStats,
      quickActions: [
        { title: 'Manage Users', action: 'manage_users', icon: 'users' },
        { title: 'View Analytics', action: 'view_analytics', icon: 'chart' },
        { title: 'System Settings', action: 'system_settings', icon: 'settings' },
        { title: 'Content Moderation', action: 'moderate_content', icon: 'shield' }
      ]
    };

    res.json(dashboardData);

  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (with pagination and filters)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by user type
    if (type === 'applicant') {
      query = { isActive: status === 'active' ? true : status === 'inactive' ? false : { $exists: true } };
      const applicants = await Applicant.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password')
        .sort({ createdAt: -1 });
      
      const total = await Applicant.countDocuments(query);
      
      res.json({
        users: applicants.map(user => ({
          ...user.toObject(),
          userType: 'applicant'
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } else if (type === 'recruiter') {
      query = { isActive: status === 'active' ? true : status === 'inactive' ? false : { $exists: true } };
      const recruiters = await Recruiter.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password')
        .sort({ createdAt: -1 });
      
      const total = await Recruiter.countDocuments(query);
      
      res.json({
        users: recruiters.map(user => ({
          ...user.toObject(),
          userType: 'recruiter'
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      // Get both types
      const [applicants, recruiters] = await Promise.all([
        Applicant.find({ isActive: status === 'active' ? true : status === 'inactive' ? false : { $exists: true } })
          .skip(skip)
          .limit(parseInt(limit) / 2)
          .select('-password')
          .sort({ createdAt: -1 }),
        Recruiter.find({ isActive: status === 'active' ? true : status === 'inactive' ? false : { $exists: true } })
          .skip(skip)
          .limit(parseInt(limit) / 2)
          .select('-password')
          .sort({ createdAt: -1 })
      ]);

      const totalApplicants = await Applicant.countDocuments();
      const totalRecruiters = await Recruiter.countDocuments();
      const total = totalApplicants + totalRecruiters;

      res.json({
        users: [
          ...applicants.map(user => ({ ...user.toObject(), userType: 'applicant' })),
          ...recruiters.map(user => ({ ...user.toObject(), userType: 'recruiter' }))
        ],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user status
router.patch('/users/:userId/status', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { isActive, userType } = req.body;

    let user;
    if (userType === 'applicant') {
      user = await Applicant.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      ).select('-password');
    } else if (userType === 'recruiter') {
      user = await Recruiter.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      ).select('-password');
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: { ...user.toObject(), userType }
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to get monthly statistics
async function getMonthlyStats() {
  const now = new Date();
  const months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const [applicants, recruiters] = await Promise.all([
      Applicant.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      Recruiter.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      })
    ]);
    
    months.push({
      month: monthName,
      applicants,
      recruiters,
      total: applicants + recruiters
    });
  }
  
  return months;
}

export default router;
