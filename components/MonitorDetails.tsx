
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, BrainCircuit, Loader2, RefreshCw, Trash2, ShieldAlert, History, AlertTriangle } from 'lucide-react';
import { Monitor, MonitorStatus } from '../types';
import { analyzeIncident } from '../services/geminiService';

interface MonitorDetailsProps {
  monitor: Monitor;
  onBack: () => void;
  onDelete: (id: string) => void;
  onToggleMaintenance: (id: string) => void;
}

const MonitorDetails: React.FC<MonitorDetailsProps> = ({ monitor, onBack, onDelete, onToggleMaintenance }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiAnalyze = async () => {
    setIsAnalyzing(true);
    setAiReport(null);
    const report = await analyzeIncident(monitor.name, monitor.url, monitor.history);
    setAiReport(report);
    setIsAnalyzing(false);
  };

  const chartData = monitor.history.map(check => ({
    time: new Date(check.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: check.latency,
    status: check.status
  }));

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-white">{monitor.name}</h2>
              {monitor.maintenanceMode && (
                <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">Maintenance</span>
              )}
            </div>
            <p className="text-slate-400 font-mono text-sm">{monitor.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onToggleMaintenance(monitor.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold ${
              monitor.maintenanceMode 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert size={18} />
            {monitor.maintenanceMode ? 'End Maintenance' : 'Start Maintenance'}
          </button>
          <button 
            onClick={() => onDelete(monitor.id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all font-bold"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
              Latency History
              <span className="text-xs text-slate-500 uppercase tracking-widest">Last 50 Checks</span>
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorLatency)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <History className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold">Recent Checks</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-800">
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Timestamp</th>
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Status</th>
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Latency</th>
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {monitor.history.slice(-10).reverse().map((check) => (
                    <tr key={check.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 text-slate-400">{new Date(check.timestamp).toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          check.status === MonitorStatus.UP ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${check.status === MonitorStatus.UP ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {check.status}
                        </span>
                      </td>
                      <td className="py-4 font-mono">{check.latency}ms</td>
                      <td className="py-4 text-slate-500">{check.message || 'OK'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BrainCircuit size={120} />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <BrainCircuit size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Gemini Insights</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Generate an AI-powered diagnostic report for your service. We'll analyze recent latency patterns and status flips.
              </p>
              
              {aiReport && (
                <div className="mb-6 p-4 bg-slate-900/80 border border-indigo-500/20 rounded-2xl text-sm leading-relaxed text-indigo-100 animate-in fade-in slide-in-from-bottom-2">
                  {aiReport}
                </div>
              )}

              <button 
                onClick={handleAiAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                {isAnalyzing ? 'Analyzing...' : 'Generate Diagnostic'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Health Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-sm">Overall Uptime</span>
                <span className="text-emerald-500 font-bold">99.98%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-sm">Cert Expiry</span>
                <span className="text-white font-bold">248 days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-sm">Response Target</span>
                <span className="text-white font-bold">{'< 200ms'}</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6">
             <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={20} className="text-rose-500" />
                <h3 className="font-bold">Incident Summary</h3>
             </div>
             <div className="text-xs text-slate-400 leading-relaxed">
               This service has experienced 2 total incidents in the last 30 days, totaling 12 minutes of downtime.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorDetails;
