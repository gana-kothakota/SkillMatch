import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Briefcase } from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/companies/')
      .then((res) => setCompanies(res.data.results || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Top Enterprise Employers</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Explore hiring companies using SkillMatch AI for candidate acquisition.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all">
              <div className="flex items-start space-x-4">
                <img
                  src={company.logo_display || `https://api.dicebear.com/7.x/identicon/svg?seed=${company.name}`}
                  alt={company.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{company.name}</h3>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-sky-500" /> {company.location}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {company.description}
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-indigo-600 dark:text-sky-400 flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1" /> {company.job_count} Open Jobs
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center"
                  >
                    Website <Globe className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
