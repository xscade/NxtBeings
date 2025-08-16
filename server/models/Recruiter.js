import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true
  },
  size: {
    type: String,
    enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    required: true
  },
  website: String,
  logo: String,
  description: String,
  founded: Number,
  headquarters: {
    city: String,
    state: String,
    country: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  responsibilities: [String],
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  location: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    required: true
  },
  workType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  skills: [String],
  aiSkills: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed'],
    default: 'draft'
  },
  applications: [{
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicant'
    },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected'],
      default: 'applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const recruiterSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500
  },
  headline: {
    type: String,
    maxlength: 100
  },
  location: {
    city: String,
    state: String,
    country: String,
    timezone: String
  },
  
  // Professional Information
  currentRole: {
    type: String,
    required: true
  },
  department: String,
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  specialization: [String],
  
  // Company Information
  company: companySchema,
  isCompanyAdmin: {
    type: Boolean,
    default: false
  },
  permissions: {
    canPostJobs: {
      type: Boolean,
      default: true
    },
    canViewApplications: {
      type: Boolean,
      default: true
    },
    canManageTeam: {
      type: Boolean,
      default: false
    },
    canViewAnalytics: {
      type: Boolean,
      default: true
    }
  },
  
  // Hiring Preferences
  hiringFor: [{
    role: String,
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive']
    },
    skills: [String],
    aiSkills: [String]
  }],
  
  // Portfolio & Links
  portfolio: {
    website: String,
    linkedin: String,
    twitter: String,
    companyWebsite: String
  },
  
  // Job Postings
  jobPostings: [jobPostingSchema],
  
  // Application Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isKYCVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  profileCompletion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Dashboard Stats
  stats: {
    totalJobPostings: {
      type: Number,
      default: 0
    },
    activeJobPostings: {
      type: Number,
      default: 0
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    interviewsScheduled: {
      type: Number,
      default: 0
    },
    hiresMade: {
      type: Number,
      default: 0
    },
    profileViews: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  
  // Analytics
  analytics: {
    monthlyViews: [{
      month: String,
      views: Number
    }],
    monthlyApplications: [{
      month: String,
      applications: Number
    }],
    topPerformingJobs: [{
      jobId: mongoose.Schema.Types.ObjectId,
      title: String,
      applications: Number,
      views: Number
    }]
  },
  
  // Settings
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'applicants-only'],
      default: 'public'
    },
    applicationAlerts: {
      type: Boolean,
      default: true
    },
    autoReply: {
      type: Boolean,
      default: false
    },
    autoReplyMessage: String
  },
  
  // Team Management (for company admins)
  teamMembers: [{
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter'
    },
    role: String,
    permissions: {
      canPostJobs: Boolean,
      canViewApplications: Boolean,
      canManageTeam: Boolean,
      canViewAnalytics: Boolean
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
recruiterSchema.index({ email: 1 });
recruiterSchema.index({ 'company.name': 1 });
recruiterSchema.index({ 'location.country': 1, 'location.state': 1 });
recruiterSchema.index({ isActive: 1, isVerified: 1 });
recruiterSchema.index({ 'hiringFor.role': 1 });

// Virtual for full name
recruiterSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to calculate profile completion
recruiterSchema.methods.calculateProfileCompletion = function() {
  let completion = 0;
  const fields = [
    'firstName', 'lastName', 'email', 'bio', 'headline', 'currentRole',
    'company', 'location', 'hiringFor'
  ];
  
  fields.forEach(field => {
    if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : true)) {
      completion += 100 / fields.length;
    }
  });
  
  return Math.round(completion);
};

// Method to update stats
recruiterSchema.methods.updateStats = function() {
  this.stats.totalJobPostings = this.jobPostings.length;
  this.stats.activeJobPostings = this.jobPostings.filter(job => job.status === 'active').length;
  this.stats.totalApplications = this.jobPostings.reduce((total, job) => {
    return total + job.applications.length;
  }, 0);
};

// Pre-save middleware to update profile completion and stats
recruiterSchema.pre('save', function(next) {
  this.profileCompletion = this.calculateProfileCompletion();
  this.updateStats();
  next();
});

export default mongoose.model('Recruiter', recruiterSchema);
