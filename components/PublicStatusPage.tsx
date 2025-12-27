
import React from 'react';
import { ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Monitor, MonitorStatus } from '../types';
import StatusGrid from './StatusGrid';

interface PublicStatusPageProps {
  monitors: Monitor[];
  onBack: () => void;
}

const PublicStatusPage: React.FC<PublicStatusPageProps> = ({ monitors, onBack }) => {
  const overallStatus = monitors.every(m => m.status === MonitorStatus.UP) 
    ? 'All Systems Operational' 
    : 'System Disruption Detected';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
            <h1 className="text-2xl font-bold tracking-tight">System Status</h1>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </header>

        <div className={`p-6 rounded-3xl border flex items-center gap-4 shadow-sm ${
          overallStatus.includes('Operational') 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {overallStatus.includes('Operational') ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
          <h2 className="text-xl font-bold">{overallStatus}</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Services</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {monitors.map(monitor => (
              <div key={monitor.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    {monitor.name}
                    {monitor.maintenanceMode && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase font-bold">Maintenance</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">{monitor.url}</div>
                  <div className="pt-2">
                    <StatusGrid history={monitor.history} />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-sm font-bold flex items-center gap-1.5 ${
                    monitor.status === MonitorStatus.UP ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {monitor.status}
                  </span>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> 99.9% uptime
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center pt-12 space-y-4">
          <div className="text-slate-400 text-sm font-medium">Powered by UptimeKita Engine</div>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-emerald-600 font-bold hover:underline">Subscribe to Updates</a>
            <a href="#" className="text-emerald-600 font-bold hover:underline">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PublicStatusPage;
