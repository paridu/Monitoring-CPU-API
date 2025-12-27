
import { composeIncidentEmail } from './geminiService';
import { Monitor, AppSettings } from '../types';

export const sendIncidentEmail = async (monitor: Monitor, settings: AppSettings) => {
  if (!settings.emailNotifications || !settings.alertEmail) return;

  console.log(`[NotificationService] Preparing email for ${monitor.name}...`);
  
  const emailBody = await composeIncidentEmail(monitor.name, monitor.url);

  // In a real production app, you would use a service like Resend, EmailJS, or SendGrid here.
  // For this demonstration, we simulate the network request and log the output.
  console.log(`
    --- SIMULATED EMAIL SENT ---
    To: ${settings.alertEmail}
    Subject: 🚨 URGENT: Incident Detected for ${monitor.name}
    Content:
    ${emailBody}
    ---------------------------
  `);

  return true;
};
