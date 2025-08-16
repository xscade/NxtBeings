export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  applicants: number;
  tags: string[];
  description: string;
  requirements: string[];
  type: "full-time" | "part-time" | "contract" | "internship";
  experience: "entry" | "mid" | "senior" | "lead";
  remote: boolean;
}

export interface Talent {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  skills: string[];
  location: string;
  experience: string;
  hourlyRate: string;
  availability: string;
  bio: string;
  aiSkills: string[];
  portfolio: string;
}

export const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    posted: "2 hours ago",
    applicants: 12,
    tags: ["React", "TypeScript", "AI Tools"],
    description: "We're looking for a senior React developer who can leverage AI tools to build exceptional user experiences.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "AI tool integration", "Team leadership"],
    type: "full-time",
    experience: "senior",
    remote: false
  },
  {
    id: 2,
    title: "AI Prompt Engineer",
    company: "AI Solutions Inc",
    location: "Remote",
    salary: "$90k - $120k",
    posted: "4 hours ago",
    applicants: 8,
    tags: ["GPT-4", "Midjourney", "Copilot"],
    description: "Join our AI-first team to create innovative prompt engineering solutions.",
    requirements: ["Prompt engineering experience", "GPT-4 expertise", "Creative problem solving", "API integration"],
    type: "full-time",
    experience: "mid",
    remote: true
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    salary: "$100k - $130k",
    posted: "6 hours ago",
    applicants: 15,
    tags: ["Figma", "AI Design", "Prototyping"],
    description: "Create beautiful, AI-enhanced user experiences that delight users.",
    requirements: ["3+ years UX design", "Figma mastery", "AI design tools", "User research"],
    type: "full-time",
    experience: "mid",
    remote: false
  },
  {
    id: 4,
    title: "AI Product Manager",
    company: "Innovation Labs",
    location: "Austin, TX",
    salary: "$130k - $160k",
    posted: "1 day ago",
    applicants: 6,
    tags: ["Product Strategy", "AI Integration", "Analytics"],
    description: "Lead AI-first product development and strategy.",
    requirements: ["5+ years PM experience", "AI product knowledge", "Data analysis", "Cross-functional leadership"],
    type: "full-time",
    experience: "senior",
    remote: true
  },
  {
    id: 5,
    title: "Machine Learning Engineer",
    company: "DataFlow",
    location: "Seattle, WA",
    salary: "$140k - $180k",
    posted: "2 days ago",
    applicants: 20,
    tags: ["Python", "TensorFlow", "MLOps"],
    description: "Build and deploy machine learning models at scale.",
    requirements: ["ML/AI experience", "Python proficiency", "Cloud platforms", "Model deployment"],
    type: "full-time",
    experience: "senior",
    remote: false
  }
];

export const mockTalent: Talent[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "AI-First Developer",
    avatar: "SC",
    rating: 4.9,
    skills: ["React", "TypeScript", "Node.js", "Python"],
    location: "San Francisco",
    experience: "5 years",
    hourlyRate: "$85/hr",
    availability: "Full-time",
    bio: "Full-stack developer with expertise in AI integration and modern web technologies.",
    aiSkills: ["GPT-4", "Copilot", "GitHub Copilot", "Claude"],
    portfolio: "https://sarahchen.dev"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Prompt Engineer",
    avatar: "MR",
    rating: 4.8,
    skills: ["Python", "JavaScript", "API Development", "NLP"],
    location: "Remote",
    experience: "3 years",
    hourlyRate: "$75/hr",
    availability: "Part-time",
    bio: "Specialized in creating effective prompts for AI models and building AI-powered applications.",
    aiSkills: ["Midjourney", "DALL-E", "LangChain", "OpenAI API"],
    portfolio: "https://marcusrodriguez.ai"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "AI Product Manager",
    avatar: "ET",
    rating: 4.7,
    skills: ["Product Strategy", "User Research", "Data Analysis", "Agile"],
    location: "New York",
    experience: "7 years",
    hourlyRate: "$95/hr",
    availability: "Full-time",
    bio: "Product manager with deep expertise in AI product development and user experience.",
    aiSkills: ["Product Strategy", "AI Integration", "Analytics", "A/B Testing"],
    portfolio: "https://emmathompson.com"
  },
  {
    id: 4,
    name: "Alex Kim",
    role: "UX Designer",
    avatar: "AK",
    rating: 4.6,
    skills: ["Figma", "Sketch", "Prototyping", "User Research"],
    location: "Los Angeles",
    experience: "4 years",
    hourlyRate: "$70/hr",
    availability: "Full-time",
    bio: "UX designer focused on creating intuitive, AI-enhanced user experiences.",
    aiSkills: ["AI Design Tools", "Midjourney", "Figma AI", "Prototyping"],
    portfolio: "https://alexkim.design"
  },
  {
    id: 5,
    name: "David Park",
    role: "Machine Learning Engineer",
    avatar: "DP",
    rating: 4.9,
    skills: ["Python", "TensorFlow", "PyTorch", "AWS"],
    location: "Seattle",
    experience: "6 years",
    hourlyRate: "$100/hr",
    availability: "Full-time",
    bio: "ML engineer with expertise in building scalable AI systems and models.",
    aiSkills: ["TensorFlow", "PyTorch", "Hugging Face", "MLOps"],
    portfolio: "https://davidpark.ml"
  },
  {
    id: 6,
    name: "Lisa Wang",
    role: "AI Content Creator",
    avatar: "LW",
    rating: 4.5,
    skills: ["Content Strategy", "Copywriting", "SEO", "Social Media"],
    location: "Remote",
    experience: "3 years",
    hourlyRate: "$60/hr",
    availability: "Part-time",
    bio: "Content creator who leverages AI tools to produce engaging, high-quality content.",
    aiSkills: ["ChatGPT", "Jasper", "Copy.ai", "Content Creation"],
    portfolio: "https://lisawang.content"
  }
];

export const mockFilters = {
  roles: ["Developer", "Designer", "Product Manager", "Engineer", "Creator"],
  locations: ["San Francisco", "New York", "Remote", "Los Angeles", "Seattle"],
  experience: ["Entry", "Mid", "Senior", "Lead"],
  aiSkills: ["GPT-4", "Copilot", "Midjourney", "DALL-E", "Claude", "Jasper"],
  salaryRanges: ["$50k-$75k", "$75k-$100k", "$100k-$125k", "$125k-$150k", "$150k+"]
};
