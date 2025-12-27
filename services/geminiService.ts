
import { GoogleGenAI } from "@google/genai";

export const analyzeIncident = async (monitorName: string, url: string, recentHistory: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following uptime monitoring data for a service named "${monitorName}" (${url}).
    Recent History: ${JSON.stringify(recentHistory.slice(-10))}
    
    Provide a concise (2-3 sentences) diagnostic report. 
    If the service is down, suggest likely causes based on common networking or server issues.
    If the service is up but slow, suggest optimization tips.
    Format the response with professional tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("AI Diagnostic error:", error);
    return "Failed to generate AI diagnostic. Please check your API configuration.";
  }
};

export const composeIncidentEmail = async (monitorName: string, url: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Compose a professional and urgent incident alert email for a monitoring service.
    Service: ${monitorName} (${url})
    Status: CRITICAL OUTAGE
    
    The email should have:
    1. A clear subject line.
    2. A brief body explaining that the service is down.
    3. A placeholder for "Current Time" and "Detected By: UptimePro Global Node".
    4. A reassuring closing.
    
    Return ONLY the email content in text format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Service Outage Detected.";
  } catch (error) {
    return `URGENT: ${monitorName} is DOWN. Please check the dashboard immediately.`;
  }
};
