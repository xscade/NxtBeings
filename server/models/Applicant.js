import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  isCertified: {
    type: Boolean,
    default: false
  },
  certificationName: String,
  certificationDate: Date
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  startDate: Date,
  endDate: Date,
  isOngoing: {
    type: Boolean,
    default: false
  },
  impact: String,
  teamSize: Number
});

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  gpa: Number,
  isCurrent: {
    type: Boolean,
    default: false
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  startDate: Date,
  endDate: Date,
  isCurrent: {
    type: Boolean,
    default: false
  },
  description: String,
  technologies: [String],
  achievements: [String]
});

const applicantSchema = new mongoose.Schema({
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
  currentRole: String,
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  expectedSalary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  preferredWorkType: [{
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship']
  }],
  preferredLocation: [{
    type: String,
    enum: ['remote', 'onsite', 'hybrid']
  }],
  willingToRelocate: {
    type: Boolean,
    default: false
  },
  
  // AI & Technical Skills
  aiSkills: [skillSchema],
  technicalSkills: [skillSchema],
  softSkills: [String],
  programmingLanguages: [String],
  frameworks: [String],
  databases: [String],
  cloudPlatforms: [String],
  aiTools: [String],
  
  // Experience & Education
  workExperience: [experienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  
  // Portfolio & Links
  portfolio: {
    website: String,
    github: String,
    linkedin: String,
    twitter: String,
    blog: String
  },
  
  // Job Preferences
  industries: [String],
  companySize: [{
    type: String,
    enum: ['startup', 'small', 'medium', 'large', 'enterprise']
  }],
  jobTitles: [String],
  
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
    applicationsSubmitted: {
      type: Number,
      default: 0
    },
    interviewsScheduled: {
      type: Number,
      default: 0
    },
    offersReceived: {
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
  
  // Settings
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'recruiters-only'],
      default: 'public'
    },
    jobAlerts: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
applicantSchema.index({ email: 1 });
applicantSchema.index({ 'location.country': 1, 'location.state': 1 });
applicantSchema.index({ 'technicalSkills.name': 1 });
applicantSchema.index({ 'aiSkills.name': 1 });
applicantSchema.index({ isActive: 1, isVerified: 1 });

// Virtual for full name
applicantSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to calculate profile completion
applicantSchema.methods.calculateProfileCompletion = function() {
  let completion = 0;
  const fields = [
    'firstName', 'lastName', 'email', 'bio', 'headline', 'currentRole',
    'location', 'technicalSkills', 'workExperience', 'education'
  ];
  
  fields.forEach(field => {
    if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : true)) {
      completion += 100 / fields.length;
    }
  });
  
  return Math.round(completion);
};

// Pre-save middleware to update profile completion
applicantSchema.pre('save', function(next) {
  this.profileCompletion = this.calculateProfileCompletion();
  next();
});

export default mongoose.model('Applicant', applicantSchema);
