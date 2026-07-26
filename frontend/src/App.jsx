import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/public/Home';
import Jobs from './pages/public/Jobs';
import JobDetails from './pages/public/JobDetails';
import Companies from './pages/public/Companies';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

import ApplicantDashboard from './pages/applicant/ApplicantDashboard';
import ResumeManager from './pages/applicant/ResumeManager';
import SavedJobs from './pages/applicant/SavedJobs';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Applicant Protected Routes */}
                  <Route
                    path="/applicant/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['APPLICANT']}>
                        <ApplicantDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/applicant/resume"
                    element={
                      <ProtectedRoute allowedRoles={['APPLICANT']}>
                        <ResumeManager />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/applicant/saved"
                    element={
                      <ProtectedRoute allowedRoles={['APPLICANT']}>
                        <SavedJobs />
                      </ProtectedRoute>
                    }
                  />

                  {/* Recruiter Protected Routes */}
                  <Route
                    path="/recruiter/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                        <RecruiterDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
