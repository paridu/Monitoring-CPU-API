
import React from 'react';
import { LayoutDashboard, Plus, Settings, ShieldCheck, Activity, Bell, Globe } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  onAddClick: () => void;
  onViewChange: (view: ViewMode) => void;
  activeView: ViewMode;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddClick, onViewChange, activeView }) => {
  const menuItems: { id: ViewMode; icon: any; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analytics', icon: Activity, label: 'Analytics' },
    { id: 'incidents', icon: Bell, label: 'Incidents' },
    { id: 'status-page', icon: Globe, label: 'Status Page' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-emerald-500" />
        <h1 className="text-xl font-bold tracking-tight text-white">UptimeKita</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-500 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-slate-800">
          <button 
            onClick={onAddClick}
            className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/20 font-bold"
          >
            <Plus size={20} />
            <span>Add Monitor</span>
          </button>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-xs">
            AZ
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold text-white truncate">Admin User</div>
            <div className="text-[10px] text-slate-500 truncate">Free Plan</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
