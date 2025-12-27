
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, TrendingUp, Zap } from 'lucide-react';
import { Monitor, MonitorStatus } from '../types';

interface AnalyticsViewProps {
  monitors: Monitor[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ monitors }) => {
  const avgLatencyData = monitors.map(m => ({
    name: m.name,
    avg: m.history.length > 0 ? Math.round(m.history.reduce((a, b) => a + b.latency, 0) / m.history.length) : 0
  })).sort((a, b) => b.avg - a.avg);

  const statusDistribution = [
    { name: 'Up', value: monitors.filter(m => m.status === MonitorStatus.UP).length, color: '#10b981' },
    { name: 'Down', value: monitors.filter(m => m.status === MonitorStatus.DOWN).length, color: '#f43f5e' },
    { name: 'Other', value: monitors.filter(m => m.status !== MonitorStatus.UP && m.status !== MonitorStatus.DOWN).length, color: '#6366f1' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Analytics</h1>
        <p className="text-slate-400 mt-1">Cross-system performance and infrastructure health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Avg. Latency by Service</h3>
              <p className="text-sm text-slate-500">Response time comparisons across infrastructure nodes.</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgLatencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="avg" fill="#10b981" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Status Distribution</h3>
              <p className="text-sm text-slate-500">Real-time health overview of all active monitors.</p>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-col gap-4 pl-8">
                {statusDistribution.map(d => (
                   <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-sm font-bold text-slate-200">{d.name} ({d.value})</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-2">
            <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">Global Availability</div>
            <div className="text-3xl font-bold text-white">99.982%</div>
            <div className="text-emerald-500 text-xs flex items-center gap-1 font-bold">
               <TrendingUp size={12} /> +0.02% vs last week
            </div>
         </div>
         <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-2">
            <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">Average P99</div>
            <div className="text-3xl font-bold text-white">142ms</div>
            <div className="text-slate-500 text-xs font-bold">Stable across 14 nodes</div>
         </div>
         <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-2">
            <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">MTTR</div>
            <div className="text-3xl font-bold text-white">4.2m</div>
            <div className="text-rose-500 text-xs font-bold">Mean time to recovery</div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
