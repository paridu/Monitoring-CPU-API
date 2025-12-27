
import React from 'react';
import { Bell, Mail, MessageSquare, Globe, Save } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const handleChange = (field: keyof AppSettings, value: any) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">Configure global notifications and system behavior.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <Bell className="text-emerald-500" />
             <h3 className="font-bold text-white">Notifications</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-xl text-slate-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white">Email Alerts</div>
                    <div className="text-sm text-slate-500">Send incident reports to your inbox.</div>
                  </div>
               </div>
               <input 
                 type="checkbox" 
                 checked={settings.emailNotifications}
                 onChange={e => handleChange('emailNotifications', e.target.checked)}
                 className="w-10 h-5 bg-slate-800 rounded-full appearance-none checked:bg-emerald-500 transition-colors cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform checked:after:translate-x-5"
               />
            </div>

            {settings.emailNotifications && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                 <label className="text-sm font-bold text-slate-400">Target Email Address</label>
                 <input 
                   type="email" 
                   placeholder="dev-alerts@yourcompany.com"
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                   value={settings.alertEmail}
                   onChange={e => handleChange('alertEmail', e.target.value)}
                 />
              </div>
            )}

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-xl text-slate-400">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white">Telegram Bot</div>
                    <div className="text-sm text-slate-500">Real-time alerts via Telegram messenger.</div>
                  </div>
               </div>
               <input 
                 type="checkbox" 
                 checked={settings.telegramNotifications}
                 onChange={e => handleChange('telegramNotifications', e.target.checked)}
                 className="w-10 h-5 bg-slate-800 rounded-full appearance-none checked:bg-emerald-500 transition-colors cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform checked:after:translate-x-5"
               />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-bold text-slate-400">Slack Webhook URL</label>
               <input 
                 type="text" 
                 placeholder="https://hooks.slack.com/services/..."
                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                 value={settings.slackWebhook}
                 onChange={e => handleChange('slackWebhook', e.target.value)}
               />
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <Globe className="text-indigo-500" />
             <h3 className="font-bold text-white">Status Page Customization</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Page Title</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  value={settings.statusPageTitle}
                  onChange={e => handleChange('statusPageTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Brand Color</label>
                <div className="flex gap-3">
                  <input 
                    type="color" 
                    className="w-12 h-11 bg-slate-950 border border-slate-800 rounded-xl p-1 cursor-pointer"
                    value={settings.brandingColor}
                    onChange={e => handleChange('brandingColor', e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm uppercase text-white"
                    value={settings.brandingColor}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
           <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20">
              <Save size={18} />
              Save Configuration
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
