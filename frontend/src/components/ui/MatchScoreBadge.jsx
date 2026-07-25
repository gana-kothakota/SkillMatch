import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Sparkles } from 'lucide-react';

const MatchScoreBadge = ({ score, size = 'md', showLabel = true }) => {
  if (score == null) return null;

  const rounded = Math.round(score);
  
  let color = '#10B981'; // Emerald >= 80
  let bgClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

  if (rounded < 50) {
    color = '#F43F5E'; // Rose < 50
    bgClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  } else if (rounded < 80) {
    color = '#F59E0B'; // Amber 50-79
    bgClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }

  const dimension = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${bgClass}`}>
      <div className={dimension}>
        <CircularProgressbar
          value={rounded}
          text={`${rounded}%`}
          styles={buildStyles({
            textSize: '30px',
            pathColor: color,
            textColor: color,
            trailColor: 'rgba(203, 213, 225, 0.3)',
          })}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold flex items-center">
          <Sparkles className="w-3 h-3 mr-1" /> AI Match
        </span>
      )}
    </div>
  );
};

export default MatchScoreBadge;
