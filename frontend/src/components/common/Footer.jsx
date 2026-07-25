import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, MessageSquare } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <Logo size="sm" />
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                SkillMatch
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Next-generation enterprise talent intelligence platform connecting top candidates with leading global employers through automated skill compatibility matching.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/jobs" className="hover:text-indigo-500">Explore Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-indigo-500">Featured Employers</Link></li>
              <li><Link to="/applicant/dashboard" className="hover:text-indigo-500">Candidate Hub</Link></li>
              <li><Link to="/register" className="hover:text-indigo-500">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>AI Resume Parsing</li>
              <li>Skill Compatibility Scoring</li>
              <li>Recruitment Pipeline Tracking</li>
              <li>Unified Global Search</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Connect With Us</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-sky-400 flex items-center transition-colors">
                  <Github className="w-3.5 h-3.5 mr-2 text-slate-500" /> GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-sky-400 flex items-center transition-colors">
                  <Linkedin className="w-3.5 h-3.5 mr-2 text-sky-500" /> LinkedIn Network
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-sky-400 flex items-center transition-colors">
                  <Twitter className="w-3.5 h-3.5 mr-2 text-sky-400" /> X / Twitter
                </a>
              </li>
              <li>
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-sky-400 flex items-center transition-colors">
                  <MessageSquare className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Discord Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} SkillMatch. All rights reserved. Enterprise-Grade Talent Intelligence Platform.
          </div>
          <div className="flex items-center space-x-1">
            <span>Powered by AI Talent Intelligence & Advanced Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
