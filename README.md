# NxtBeings - AI-First Recruitment Platform

A modern recruitment platform designed for AI-first professionals and forward-thinking recruiters. Built with React, TypeScript, Node.js, and MongoDB.

## Features

### For Applicants (AI-First Professionals)
- **AI Skills Tracking**: Monitor and showcase your AI tool proficiency
- **Smart Job Matching**: AI-powered job recommendations based on skills
- **Profile Analytics**: Track profile views and application success
- **Skill Development**: Progress tracking for AI and technical skills
- **Portfolio Management**: Showcase projects and achievements

### For Recruiters
- **AI-Focused Hiring**: Find candidates with specific AI tool experience
- **Analytics Dashboard**: Track job performance and candidate engagement
- **Team Management**: Manage multiple recruiters and permissions
- **Smart Matching**: AI-powered candidate-job matching
- **Application Pipeline**: Streamlined application review process

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Radix UI** for accessible components
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd NxtBeings
```

### 2. Environment Setup

#### Frontend Environment
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=NxtBeings
```

#### Backend Environment
Create a `.env` file in the `server` directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nxtbeings
MONGODB_DB_NAME=nxtbeings

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 3. Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
```

### 4. Start Development Servers

#### Backend (Terminal 1)
```bash
cd server
npm run dev
```

#### Frontend (Terminal 2)
```bash
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/health

## Database Schema

### Applicant Schema
```javascript
{
  // Basic Information
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  dateOfBirth: Date,
  gender: String,
  
  // Profile Information
  avatar: String,
  bio: String,
  headline: String,
  location: {
    city: String,
    state: String,
    country: String,
    timezone: String
  },
  
  // Professional Information
  currentRole: String,
  yearsOfExperience: Number,
  expectedSalary: {
    min: Number,
    max: Number,
    currency: String
  },
  
  // Skills
  aiSkills: [{
    name: String,
    level: String,
    yearsOfExperience: Number,
    isCertified: Boolean
  }],
  technicalSkills: [{
    name: String,
    level: String,
    yearsOfExperience: Number,
    isCertified: Boolean
  }],
  
  // Experience & Education
  workExperience: [ExperienceSchema],
  education: [EducationSchema],
  projects: [ProjectSchema],
  
  // Dashboard Stats
  stats: {
    applicationsSubmitted: Number,
    interviewsScheduled: Number,
    offersReceived: Number,
    profileViews: Number
  }
}
```

### Recruiter Schema
```javascript
{
  // Basic Information
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  
  // Professional Information
  currentRole: String,
  department: String,
  yearsOfExperience: Number,
  
  // Company Information
  company: {
    name: String,
    industry: String,
    size: String,
    website: String,
    logo: String
  },
  
  // Job Postings
  jobPostings: [JobPostingSchema],
  
  // Dashboard Stats
  stats: {
    totalJobPostings: Number,
    activeJobPostings: Number,
    totalApplications: Number,
    hiresMade: Number
  },
  
  // Permissions
  permissions: {
    canPostJobs: Boolean,
    canViewApplications: Boolean,
    canManageTeam: Boolean,
    canViewAnalytics: Boolean
  }
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register/applicant` - Register new applicant
- `POST /api/auth/register/recruiter` - Register new recruiter
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/applicant/:userId` - Get applicant dashboard data
- `GET /api/dashboard/recruiter/:userId` - Get recruiter dashboard data
- `GET /api/dashboard/analytics` - Get platform analytics

### Profiles
- `GET /api/applicants/:id` - Get applicant profile
- `PUT /api/applicants/:id` - Update applicant profile
- `GET /api/recruiters/:id` - Get recruiter profile
- `PUT /api/recruiters/:id` - Update recruiter profile

## Development

### Project Structure
```
NxtBeings/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and services
│   ├── pages/             # Page components
│   └── layouts/           # Layout components
├── server/                # Backend source
│   ├── config/            # Configuration files
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@nxtbeings.com or create an issue in the repository.
