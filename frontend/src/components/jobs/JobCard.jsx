import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Bookmark, ArrowRight, Sparkles } from 'lucide-react';
import MatchScoreBadge from '../ui/MatchScoreBadge';
import { formatSalaryRange, formatDate } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const JobCard = ({ job, onSaveToggle }) => {
  const [saved, setSaved] = useState(job.is_saved);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (saved) {
        await api.delete(`/saved-jobs/${job.id}/`);
        setSaved(false);
        toast.success('Removed from saved jobs');
      } else {
        await api.post('/saved-jobs/', { job_id: job.id });
        setSaved(true);
        toast.success('Job saved successfully');
      }
      if (onSaveToggle) onSaveToggle(job.id, !saved);
    } catch (err) {
      toast.error('Log in as Applicant to save jobs.');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-6 relative flex flex-col justify-between group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
      <div>
        {/* Top bar: Company & Save icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={job.company?.logo_display || `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company?.name}`}
              alt={job.company?.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
            />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {job.company?.name}
              </h4>
              <Link
                to={`/jobs/${job.id}`}
                className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
            </div>
          </div>

          <button
            onClick={handleSaveToggle}
            className={`p-2 rounded-xl border transition-colors ${
              saved
                ? 'bg-amber-500 text-white border-amber-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-400'
            }`}
            title={saved ? 'Unsave job' : 'Save job'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
          <span className="flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <MapPin className="w-3.5 h-3.5 mr-1 text-sky-500" /> {job.location}
          </span>
          <span className="flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <Briefcase className="w-3.5 h-3.5 mr-1 text-indigo-500" /> {job.job_type}
          </span>
          <span className="flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-500" /> {formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}
          </span>
        </div>

        {/* Required skills chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.required_skills?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-sky-300 border border-indigo-100/60 dark:border-indigo-800/40"
            >
              {skill}
            </span>
          ))}
          {job.required_skills?.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800">
              +{job.required_skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: AI Score & Action */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        {job.ai_match ? (
          <MatchScoreBadge score={job.ai_match.score} size="sm" />
        ) : (
          <span className="text-xs text-slate-400 font-medium">Posted {formatDate(job.created_at)}</span>
        )}

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform"
        >
          View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
