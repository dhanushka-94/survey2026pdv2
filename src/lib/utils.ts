import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format datetime for display
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Check if survey is currently active
export function isSurveyActive(
  isActive: boolean,
  startDate: string | null,
  endDate: string | null
): boolean {
  if (!isActive) return false;

  const now = new Date();

  if (startDate && new Date(startDate) > now) {
    return false;
  }

  if (endDate && new Date(endDate) < now) {
    return false;
  }

  return true;
}

// Format time spent in seconds to readable format
export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// Generate session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID from localStorage
export function getOrCreateSessionId(forceNew: boolean = false): string {
  if (typeof window === 'undefined') return '';

  const storageKey = 'survey_session_id';
  
  // If forceNew is true, always generate a new session ID
  if (forceNew) {
    const sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
    return sessionId;
  }

  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

// End current session (clear session ID)
export function endSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('survey_session_id');
}

// Generate a new session ID and replace the old one
export function renewSessionId(): string {
  endSession(); // First end the old session
  return getOrCreateSessionId(true);
}

// Check if user has completed a survey
export function hasCompletedSurvey(surveyId: string): boolean {
  if (typeof window === 'undefined') return false;

  const completedSurveys = localStorage.getItem('completed_surveys');
  if (!completedSurveys) return false;

  const completed = JSON.parse(completedSurveys);
  return completed.includes(surveyId);
}

// Mark survey as completed
export function markSurveyCompleted(surveyId: string): void {
  if (typeof window === 'undefined') return;

  const completedSurveys = localStorage.getItem('completed_surveys');
  const completed = completedSurveys ? JSON.parse(completedSurveys) : [];

  if (!completed.includes(surveyId)) {
    completed.push(surveyId);
    localStorage.setItem('completed_surveys', JSON.stringify(completed));
  }
}

// Clear all completed surveys (useful for testing or allowing retakes)
export function clearCompletedSurveys(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('completed_surveys');
}

// Clear specific survey completion (allow retake)
export function clearSurveyCompletion(surveyId: string): void {
  if (typeof window === 'undefined') return;

  const completedSurveys = localStorage.getItem('completed_surveys');
  if (!completedSurveys) return;

  const completed = JSON.parse(completedSurveys);
  const filtered = completed.filter((id: string) => id !== surveyId);
  localStorage.setItem('completed_surveys', JSON.stringify(filtered));
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Validate file type for media upload
export function isValidMediaFile(file: File): boolean {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];
  return validTypes.includes(file.type);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Get admin path from env
export function getAdminPath(): string {
  return process.env.ADMIN_SECRET_PATH || 'admin-x9QpK7';
}

// Validate admin path in URL
export function isAdminPath(pathname: string): boolean {
  const adminPath = getAdminPath();
  return pathname.startsWith(`/${adminPath}`);
}

// Device and Browser Detection
export interface DeviceInfo {
  device_type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return { device_type: 'desktop', browser: 'Unknown', os: 'Unknown' };
  }

  const ua = navigator.userAgent;
  
  // Detect device type
  let device_type: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    device_type = 'tablet';
  } else if (/Mobile|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device_type = 'mobile';
  }
  
  // Detect browser
  let browser = 'Unknown';
  if (/Edg\//i.test(ua)) {
    browser = 'Edge';
  } else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Firefox';
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = 'Internet Explorer';
  } else if (/Opera|OPR/i.test(ua)) {
    browser = 'Opera';
  } else if (/Samsung/i.test(ua)) {
    browser = 'Samsung Browser';
  }
  
  // Detect OS
  let os = 'Unknown';
  if (/Windows/i.test(ua)) {
    os = 'Windows';
  } else if (/Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) {
    os = 'macOS';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  } else if (/CrOS/i.test(ua)) {
    os = 'Chrome OS';
  }
  
  return { device_type, browser, os };
}

// Parse user-agent string (for server-side visitor logging)
export function getDeviceInfoFromUA(ua: string): DeviceInfo {
  if (!ua) {
    return { device_type: 'desktop', browser: 'Unknown', os: 'Unknown' };
  }

  let device_type: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    device_type = 'tablet';
  } else if (/Mobile|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device_type = 'mobile';
  }

  let browser = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/MSIE|Trident/i.test(ua)) browser = 'Internet Explorer';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';
  else if (/Samsung/i.test(ua)) browser = 'Samsung Browser';

  let os = 'Unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/CrOS/i.test(ua)) os = 'Chrome OS';

  return { device_type, browser, os };
}
