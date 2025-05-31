import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }

  interface Navigator {
    userAgentData?: {
      brands: Array<{
        brand: string;
        version: string;
      }>;
    };
  }
}

// Helper function to detect device type
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Helper function to get browser info
const getBrowserInfo = () => {
  if (!navigator.userAgentData?.brands) {
    return {
      browserName: 'unknown',
      browserVersion: 'unknown',
    };
  }

  const brand = navigator.userAgentData.brands.find((b: { brand: string }) => b.brand !== 'Not?A_Brand');
  return {
    browserName: brand?.brand || 'unknown',
    browserVersion: brand?.version || 'unknown',
  };
};

// Helper function to get OS info
const getOSInfo = () => {
  const ua = navigator.userAgent;
  let osName;
  let osVersion;

  if (ua.includes('Windows')) {
    osName = 'Windows';
    osVersion = ua.split('Windows NT ')[1]?.split(';')[0] || 'unknown';
  } else if (ua.includes('Mac')) {
    osName = 'MacOS';
    osVersion = ua.split('Mac OS X ')[1]?.split(')')[0] || 'unknown';
  } else if (ua.includes('Linux')) {
    osName = 'Linux';
    osVersion = 'unknown';
  } else if (ua.includes('Android')) {
    osName = 'Android';
    osVersion = ua.split('Android ')[1]?.split(';')[0] || 'unknown';
  } else if (ua.includes('iOS')) {
    osName = 'iOS';
    osVersion = ua.split('OS ')[1]?.split(' ')[0] || 'unknown';
  } else {
    osName = 'Other';
    osVersion = 'unknown';
  }

  return { osName, osVersion };
};

export const useGoogleAnalytics = () => {
  useEffect(() => {
    const deviceType = getDeviceType();
    const { browserName, browserVersion } = getBrowserInfo();
    const { osName, osVersion } = getOSInfo();

    // Track initial page view with enhanced device data
    window.gtag('config', 'G-EKCTV12SY3', {
      page_path: window.location.pathname + window.location.hash,
      path_title: document.title,
      send_page_view: true,
      anonymize_ip: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: true,
      device_type: deviceType,
      browser: `${browserName} ${browserVersion}`,
      operating_system: `${osName} ${osVersion}`,
    });

    // Function to handle hash changes
    const handleHashChange = () => {
      window.gtag('event', 'page_view', {
        page_path: window.location.hash || '#home',
        page_title: document.title,
      });
    };

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Track user properties using GA4's user_properties API
    window.gtag('set', 'user_properties', {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      device_type: deviceType,
      browser: `${browserName} ${browserVersion}`,
      operating_system: `${osName} ${osVersion}`,
      user_agent: navigator.userAgent,
    });

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Function to track custom events with device context
  const trackEvent = (action: string, category: string, label: string, value?: number) => {
    const deviceType = getDeviceType();
    const { browserName, browserVersion } = getBrowserInfo();
    const { osName, osVersion } = getOSInfo();

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      device_type: deviceType,
      browser: `${browserName} ${browserVersion}`,
      operating_system: `${osName} ${osVersion}`,
    });
  };

  return { trackEvent };
}; 