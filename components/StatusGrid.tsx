
import React from 'react';
import { MonitorStatus } from '../types';

interface StatusGridProps {
  history: { status: MonitorStatus }[];
}

const StatusGrid: React.FC<StatusGridProps> = ({ history }) => {
  // Fill with dummy data to reach 50 bars if history is short
  const displayHistory = [...new Array(Math.max(0, 40 - history.length)).fill({ status: MonitorStatus.PENDING }), ...history].slice(-40);

  return (
    <div className="flex gap-1 h-6 items-end">
      {displayHistory.map((item, i) => (
        <div
          key={i}
          className={`w-1.5 h-full rounded-sm transition-all duration-300 ${
            item.status === MonitorStatus.UP ? 'bg-emerald-500' : 
            item.status === MonitorStatus.DOWN ? 'bg-rose-500' : 'bg-slate-700'
          }`}
          title={item.status}
        />
      ))}
    </div>
  );
};

export default StatusGrid;
