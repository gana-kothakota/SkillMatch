import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Briefcase, Building2, ShieldCheck, ArrowRight, Zap, Users, CheckCircle } from 'lucide-react';
import JobCard from '../../components/jobs/JobCard';
import api from '../../services/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/?page_size=6');
        setFeaturedJobs(res.data.results || []);
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background Glowing Shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-sky-500/20 to-emerald-400/20 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl -z-10 animate-float" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-tight"
          >
            Accelerate Your Tech Career with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Automated AI Skill Compatibility
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-800 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Instantly benchmark your technical capabilities against top-tier enterprise role requirements. SkillMatch analyzes candidate profiles in real time, delivering precise compatibility scoring, keyword gap insights, and direct recruiter alignment.
          </motion.p>

          {/* Animated Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-3xl mx-auto"
          >
            <form onSubmit={handleSearchSubmit} className="glass-card p-2 rounded-2xl shadow-2xl flex items-center space-x-2 border-2 border-slate-300 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/90">
              <div className="pl-4 flex items-center text-slate-500 dark:text-slate-400">
                <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              </div>
              <input
                type="text"
                placeholder="Search job title, skill (e.g. 'React', 'Python'), or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 bg-transparent focus:outline-none text-base font-semibold"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-extrabold shadow-lg shadow-indigo-500/30 transition-all flex items-center space-x-2 shrink-0"
              >
                <span>Find Opportunities</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </motion.div>

          {/* Statistics Counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="glass-card p-6 rounded-2xl text-center bg-white/95 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-sky-400">10k+</div>
              <div className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 font-bold">Enterprise Roles</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center bg-white/95 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">98%</div>
              <div className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 font-bold">Matching Precision</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center bg-white/95 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400">500+</div>
              <div className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 font-bold">Verified Employers</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center bg-white/95 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400">2.4h</div>
              <div className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 font-bold">Avg Recruiter Review</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Enterprise Roles</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Top tech positions powered by intelligent skill compatibility scoring.
            </p>
          </div>
          <Link
            to="/jobs"
            className="mt-4 md:mt-0 text-sm font-semibold text-indigo-600 dark:text-sky-400 hover:underline flex items-center"
          >
            Explore All Opportunities <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* AI Feature Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-indigo-200/50 dark:border-indigo-900/40 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Intelligent Matching Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Smart Resume Analysis. Precision Skill Mapping.
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Our advanced natural language parsing engine extracts hard & soft technical competencies, normalizes domain terminology, and benchmarks your profile against recruiter criteria—giving you an instant competitive edge.
              </p>

              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Automated Multi-Format Document Parsing & Technical Keyword Extraction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Real-Time Skill Gap Analysis & Compatibility Scoring Meters</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>8-Stage End-to-End Enterprise Recruitment Pipeline Tracking</span>
                </div>
              </div>

              <Link
                to="/applicant/resume"
                className="inline-flex items-center px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Analyze Your Resume Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Visual Demo Card */}
            <div className="glass-card p-6 rounded-2xl bg-white/60 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="font-bold text-slate-800 dark:text-slate-100 text-base">Senior Full-Stack Engineer</div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  87.5% Match
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="text-slate-500 font-medium">Matched Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'Python', 'Django', 'PostgreSQL', 'REST API', 'Tailwind CSS'].map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="text-slate-500 font-medium">Missing Competencies:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-medium">
                    ✕ Docker
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs text-indigo-700 dark:text-indigo-300">
                💡 <strong>Strategic Insight:</strong> Strong technical alignment. Demonstrating hands-on Docker containerization experience unlocks full 100% profile compatibility.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
