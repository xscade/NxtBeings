import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import NxtBeingDashboard from "@/pages/NxtBeingDashboard";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import LandingPage from "@/pages/LandingPage";
import AdminDashboard from "@/pages/AdminDashboard";
import { RouteGuard } from "@/components/RouteGuard";
import { AccountProvider } from "@/contexts/AccountContext";

function App() {
  return (
    <AccountProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Generic Dashboard Route - Redirects to specific dashboard */}
          <Route path="/dashboard" element={
            <RouteGuard>
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Redirecting to your dashboard...</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          
          {/* NxtBeing Routes */}
          <Route path="/nxtbeing/dashboard" element={
            <RouteGuard requiredUserType="applicant">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <NxtBeingDashboard />
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/nxtbeing/jobs" element={
            <RouteGuard requiredUserType="applicant">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Job Search - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/nxtbeing/applications" element={
            <RouteGuard requiredUserType="applicant">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">My Applications - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/nxtbeing/profile" element={
            <RouteGuard requiredUserType="applicant">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Profile - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/nxtbeing/settings" element={
            <RouteGuard requiredUserType="applicant">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Settings - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          
          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={
            <RouteGuard requiredUserType="recruiter">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <RecruiterDashboard />
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/recruiter/jobs" element={
            <RouteGuard requiredUserType="recruiter">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Job Postings - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/recruiter/search" element={
            <RouteGuard requiredUserType="recruiter">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Search Talent - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/recruiter/applications" element={
            <RouteGuard requiredUserType="recruiter">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Applications - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/recruiter/candidates" element={
            <RouteGuard requiredUserType="recruiter">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Candidates - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          <Route path="/recruiter/settings" element={
            <RouteGuard requiredUserType="recruiter">
              <div className="min-h-screen bg-base-bg">
                <AppShell>
                  <div className="text-white">Settings - Coming Soon</div>
                </AppShell>
              </div>
            </RouteGuard>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <div className="min-h-screen bg-base-bg">
              <AdminDashboard />
            </div>
          } />
        </Routes>
      </Router>
    </AccountProvider>
  );
}

export default App;