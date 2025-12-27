
import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShieldCheck, Share2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MonitorCard from './components/MonitorCard';
import AddMonitorModal from './components/AddMonitorModal';
import MonitorDetails from './components/MonitorDetails';
import PublicStatusPage from './components/PublicStatusPage';
import IncidentsList from './components/IncidentsList';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import { sendIncidentEmail } from './services/notificationService';
import { Monitor, MonitorStatus, MonitorCheck, ViewMode, Incident, AppSettings } from './types';

const STORAGE_KEY = 'uptime_kita_monitors';
const INCIDENTS_KEY = 'uptime_kita_incidents';
const SETTINGS_KEY = 'uptime_kita_settings';

const DEFAULT_SETTINGS: AppSettings = {
  emailNotifications: true,
  alertEmail: '',
  telegramNotifications: false,
  slackWebhook: '',
  retentionDays: 30,
  statusPageTitle: 'System Status Page',
  brandingColor: '#10b981'
};

const App: React.FC = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMonitorId, setSelectedMonitorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize from Storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedIncidents = localStorage.getItem(INCIDENTS_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);

    if (saved) {
      setMonitors(JSON.parse(saved));
    } else {
      const initialMonitors: Monitor[] = [
        {
          id: 'node-1',
          name: 'Main API Gateway',
          url: 'https://api.github.com',
          status: MonitorStatus.UP,
          interval: 60,
          type: 'http',
          isPublic: true,
          maintenanceMode: false,
          history: Array.from({ length: 40 }, (_, i) => ({
            id: Math.random().toString(),
            timestamp: Date.now() - (i * 60000),
            latency: Math.floor(Math.random() * 100) + 120,
            status: MonitorStatus.UP
          })).reverse()
        },
        {
          id: 'node-2',
          name: 'Legacy Auth Server',
          url: 'https://www.google.com',
          status: MonitorStatus.UP,
          interval: 30,
          type: 'http',
          isPublic: true,
          maintenanceMode: false,
          history: Array.from({ length: 40 }, (_, i) => ({
            id: Math.random().toString(),
            timestamp: Date.now() - (i * 60000),
            latency: Math.floor(Math.random() * 50) + 40,
            status: MonitorStatus.UP
          })).reverse()
        }
      ];
      setMonitors(initialMonitors);
    }

    if (savedIncidents) setIncidents(JSON.parse(savedIncidents));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save to Storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(monitors));
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [monitors, incidents, settings]);

  const performCheck = useCallback(async (monitor: Monitor) => {
    const start = performance.now();
    let status = MonitorStatus.UP;
    let latency = 0;
    let message = 'Success';

    try {
      const response = await fetch(monitor.url, { mode: 'no-cors', cache: 'no-store' });
      latency = Math.round(performance.now() - start);
      status = MonitorStatus.UP;
    } catch (error) {
      status = MonitorStatus.DOWN;
      message = error instanceof Error ? error.message : 'Connection failed';
    }

    // Demo Jitter
    if (monitor.url.includes('google')) {
       latency = Math.floor(Math.random() * 100) + 30;
       if (Math.random() > 0.99) status = MonitorStatus.DOWN;
    }

    return { status, latency, message };
  }, []);

  // Monitoring Engine
  useEffect(() => {
    const ticker = setInterval(async () => {
      const now = Date.now();
      
      const updatedMonitors = await Promise.all(monitors.map(async (m) => {
        if (m.maintenanceMode) return m;
        const shouldCheck = !m.lastCheck || (now - m.lastCheck) >= (m.interval * 1000);
        
        if (shouldCheck) {
          const result = await performCheck(m);
          
          if (result.status === MonitorStatus.DOWN && m.status !== MonitorStatus.DOWN) {
            const newIncident: Incident = {
              id: Math.random().toString(36).substr(2, 9),
              monitorId: m.id,
              monitorName: m.name,
              startTime: now,
              resolved: false
            };
            setIncidents(prev => [newIncident, ...prev]);
            
            // EMAIL NOTIFICATION FEATURE
            if (settings.emailNotifications && settings.alertEmail) {
              sendIncidentEmail(m, settings);
            }
          } else if (result.status === MonitorStatus.UP && m.status === MonitorStatus.DOWN) {
            setIncidents(prev => prev.map(inc => 
              (inc.monitorId === m.id && !inc.resolved) 
              ? { ...inc, resolved: true, endTime: now } 
              : inc
            ));
          }

          const newCheck: MonitorCheck = {
            id: Math.random().toString(),
            timestamp: now,
            latency: result.latency,
            status: result.status,
            message: result.message
          };

          return {
            ...m,
            status: result.status,
            lastCheck: now,
            history: [...m.history, newCheck].slice(-50)
          };
        }
        return m;
      }));

      setMonitors(updatedMonitors);
    }, 15000);

    return () => clearInterval(ticker);
  }, [monitors, performCheck, settings]);

  const handleAddMonitor = (data: any) => {
    const newMonitor: Monitor = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: MonitorStatus.PENDING,
      history: [],
      isPublic: true,
      maintenanceMode: false
    };
    setMonitors(prev => [...prev, newMonitor]);
  };

  const filteredMonitors = monitors.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    up: monitors.filter(m => m.status === MonitorStatus.UP).length,
    down: monitors.filter(m => m.status === MonitorStatus.DOWN).length,
    total: monitors.length,
    uptime: monitors.length > 0 ? (monitors.filter(m => m.status === MonitorStatus.UP).length / monitors.length * 100).toFixed(1) : '100'
  };

  if (viewMode === 'status-page') {
    return <PublicStatusPage monitors={monitors} onBack={() => setViewMode('dashboard')} />;
  }

  const renderContent = () => {
    if (selectedMonitorId) {
      const selectedMonitor = monitors.find(m => m.id === selectedMonitorId);
      if (!selectedMonitor) return null;
      return (
        <MonitorDetails 
          monitor={selectedMonitor} 
          onBack={() => setSelectedMonitorId(null)} 
          onDelete={(id) => {
            setMonitors(prev => prev.filter(m => m.id !== id));
            setSelectedMonitorId(null);
          }}
          onToggleMaintenance={(id) => {
            setMonitors(prev => prev.map(m => m.id === id ? { ...m, maintenanceMode: !m.maintenanceMode, status: !m.maintenanceMode ? MonitorStatus.MAINTENANCE : MonitorStatus.PENDING } : m));
          }}
        />
      );
    }

    switch (viewMode) {
      case 'incidents': return <IncidentsList incidents={incidents} />;
      case 'analytics': return <AnalyticsView monitors={monitors} />;
      case 'settings': return <SettingsView settings={settings} onUpdate={setSettings} />;
      default: return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                Dashboard
              </h1>
              <p className="text-slate-400 mt-1">Infrastructure overview and health indicators.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search monitors..." 
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setViewMode('status-page')}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-900/20"
              >
                <Share2 size={18} />
                <span className="hidden md:inline">Status Page</span>
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <div className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Up
              </div>
              <div className="text-3xl font-bold text-white">{stats.up}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <div className="text-rose-500 font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Down
              </div>
              <div className="text-3xl font-bold text-white">{stats.down}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">Global Uptime</div>
              <div className="text-3xl font-bold text-white">{stats.uptime}%</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Total Nodes</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMonitors.map(monitor => (
              <MonitorCard 
                key={monitor.id} 
                monitor={monitor} 
                onClick={() => setSelectedMonitorId(monitor.id)}
              />
            ))}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="group border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:bg-emerald-500/5 h-[220px]"
            >
              <div className="p-3 bg-slate-900 group-hover:bg-emerald-500/10 text-slate-500 group-hover:text-emerald-500 rounded-2xl transition-all">
                <ShieldCheck size={32} />
              </div>
              <span className="font-semibold text-slate-400 group-hover:text-emerald-500">Monitor New Service</span>
            </button>
          </section>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <Sidebar 
        onAddClick={() => setIsAddModalOpen(true)} 
        activeView={viewMode}
        onViewChange={(v) => {
            setViewMode(v);
            setSelectedMonitorId(null);
        }}
      />

      <main className="flex-1 p-8 max-w-7xl mx-auto overflow-y-auto">
        {renderContent()}
      </main>

      <AddMonitorModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddMonitor}
      />
    </div>
  );
};

export default App;
