import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import NxtBeingDashboard from "@/pages/index";
import LandingPage from "@/pages/LandingPage";
import AdminDashboard from "@/pages/AdminDashboard";
import { AccountProvider } from "@/contexts/AccountContext";

function App() {
  return (
    <AccountProvider>
      <Router>
        <Routes>
          {/* Landing page as home */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboard routes (protected/authenticated) */}
          <Route path="/dashboard" element={
            <div className="min-h-screen bg-base-bg">
              <AppShell>
                <NxtBeingDashboard />
              </AppShell>
            </div>
          } />
          
          {/* NxtBeing Routes */}
          <Route path="/jobs" element={
            <div className="min-h-screen bg-base-bg">
              <AppShell>
                <div className="text-white">Job Opportunities - Coming Soon</div>
              </AppShell>
            </div>
          } />
          <Route path="/profile" element={
            <div className="min-h-screen bg-base-bg">
              <AppShell>
                <div className="text-white">My Profile - Coming Soon</div>
              </AppShell>
            </div>
          } />
          <Route path="/skills" element={
            <div className="min-h-screen bg-base-bg">
              <AppShell>
                <div className="text-white">AI Skills - Coming Soon</div>
              </AppShell>
            </div>
          } />
          <Route path="/applications" element={
            <div className="min-h-screen bg-base-bg">
              <AppShell>
                <div className="text-white">Applications - Coming Soon</div>
              </AppShell>
            </div>
          } />
          <Route path="/settings" element={
            <div className="min-h-screen bg-base-bg">
              <AppShell>
                <div className="text-white">Settings - Coming Soon</div>
              </AppShell>
            </div>
          } />
          
          {/* Recruiter Routes (for future implementation) */}
          <Route path="/recruiter" element={
            <div className="min-h-screen bg-base-bg">
              <AppShell>
                <div className="text-white">Recruiter Dashboard - Coming Soon</div>
              </AppShell>
            </div>
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