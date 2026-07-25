import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Plus, Briefcase, Users, Sparkles, CheckCircle, Clock, Eye, Edit, Trash2, MapPin, DollarSign, Building2 } from 'lucide-react';
import MatchScoreBadge from '../../components/ui/MatchScoreBadge';
import { APPLICATION_STATUS_CONFIG, JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import { formatDate, formatSalary } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Job Modal state (Create / Edit)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    company_name: '',
    job_type: 'FULL_TIME',
    experience_level: 'MID',
    salary_min: 90000,
    salary_max: 130000,
    salary_currency: 'USD',
    location: 'Remote',
    required_skills: ['React', 'Python', 'Django'],
    description: '',
  });

  const [skillInput, setSkillInput] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resJobs, resApps, resComp] = await Promise.all([
        api.get('/analytics/recruiter/'),
        api.get('/jobs/'),
        api.get('/applications/'),
        api.get('/companies/'),
      ]);
      setAnalytics(resAnalytics.data);
      setJobs(resJobs.data.results || resJobs.data || []);
      setApplications(resApps.data.results || resApps.data || []);
      setCompanies(resComp.data.results || resComp.data || []);
    } catch (err) {
      console.error('Recruiter dashboard load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      company_name: '',
      job_type: 'FULL_TIME',
      experience_level: 'MID',
      salary_min: 90000,
      salary_max: 130000,
      salary_currency: 'USD',
      location: 'Remote',
      required_skills: ['React', 'Python', 'Django'],
      description: '',
    });
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsJobModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title || '',
      company_name: job.company?.name || '',
      job_type: job.job_type || 'FULL_TIME',
      experience_level: job.experience_level || 'MID',
      salary_min: job.salary_min || 90000,
      salary_max: job.salary_max || 130000,
      salary_currency: job.salary_currency || 'USD',
      location: job.location || 'Remote',
      required_skills: job.required_skills || [],
      description: job.description || '',
    });
    setIsJobModalOpen(true);
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}/`, jobForm);
        toast.success('Job position updated successfully!');
      } else {
        await api.post('/jobs/', jobForm);
        toast.success('Job position posted successfully!');
      }
      setIsJobModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(editingJobId ? 'Failed to update job.' : 'Failed to post job.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}/`);
      toast.success('Job posting deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete job.');
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !jobForm.required_skills.includes(skillInput.trim())) {
      setJobForm({ ...jobForm, required_skills: [...jobForm.required_skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setJobForm({ ...jobForm, required_skills: jobForm.required_skills.filter((s) => s !== skill) });
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status/`, { status: newStatus });
      toast.success(`Application status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Recruiter Analytics & Hiring Portal</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage active job listings, view applicant AI match scores, and progress candidates through the hiring pipeline.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Post New Job
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
            <Briefcase className="w-4 h-4 mr-1.5 text-indigo-500" /> Active Job Openings
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.total_posted_jobs || jobs.length}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
            <Users className="w-4 h-4 mr-1.5 text-sky-500" /> Total Applications Received
          </div>
          <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
            {analytics?.total_applications_received || applications.length}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 text-emerald-500" /> Avg Candidate AI Compatibility
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {analytics?.average_candidate_match || 0}%
          </div>
        </div>
      </div>

      {/* Recruiter Posted Jobs Management Section */}
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Posted Job Listings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Edit parameters, adjust salary & location, or remove open roles.</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-sky-300 hover:bg-indigo-100 flex items-center"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add New Job
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Job Title & Company</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Salary Range</th>
                <th className="pb-3">Type / Level</th>
                <th className="pb-3">Posted Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No jobs posted yet. Click "Post New Job" to list your first opportunity.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</div>
                      <div className="text-indigo-600 dark:text-sky-400 font-semibold">{job.company?.name || 'Custom Enterprise'}</div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center text-slate-700 dark:text-slate-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.location || 'Remote'}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[11px] mr-1">
                        {job.job_type}
                      </span>
                      <span className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-sky-300 font-bold text-[11px]">
                        {job.experience_level}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">
                      {formatDate(job.created_at)}
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(job)}
                        className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-sky-300 hover:bg-indigo-100 transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Applications Chart & Top Demanded Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Candidate Applications Trend</h3>
          <div className="h-64">
            {analytics?.monthly_applications?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthly_applications}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                  <Bar dataKey="applications" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Application analytics data populates as candidates apply.
              </div>
            )}
          </div>
        </div>

        {/* Top Demanded Skills */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Top Demanded Skills</h3>
          <div className="space-y-3">
            {analytics?.top_demanded_skills?.map((item) => (
              <div key={item.skill} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.skill}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  {item.count} jobs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Applications Management */}
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Applicant Pipeline & AI Match Ratings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Applied Job</th>
                <th className="pb-3">AI Match Score</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{app.applicant_details?.username}</div>
                    <div className="text-slate-400">{app.applicant_details?.email}</div>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{app.job_details?.title}</div>
                    <div className="text-slate-400">{formatDate(app.created_at)}</div>
                  </td>
                  <td className="py-4">
                    <MatchScoreBadge score={app.ai_match_score} size="sm" />
                  </td>
                  <td className="py-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      {Object.entries(APPLICATION_STATUS_CONFIG).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4">
                    {app.resume_details?.pdf_url ? (
                      <a
                        href={app.resume_details.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-sky-300 font-semibold hover:underline"
                      >
                        View Resume PDF
                      </a>
                    ) : (
                      <span className="text-slate-400">No PDF</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post / Edit Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingJobId ? 'Edit Job Listing' : 'Post Enterprise Job Role'}
              </h3>
              <button onClick={() => setIsJobModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSubmitJob} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
              </div>

              {/* Custom Company Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Company Name <span className="text-slate-400 font-normal">(Custom or Select)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.company_name}
                    onChange={(e) => setJobForm({ ...jobForm, company_name: e.target.value })}
                    placeholder="e.g. Acme Tech Global"
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>
              </div>

              {/* Salary Inputs */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={jobForm.salary_min}
                    onChange={(e) => setJobForm({ ...jobForm, salary_min: Number(e.target.value) })}
                    placeholder="90000"
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={jobForm.salary_max}
                    onChange={(e) => setJobForm({ ...jobForm, salary_max: Number(e.target.value) })}
                    placeholder="140000"
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Currency</label>
                  <select
                    value={jobForm.salary_currency}
                    onChange={(e) => setJobForm({ ...jobForm, salary_currency: e.target.value })}
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Job Type</label>
                  <select
                    value={jobForm.job_type}
                    onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Experience Level</label>
                  <select
                    value={jobForm.experience_level}
                    onChange={(e) => setJobForm({ ...jobForm, experience_level: e.target.value })}
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Required Skills (Add tags)</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g. React, Python, Docker"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 bg-indigo-600 text-white rounded-xl font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {jobForm.required_skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-sky-300 font-bold flex items-center">
                      {s} <button type="button" onClick={() => handleRemoveSkill(s)} className="ml-1 text-rose-500 font-extrabold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Comprehensive job responsibility overview..."
                  className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all"
              >
                {editingJobId ? 'Save Changes' : 'Publish Job Role'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
