
import React, { useState } from 'react';
import { X, Globe, Zap, Settings2 } from 'lucide-react';
import { Monitor, MonitorStatus } from '../types';

interface AddMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (monitor: Omit<Monitor, 'id' | 'history' | 'status'>) => void;
}

const AddMonitorModal: React.FC<AddMonitorModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    interval: 60,
    type: 'http' as const
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;
    onAdd(formData);
    onClose();
    setFormData({ name: '', url: '', interval: 60, type: 'http' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-bold">New Monitor</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Friendly Name</label>
            <input
              type="text"
              required
              placeholder="e.g. My Website API"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">URL / Endpoint</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="url"
                required
                placeholder="https://api.example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Check Interval</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: Number(e.target.value) })}
              >
                <option value={60}>Every 1 min</option>
                <option value={300}>Every 5 mins</option>
                <option value={600}>Every 10 mins</option>
                <option value={3600}>Every 1 hour</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Monitor Type</label>
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'http' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.type === 'http' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  HTTP(s)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'ping' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.type === 'ping' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Ping
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
            >
              <Settings2 size={20} />
              Create Monitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMonitorModal;
