import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Briefcase, 
  User,
  Settings, 
  Menu, 
  X, 
  Search, 
  Bell, 
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Target,
  Zap
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { useAccount } from "@/contexts/AccountContext";

interface AppShellProps {
  children: React.ReactNode;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Briefcase, label: "Job Opportunities", href: "/jobs" },
  { icon: User, label: "My Profile", href: "/profile" },
  { icon: BookOpen, label: "AI Skills", href: "/skills" },
  { icon: Target, label: "Applications", href: "/applications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { accountType, user } = useAccount();

  return (
    <div className="min-h-screen bg-base-bg">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed left-0 top-0 z-50 h-full glass-card rounded-none border-r border-white/10
          ${sidebarCollapsed ? 'w-16' : 'w-64'} 
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        initial={false}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <div className="h-8 w-8 rounded-lg primary-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-semibold text-white text-lg futuristic-glow">
                  NxtBeings
                </span>
              </motion.div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5 text-white" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <motion.li key={item.href}>
                  <a
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200
                      hover:bg-white/10 text-white/80 hover:text-white
                      ${window.location.pathname === item.href ? 'bg-primary-500/20 text-primary-500' : ''}
                    `}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user?.avatar}</span>
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="primary" size="sm">
                      <Zap className="h-2 w-2 mr-1" />
                      {accountType === 'applicant' ? 'AI-First' : 'Recruiter'}
                    </Badge>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <motion.header
          className="sticky top-0 z-30 glass-card rounded-none border-b border-white/10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex h-16 items-center justify-between px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder={accountType === 'applicant' 
                    ? "Search jobs, skills, opportunities..." 
                    : "Search talent, jobs, candidates..."
                  }
                  className="w-full pl-10 pr-4 py-2 glass-input text-white placeholder-white/60"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
                <Bell className="h-5 w-5 text-white" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary-500 rounded-full"></span>
              </button>
              <PrimaryButton size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                {accountType === 'applicant' ? 'Update Skills' : 'Post Job'}
              </PrimaryButton>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
