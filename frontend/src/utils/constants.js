const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = rawApiUrl
  ? (rawApiUrl.endsWith('/api/v1')
      ? rawApiUrl
      : rawApiUrl.endsWith('/api')
        ? `${rawApiUrl}/v1`
        : `${rawApiUrl.replace(/\/$/, '')}/api/v1`)
  : '/api/v1';

export const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'ENTRY', label: 'Entry Level' },
  { value: 'MID', label: 'Mid Level' },
  { value: 'SENIOR', label: 'Senior Level' },
  { value: 'LEAD', label: 'Lead / Executive' },
];

export const APPLICATION_STATUS_CONFIG = {
  APPLIED: { label: 'Applied', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200' },
  INTERVIEW: { label: 'Interview Scheduled', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200' },
  TECH_ROUND: { label: 'Technical Round', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200' },
  HR_ROUND: { label: 'HR Round', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200' },
  OFFER: { label: 'Offer Extended', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200' },
  HIRED: { label: 'Hired 🎉', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200' },
  REJECTED: { label: 'Rejected', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200' },
};
