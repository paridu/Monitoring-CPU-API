
import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Incident } from '../types';

interface IncidentsListProps {
  incidents: Incident[];
}

const IncidentsList: React.FC<IncidentsListProps> = ({ incidents }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Incident Logs</h2>
        <p className="text-slate-400 mt-1">Timeline of system interruptions and resolutions.</p>
      </div>

      {incidents.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-xl font-bold text-white">No incidents recorded</h3>
          <p className="text-slate-400">Everything looks perfect. Your services are healthy.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map(incident => (
            <div key={incident.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${incident.resolved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {incident.resolved ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white">{incident.monitorName}</h4>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    incident.resolved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {incident.resolved ? 'Resolved' : 'Critical Outage'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                      <Calendar size={10} /> Started
                    </div>
                    <div className="text-sm text-slate-300">{new Date(incident.startTime).toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                      <Clock size={10} /> Duration
                    </div>
                    <div className="text-sm text-slate-300">
                      {incident.endTime 
                        ? `${Math.round((incident.endTime - incident.startTime) / 60000)} mins` 
                        : 'Ongoing'}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Detection Point</div>
                    <div className="text-sm text-slate-400 italic">"Connection timeout via Global Node"</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentsList;
