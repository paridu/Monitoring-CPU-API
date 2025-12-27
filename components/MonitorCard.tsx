
import React from 'react';
import { Globe, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { Monitor, MonitorStatus } from '../types';
import StatusGrid from './StatusGrid';

interface MonitorCardProps {
  monitor: Monitor;
  onClick: () => void;
}

const MonitorCard: React.FC<MonitorCardProps> = ({ monitor, onClick }) => {
  const lastCheck = monitor.history[monitor.history.length - 1];
  const avgLatency = monitor.history.length > 0 
    ? Math.round(monitor.history.reduce((acc, curr) => acc + curr.latency, 0) / monitor.history.length)
    : 0;

  const uptimePercentage = monitor.history.length > 0
    ? (monitor.history.filter(h => h.status === MonitorStatus.UP).length / monitor.history.length * 100).toFixed(1)
    : '0.0';

  return (
    <div 
      onClick={onClick}
      className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-2xl p-5 cursor-pointer transition-all duration-200 group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${monitor.status === MonitorStatus.UP ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            <Globe size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-100 group-hover:text-white transition-colors">
              {monitor.name}
            </h3>
            <p className="text-sm text-slate-400 truncate max-w-[200px]">{monitor.url}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          monitor.status === MonitorStatus.UP ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${monitor.status === MonitorStatus.UP ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {monitor.status}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock size={14} /> Latency
          </span>
          <span className="text-slate-200 font-mono">{lastCheck ? `${lastCheck.latency}ms` : '--'}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 flex items-center gap-1">
            <AlertCircle size={14} /> Uptime
          </span>
          <span className="text-slate-200 font-mono">{uptimePercentage}%</span>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
             <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">24h History</span>
             <span className="text-xs text-slate-400">Avg: {avgLatency}ms</span>
          </div>
          <StatusGrid history={monitor.history} />
        </div>
      </div>

      <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-2 transition-all duration-200">
        <ChevronRight className="text-slate-600" />
      </div>
    </div>
  );
};

export default MonitorCard;
