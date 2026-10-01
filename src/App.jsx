import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AdminNavbar } from './components/AdminNavbar';
import { AdminSidebar } from './components/AdminSidebar';
import { apiService } from './services/api';

// Student Pages
import { Login } from './pages/Login';
import { Dashboard as UserDashboard } from './pages/user/Dashboard';
import { ReportProblem } from './pages/user/ReportProblem';
import { MyProblems } from './pages/user/MyProblems';
import { ProblemDetails as UserProblemDetails } from './pages/user/ProblemDetails';
import { Feedback as UserFeedback } from './pages/user/Feedback';
import { Notifications as UserNotifications } from './pages/user/Notifications';
import { Profile as UserProfile } from './pages/user/Profile';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AllProblems } from './pages/admin/AllProblems';
import { ProblemDetails as AdminProblemDetails } from './pages/admin/ProblemDetails';
import { PriorityQueue } from './pages/admin/PriorityQueue';
import { Departments } from './pages/admin/Departments';
import { Staff } from './pages/admin/Staff';
import { Categories } from './pages/admin/Categories';
import { Locations } from './pages/admin/Locations';
import { Analytics } from './pages/admin/Analytics';
import { Feedback as AdminFeedback } from './pages/admin/Feedback';
import { Notifications as AdminNotifications } from './pages/admin/Notifications';
import { Settings } from './pages/admin/Settings';

// Student Portal Layout
const UserLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await apiService.getNotifications();
        if (res.success && res.notifications) {
          const unread = res.notifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUnread();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex transition-colors duration-200">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        unreadNotifCount={unreadCount}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onMobileMenuToggle={() => setMobileOpen(true)}
          unreadNotifCount={unreadCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Admin Console Layout
const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAdminUnread = async () => {
      try {
        const res = await apiService.getAdminNotifications();
        if (res.success && res.notifications) {
          const unread = res.notifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAdminUnread();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex transition-colors duration-200">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        unreadCount={unreadCount}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminNavbar
          onMobileMenuToggle={() => setMobileOpen(true)}
          unreadCount={unreadCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Sign In Portals */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student & Faculty User Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/report-problem" element={<ReportProblem />} />
            <Route path="/my-problems" element={<MyProblems />} />
            <Route path="/problems/:id" element={<UserProblemDetails />} />
            <Route path="/problems/:id/feedback" element={<UserFeedback />} />
            <Route path="/notifications" element={<UserNotifications />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Admin Application Console Routes */}
          <Route
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/problems" element={<AllProblems />} />
            <Route path="/admin/problems/:id" element={<AdminProblemDetails />} />
            <Route path="/admin/priority" element={<PriorityQueue />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/staff" element={<Staff />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/locations" element={<Locations />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          {/* Fallbacks */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
