import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Briefcase, MapPin, Sparkles } from 'lucide-react';
import JobCard from '../../components/jobs/JobCard';
import api from '../../services/api';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [jobType, setJobType] = useState(searchParams.get('job_type') || '');
  const [expLevel, setExpLevel] = useState(searchParams.get('experience_level') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (jobType) params.append('job_type', jobType);
      if (expLevel) params.append('experience_level', expLevel);
      if (location) params.append('location', location);

      const res = await api.get(`/jobs/?${params.toString()}`);
      setJobs(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, jobType, expLevel, location]);

  useEffect(() => {
    if (user?.role === 'APPLICANT') {
      api.get('/jobs/recommended/').then((res) => {
        setRecommendedJobs(res.data.slice(0, 3) || []);
      }).catch(() => {});
    }
  }, [user]);

  const clearFilters = () => {
    setSearch('');
    setJobType('');
    setExpLevel('');
    setLocation('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Explore Enterprise Opportunities</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Filter through live open positions with automated AI match scoring.
        </p>
      </div>

      {/* Recommended Jobs Carousel for Applicants */}
      {user?.role === 'APPLICANT' && recommendedJobs.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/50 via-sky-50/30 to-slate-900/0">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> Smart Recommendations for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedJobs.map((item) => (
              <div key={item.job.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.job.title}</div>
                <div className="text-xs text-slate-500">{item.job.company?.name} • {item.job.location}</div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.ai_match?.score}% AI Match Rating
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs flex items-center justify-between border border-slate-200 dark:border-slate-700"
        >
          <span className="flex items-center"><Filter className="w-4 h-4 mr-2 text-indigo-500" /> Filter Positions</span>
          <span className="text-xs text-indigo-600 dark:text-sky-400">{showMobileFilters ? 'Hide' : 'Show'}</span>
        </button>
      </div>

      {/* Main Layout: Sidebar Filters + Job Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:col-span-1 glass-card p-6 rounded-2xl h-fit space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center">
              <Filter className="w-4 h-4 mr-2 text-indigo-500" /> Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-600 dark:text-sky-400 hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search Keywords */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Title, skill, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Job Types</option>
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Experience Level</label>
            <select
              value={expLevel}
              onChange={(e) => setExpLevel(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Experience Levels</option>
              {EXPERIENCE_LEVELS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="City, State, or Remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Job Cards List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {jobs.length} of {totalCount} open positions</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 4].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl space-y-3">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No jobs match your criteria</h3>
              <p className="text-xs text-slate-500">Try adjusting your search keywords or clearing filters.</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
