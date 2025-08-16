import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Applicant from '../models/Applicant.js';
import Recruiter from '../models/Recruiter.js';
import otpService from '../services/otpService.js';

const router = express.Router();

// Send OTP for KYC verification
router.post('/kyc/send-otp', [
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('userType').isIn(['applicant', 'recruiter']).withMessage('Valid user type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, userType } = req.body;

    // Generate and send OTP
    const otp = otpService.generateOTP();
    otpService.storeOTP(phone, userType, otp);
    
    await otpService.sendOTP(phone, otp);

    res.json({
      message: 'OTP sent successfully for KYC verification',
      phone,
      userType
    });

  } catch (error) {
    console.error('Error sending KYC OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP for KYC
router.post('/kyc/verify-otp', [
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('userType').isIn(['applicant', 'recruiter']).withMessage('Valid user type is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP is required'),
  body('userId').notEmpty().withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, userType, otp, userId } = req.body;

    // Verify OTP
    const result = otpService.verifyOTP(phone, userType, otp);

    if (!result.valid) {
      return res.status(400).json({ error: result.message });
    }

    // Update user's phone verification status
    let user;
    if (userType === 'applicant') {
      user = await Applicant.findById(userId);
    } else {
      user = await Recruiter.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.phone = phone;
    user.phoneVerified = true;
    user.isKYCVerified = true;
    await user.save();

    res.json({
      message: 'KYC verification completed successfully',
      phone,
      userType,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        isKYCVerified: user.isKYCVerified
      }
    });

  } catch (error) {
    console.error('Error verifying KYC OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Validate token and get fresh user data
router.get('/validate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Find user in database
    let user = await Applicant.findById(decoded.userId);
    let userType = 'applicant';

    if (!user) {
      user = await Recruiter.findById(decoded.userId);
      userType = 'recruiter';
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'User account is deactivated' });
    }

    // Return fresh user data
    res.json({
      message: 'Token validated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        currentRole: user.currentRole,
        userType,
        avatar: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
        phoneVerified: user.phoneVerified,
        isKYCVerified: user.isKYCVerified,
        ...(userType === 'recruiter' && { company: user.company })
      }
    });

  } catch (error) {
    console.error('Error validating token:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    res.status(500).json({ error: 'Token validation failed' });
  }
});

// Register applicant
router.post('/register/applicant', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('currentRole').trim().notEmpty().withMessage('Current role is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, currentRole, yearsOfExperience, preferredWorkType } = req.body;

    // Check if user already exists
    const existingUser = await Applicant.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Filter out invalid work types and location preferences
    const validWorkTypes = ['full-time', 'part-time', 'contract', 'freelance', 'internship'];
    const filteredWorkTypes = preferredWorkType ? 
      preferredWorkType.filter(type => validWorkTypes.includes(type)) : 
      [];

    // Create new applicant
    const applicant = new Applicant({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      currentRole,
      yearsOfExperience,
      preferredWorkType: filteredWorkTypes
    });

    await applicant.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: applicant._id, userType: 'applicant' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Applicant registered successfully',
      token,
      user: {
        id: applicant._id,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        currentRole: applicant.currentRole,
        userType: 'applicant',
        avatar: `${applicant.firstName.charAt(0)}${applicant.lastName.charAt(0)}`,
        phoneVerified: applicant.phoneVerified,
        isKYCVerified: applicant.isKYCVerified
      }
    });

  } catch (error) {
    console.error('Error registering applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register recruiter
router.post('/register/recruiter', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('currentRole').trim().notEmpty().withMessage('Current role is required'),
  body('company.name').trim().notEmpty().withMessage('Company name is required'),
  body('company.industry').trim().notEmpty().withMessage('Company industry is required'),
  body('company.size').isIn(['startup', 'small', 'medium', 'large', 'enterprise']).withMessage('Valid company size is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, currentRole, company, department } = req.body;

    // Check if user already exists
    const existingUser = await Recruiter.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new recruiter
    const recruiter = new Recruiter({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      currentRole,
      company,
      department
    });

    await recruiter.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: recruiter._id, userType: 'recruiter' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Recruiter registered successfully',
      token,
      user: {
        id: recruiter._id,
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
        email: recruiter.email,
        currentRole: recruiter.currentRole,
        company: recruiter.company,
        userType: 'recruiter',
        avatar: `${recruiter.firstName.charAt(0)}${recruiter.lastName.charAt(0)}`,
        phoneVerified: recruiter.phoneVerified,
        isKYCVerified: recruiter.isKYCVerified
      }
    });

  } catch (error) {
    console.error('Error registering recruiter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login with email and password
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('userType').isIn(['applicant', 'recruiter']).withMessage('Valid user type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType } = req.body;

    // Find user based on type
    let user;
    if (userType === 'applicant') {
      user = await Applicant.findOne({ email });
    } else {
      user = await Recruiter.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Update last active
    user.stats.lastActive = new Date();
    await user.save();

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        currentRole: user.currentRole,
        userType,
        avatar: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
        phoneVerified: user.phoneVerified,
        isKYCVerified: user.isKYCVerified,
        ...(userType === 'recruiter' && { company: user.company })
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.userType === 'applicant') {
      user = await Applicant.findById(decoded.userId).select('-password');
    } else {
      user = await Recruiter.findById(decoded.userId).select('-password');
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currentRole: user.currentRole,
        userType: decoded.userType,
        ...(decoded.userType === 'recruiter' && { company: user.company })
      }
    });

  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
