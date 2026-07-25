import React, { useState, useEffect } from 'react';
import { Search, X, Briefcase, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search/global/?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error('Global search error', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search Header */}
        <div className="relative flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-indigo-500 mr-3" />
          <input
            type="text"
            placeholder="Search jobs, companies, or skills (e.g. 'React', 'TechCorp')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-lg"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {loading && (
            <div className="py-8 text-center text-slate-500">Searching across platform...</div>
          )}

          {!loading && results && (
            <>
              {/* Jobs Section */}
              {results.jobs?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-1 text-indigo-500" /> Jobs ({results.jobs.length})
                  </h3>
                  <div className="space-y-2">
                    {results.jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => {
                          navigate(`/jobs/${job.id}`);
                          onClose();
                        }}
                        className="p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{job.title}</div>
                          <div className="text-xs text-slate-500">{job.company?.name} • {job.location}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Section */}
              {results.companies?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-1 text-sky-500" /> Companies ({results.companies.length})
                  </h3>
                  <div className="space-y-2">
                    {results.companies.map((co) => (
                      <div
                        key={co.id}
                        onClick={() => {
                          navigate(`/companies/${co.id}`);
                          onClose();
                        }}
                        className="p-3 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <img src={co.logo_display} alt={co.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{co.name}</div>
                            <div className="text-xs text-slate-500">{co.location}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Skill Jobs Section */}
              {results.matched_skill_jobs?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-emerald-500" /> Skill Matches ({results.matched_skill_jobs.length})
                  </h3>
                  <div className="space-y-2">
                    {results.matched_skill_jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => {
                          navigate(`/jobs/${job.id}`);
                          onClose();
                        }}
                        className="p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{job.title}</div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            Requires: {job.required_skills?.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.jobs?.length === 0 && results.companies?.length === 0 && (
                <div className="py-8 text-center text-slate-500">
                  No matching jobs, companies, or skills found for "{query}".
                </div>
              )}
            </>
          )}

          {!query && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type to instantly search jobs, skills, or companies.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
