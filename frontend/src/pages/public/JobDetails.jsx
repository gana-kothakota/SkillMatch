import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, Sparkles, CheckCircle2, AlertCircle, FileText, Send, ArrowLeft, Bookmark } from 'lucide-react';
import MatchScoreBadge from '../../components/ui/MatchScoreBadge';
import { formatSalaryRange, formatDate } from '../../utils/formatters';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply Modal state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}/`);
      setJob(res.data);
    } catch (err) {
      console.error('Failed to load job details', err);
      toast.error('Job not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit an application.');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/applications/', {
        job: job.id,
        cover_letter: coverLetter,
      });
      toast.success('Application submitted successfully!');
      setIsApplyOpen(false);
      fetchJobDetails(); // Refresh application status
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit application.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link to="/jobs" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Jobs
      </Link>

      {/* Main Header Card */}
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={job.company?.logo_display || `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company?.name}`}
              alt={job.company?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/20"
            />
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-sky-400">
                {job.company?.name}
              </h3>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {job.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {job.has_applied ? (
              <span className="px-5 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Application Submitted
              </span>
            ) : (
              <button
                onClick={() => setIsApplyOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-sky-500" /> {job.location}</span>
          <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1 text-indigo-500" /> {job.job_type}</span>
          <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1 text-emerald-500" /> {formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}</span>
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-purple-500" /> Posted {formatDate(job.created_at)}</span>
        </div>
      </div>

      {/* AI Skill Match Analysis Card (If user logged in & active resume) */}
      {job.ai_match && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-tr from-indigo-50/40 via-sky-50/20 to-emerald-50/20 dark:from-slate-900 dark:to-indigo-950/40 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Skill Compatibility Analysis</h2>
            </div>
            <MatchScoreBadge score={job.ai_match.score} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Matched Skills ({job.ai_match.matched_skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.ai_match.matched_skills?.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> Missing Competencies ({job.ai_match.missing_skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.ai_match.missing_skills?.length === 0 ? (
                  <span className="text-xs text-slate-500">None! You possess all required technical skills.</span>
                ) : (
                  job.ai_match.missing_skills?.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-semibold">
                      ✕ {s}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          {job.ai_match.recommendations?.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-sky-300 font-medium">
              💡 <strong>AI Guidance:</strong> {job.ai_match.recommendations[0]}
            </div>
          )}
        </div>
      )}

      {/* Full Description */}
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job Overview & Requirements</h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line text-sm leading-relaxed">
          {job.description}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Required Technical Stack</h4>
          <div className="flex flex-wrap gap-2">
            {job.required_skills?.map((s) => (
              <span key={s} className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-sky-300 font-semibold text-xs border border-indigo-100 dark:border-slate-700">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Job Application</h3>
              <button onClick={() => setIsApplyOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Cover Letter / Note to Recruiter
                </label>
                <textarea
                  rows={4}
                  placeholder="Introduce yourself and explain why you're a great fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" /> Active Resume PDF attached
                </span>
                <Link to="/applicant/resume" className="text-indigo-600 dark:text-sky-400 font-semibold hover:underline">
                  Manage Resume
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
              >
                {submitting ? 'Submitting...' : 'Confirm Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
