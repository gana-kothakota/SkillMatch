import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, Sparkles, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import MatchScoreBadge from '../../components/ui/MatchScoreBadge';
import { APPLICATION_STATUS_CONFIG } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAnalytics, resApps] = await Promise.all([
          api.get('/analytics/applicant/'),
          api.get('/applications/'),
        ]);
        setAnalytics(resAnalytics.data);
        setApplications(resApps.data.results || resApps.data || []);
      } catch (err) {
        console.error('Failed to load applicant dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Candidate Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Track your job applications, AI match metrics, and recruitment pipeline status.
          </p>
        </div>
        <Link
          to="/applicant/resume"
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
        >
          <FileText className="w-4 h-4 mr-2" /> AI Resume Manager
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
            <Briefcase className="w-4 h-4 mr-1.5 text-indigo-500" /> Submitted Applications
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.total_applied || applications.length}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 text-emerald-500" /> Average AI Match Score
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {analytics?.average_ai_match || 0}%
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
            <Bookmark className="w-4 h-4 mr-1.5 text-amber-500" /> Saved Roles
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {analytics?.saved_jobs_count || 0}
          </div>
        </div>
      </div>

      {/* Application Timeline Tracking */}
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Application Pipeline & Timeline</h2>

        {loading ? (
          <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ) : applications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Clock className="w-10 h-10 mx-auto text-slate-400" />
            <p>You haven't submitted any job applications yet.</p>
            <Link to="/jobs" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
              Browse Open Roles
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((app) => {
              const statusCfg = APPLICATION_STATUS_CONFIG[app.status] || { label: app.status, color: 'bg-slate-100' };
              return (
                <div key={app.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={app.job_details?.company?.logo_display || `https://api.dicebear.com/7.x/identicon/svg?seed=${app.job_details?.company?.name}`}
                      alt={app.job_details?.company?.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{app.job_details?.title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {app.job_details?.company?.name} • Applied on {formatDate(app.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <MatchScoreBadge score={app.ai_match_score} size="sm" />
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <Link
                      to={`/jobs/${app.job_details?.id}`}
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboard;
