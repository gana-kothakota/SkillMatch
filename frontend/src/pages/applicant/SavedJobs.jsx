import React, { useState, useEffect } from 'react';
import { Bookmark, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobCard from '../../components/jobs/JobCard';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/saved-jobs/');
      const items = res.data.results || res.data || [];
      // Flatten saved job records to extract job object
      const formatted = items.map((item) => {
        if (item.job) {
          return {
            ...item.job,
            is_saved: true,
            saved_id: item.id,
          };
        }
        return item;
      });
      setSavedJobs(formatted);
    } catch (err) {
      console.error('Failed to fetch saved jobs', err);
      toast.error('Failed to load your saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) {
      // Unsaved - remove from state list
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
          <Bookmark className="w-8 h-8 mr-3 text-amber-500 fill-amber-500/20" /> My Saved Jobs
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Review and manage all position opportunities you saved for application.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl max-w-lg mx-auto space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Saved Jobs Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click the bookmark icon on any job card to save roles you want to apply for later.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Briefcase className="w-4 h-4 mr-2" /> Browse Open Jobs <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} onSaveToggle={handleSaveToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
