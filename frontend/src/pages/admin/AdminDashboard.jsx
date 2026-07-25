import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Building2, Briefcase, FileText, CheckCircle2, XCircle, Trash2, Edit, MapPin } from 'lucide-react';
import MatchScoreBadge from '../../components/ui/MatchScoreBadge';
import { APPLICATION_STATUS_CONFIG } from '../../utils/constants';
import { formatDate, formatSalary } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'companies' | 'jobs' | 'applications'
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resUsers, resCompanies, resJobs, resApps] = await Promise.all([
        api.get('/analytics/admin/'),
        api.get('/users/admin-manage/'),
        api.get('/companies/'),
        api.get('/jobs/'),
        api.get('/applications/'),
      ]);
      setAnalytics(resAnalytics.data);
      setUsersList(resUsers.data.results || resUsers.data || []);
      setCompaniesList(resCompanies.data.results || resCompanies.data || []);
      setJobsList(resJobs.data.results || resJobs.data || []);
      setApplicationsList(resApps.data.results || resApps.data || []);
    } catch (err) {
      console.error('Admin dashboard load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // User Actions
  const toggleUserActive = async (userId, currentActive) => {
    try {
      await api.patch(`/users/admin-manage/${userId}/`, { is_active: !currentActive });
      toast.success('User status updated.');
      fetchData();
    } catch (err) {
      toast.error('Failed to update user status.');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/admin-manage/${userId}/`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      await api.delete(`/users/admin-manage/${userId}/`);
      toast.success('User deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete user.');
    }
  };

  // Company Actions
  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Delete this company entry?')) return;
    try {
      await api.delete(`/companies/${companyId}/`);
      toast.success('Company deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete company.');
    }
  };

  // Job Actions
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job listing?')) return;
    try {
      await api.delete(`/jobs/${jobId}/`);
      toast.success('Job deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete job.');
    }
  };

  // Application Actions
  const handleDeleteApplication = async (appId) => {
    if (!window.confirm('Delete this application record?')) return;
    try {
      await api.delete(`/applications/${appId}/`);
      toast.success('Application deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete application.');
    }
  };

  const handleApplicationStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status/`, { status: newStatus });
      toast.success('Application status updated.');
      fetchData();
    } catch (err) {
      toast.error('Failed to update application status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
          <ShieldCheck className="w-8 h-8 mr-2.5 text-indigo-500" /> Enterprise Admin Portal
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Full system administration power to edit, delete, and inspect users, companies, active jobs, and candidate applications.
        </p>
      </div>

      {/* Metrics Row (Interactive Tab Selectors) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`text-left p-6 rounded-2xl transition-all border ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-600'
              : 'glass-card hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div className={`text-xs font-bold uppercase tracking-wider flex items-center ${activeTab === 'users' ? 'text-indigo-100' : 'text-slate-400'}`}>
            <Users className="w-4 h-4 mr-1.5" /> Total Registered Users
          </div>
          <div className="text-3xl font-extrabold mt-1">{analytics?.total_users || usersList.length}</div>
          <div className={`text-xs mt-1 ${activeTab === 'users' ? 'text-indigo-100 font-medium' : 'text-slate-500'}`}>
            {analytics?.applicants_count || 0} Applicants • {analytics?.recruiters_count || 0} Recruiters
          </div>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`text-left p-6 rounded-2xl transition-all border ${
            activeTab === 'companies'
              ? 'bg-sky-600 text-white shadow-xl shadow-sky-600/30 border-sky-600'
              : 'glass-card hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div className={`text-xs font-bold uppercase tracking-wider flex items-center ${activeTab === 'companies' ? 'text-sky-100' : 'text-slate-400'}`}>
            <Building2 className="w-4 h-4 mr-1.5" /> Companies
          </div>
          <div className="text-3xl font-extrabold mt-1">{analytics?.companies_count || companiesList.length}</div>
          <div className={`text-xs mt-1 ${activeTab === 'companies' ? 'text-sky-100 font-medium' : 'text-slate-500'}`}>
            Corporate Directory
          </div>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`text-left p-6 rounded-2xl transition-all border ${
            activeTab === 'jobs'
              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 border-emerald-600'
              : 'glass-card hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div className={`text-xs font-bold uppercase tracking-wider flex items-center ${activeTab === 'jobs' ? 'text-emerald-100' : 'text-slate-400'}`}>
            <Briefcase className="w-4 h-4 mr-1.5" /> Active Job Openings
          </div>
          <div className="text-3xl font-extrabold mt-1">{analytics?.active_jobs || jobsList.length}</div>
          <div className={`text-xs mt-1 ${activeTab === 'jobs' ? 'text-emerald-100 font-medium' : 'text-slate-500'}`}>
            Listings Portal
          </div>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`text-left p-6 rounded-2xl transition-all border ${
            activeTab === 'applications'
              ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/30 border-purple-600'
              : 'glass-card hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div className={`text-xs font-bold uppercase tracking-wider flex items-center ${activeTab === 'applications' ? 'text-purple-100' : 'text-slate-400'}`}>
            <FileText className="w-4 h-4 mr-1.5" /> Applications Submitted
          </div>
          <div className="text-3xl font-extrabold mt-1">{analytics?.total_applications || applicationsList.length}</div>
          <div className={`text-xs mt-1 ${activeTab === 'applications' ? 'text-purple-100 font-medium' : 'text-slate-500'}`}>
            Recruitment Submissions
          </div>
        </button>
      </div>

      {/* Tab 1: Users Management */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registered User Accounts ({usersList.length})</h2>
            <span className="text-xs text-slate-500">Edit Roles, Change Account Status, or Delete Users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">User & Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Registered Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{u.username}</div>
                      <div className="text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="APPLICANT">APPLICANT</option>
                        <option value="RECRUITER">RECRUITER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => toggleUserActive(u.id, u.is_active)}
                        className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                          u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-4 text-slate-500">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-400"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Companies Management */}
      {activeTab === 'companies' && (
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registered Companies Directory ({companiesList.length})</h2>
            <span className="text-xs text-slate-500">Inspect Corporate Entities & Delete Entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Company Name</th>
                  <th className="pb-3">Industry</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Website</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {companiesList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-4 font-bold text-slate-900 dark:text-white text-sm">{c.name}</td>
                    <td className="py-4 font-semibold text-indigo-600 dark:text-sky-400">{c.industry || 'Technology'}</td>
                    <td className="py-4 text-slate-700 dark:text-slate-300">{c.location || 'Remote'}</td>
                    <td className="py-4">
                      {c.website ? (
                        <a href={c.website} target="_blank" rel="noreferrer" className="text-sky-500 hover:underline">
                          {c.website}
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteCompany(c.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-400"
                        title="Delete Company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Jobs Management */}
      {activeTab === 'jobs' && (
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Job Listings ({jobsList.length})</h2>
            <span className="text-xs text-slate-500">Global Jobs Management & Deletion</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Job Title & Company</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Salary Range</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {jobsList.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</div>
                      <div className="text-indigo-600 dark:text-sky-400 font-semibold">{job.company?.name || 'Custom Enterprise'}</div>
                    </td>
                    <td className="py-4 text-slate-700 dark:text-slate-300">{job.location || 'Remote'}</td>
                    <td className="py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-bold">{job.job_type}</span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-400"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Applications Management */}
      {activeTab === 'applications' && (
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Candidate Applications ({applicationsList.length})</h2>
            <span className="text-xs text-slate-500">Pipeline Override & Record Removal</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Applied Job</th>
                  <th className="pb-3">AI Match</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applicationsList.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{app.applicant_details?.username}</div>
                      <div className="text-slate-400">{app.applicant_details?.email}</div>
                    </td>
                    <td className="py-4 font-semibold text-slate-800 dark:text-slate-200">{app.job_details?.title}</td>
                    <td className="py-4">
                      <MatchScoreBadge score={app.ai_match_score} size="sm" />
                    </td>
                    <td className="py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleApplicationStatusChange(app.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        {Object.entries(APPLICATION_STATUS_CONFIG).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-400"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
