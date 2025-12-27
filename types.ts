
export enum MonitorStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  PENDING = 'PENDING',
  PAUSED = 'PAUSED',
  MAINTENANCE = 'MAINTENANCE'
}

export interface MonitorCheck {
  id: string;
  timestamp: number;
  latency: number;
  status: MonitorStatus;
  message?: string;
}

export interface Incident {
  id: string;
  monitorId: string;
  monitorName: string;
  startTime: number;
  endTime?: number;
  cause?: string;
  resolved: boolean;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  status: MonitorStatus;
  interval: number;
  lastCheck?: number;
  history: MonitorCheck[];
  type: 'http' | 'ping';
  isPublic: boolean;
  maintenanceMode: boolean;
}

export interface AppSettings {
  emailNotifications: boolean;
  alertEmail: string;
  telegramNotifications: boolean;
  slackWebhook: string;
  retentionDays: number;
  statusPageTitle: string;
  brandingColor: string;
}

export type ViewMode = 'dashboard' | 'analytics' | 'incidents' | 'status-page' | 'settings';
