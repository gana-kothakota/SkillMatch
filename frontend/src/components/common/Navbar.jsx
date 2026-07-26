import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Search,
  Sun,
  Moon,
  Bell,
  User,
  Briefcase,
  Bookmark,
  FileText,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import GlobalSearchModal from './GlobalSearchModal';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-nav transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <Logo size="md" className="group-hover:scale-105 transition-transform duration-300" />
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                SkillMatch
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-1.5">
              <Link
                to="/jobs"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === '/jobs'
                    ? 'text-indigo-600 dark:text-sky-400 bg-indigo-100/70 dark:bg-slate-800'
                    : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === '/companies'
                    ? 'text-indigo-600 dark:text-sky-400 bg-indigo-100/70 dark:bg-slate-800'
                    : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                Companies
              </Link>

              {user?.role === 'APPLICANT' && (
                <>
                  <Link
                    to="/applicant/dashboard"
                    className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/applicant/saved"
                    className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  >
                    Saved Jobs
                  </Link>
                  <Link
                    to="/applicant/resume"
                    className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  >
                    AI Resume Manager
                  </Link>
                </>
              )}

              {user?.role === 'RECRUITER' && (
                <Link
                  to="/recruiter/dashboard"
                  className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  Recruiter Dashboard
                </Link>
              )}

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  Admin Portal
                </Link>
              )}
            </nav>

            {/* Right Tools - High Contrast Icons & Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Global Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Global Search"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl text-slate-900 dark:text-slate-100 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Light/Dark Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 stroke-[2.5]" /> : <Moon className="w-5 h-5 stroke-[2.5]" />}
              </button>

              {/* Notifications */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 sm:p-2.5 rounded-xl text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Bell className="w-5 h-5 stroke-[2.5]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 animate-fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 dark:text-sky-400 hover:underline flex items-center font-semibold"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 my-2">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">No notifications yet.</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="py-2.5 text-xs space-y-1">
                              <div className="font-bold text-slate-900 dark:text-slate-200">{n.title}</div>
                              <div className="text-slate-600 dark:text-slate-400">{n.message}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Auth Profile Dropdown (Desktop) */}
              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <img
                      src={user.avatar_display || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                      alt={user.username}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
                    />
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {user.username}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 animate-fade-in space-y-1">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{user.username}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{user.email} • {user.role}</div>
                      </div>

                      {user.role === 'APPLICANT' && (
                        <>
                          <Link
                            to="/applicant/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-3 py-2 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2 text-indigo-500" /> Dashboard
                          </Link>
                          <Link
                            to="/applicant/saved"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-3 py-2 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Bookmark className="w-4 h-4 mr-2 text-amber-500" /> Saved Jobs
                          </Link>
                          <Link
                            to="/applicant/resume"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-3 py-2 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <FileText className="w-4 h-4 mr-2 text-indigo-500" /> AI Resume Manager
                          </Link>
                        </>
                      )}

                      {user.role === 'RECRUITER' && (
                        <Link
                          to="/recruiter/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-3 py-2 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2 text-indigo-500" /> Dashboard
                        </Link>
                      )}

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-3 py-2 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2 text-indigo-500" /> Admin Portal
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-xs font-bold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-extrabold rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-extrabold rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 animate-fade-in shadow-2xl">
            {user && (
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={user.avatar_display || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{user.username}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{user.email} • {user.role}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Link
                to="/jobs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800"
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800"
              >
                Companies
              </Link>

              {user?.role === 'APPLICANT' && (
                <>
                  <Link
                    to="/applicant/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/applicant/saved"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800"
                  >
                    Saved Jobs
                  </Link>
                  <Link
                    to="/applicant/resume"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800"
                  >
                    AI Resume Manager
                  </Link>
                </>
              )}

              {user?.role === 'RECRUITER' && (
                <Link
                  to="/recruiter/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800"
                >
                  Recruiter Dashboard
                </Link>
              )}

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800"
                >
                  Admin Portal
                </Link>
              )}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-sm rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

