'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { logVisitor } from '@/actions/visitors';

const GPS_WAIT_MS = 4000; // Wait up to 4s for GPS before logging

export function VisitorTracker() {
  const pathname = usePathname();
  const loggedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname) return;

    // Avoid logging the same path twice in quick succession (e.g. React Strict Mode)
    const key = `${pathname}-${Date.now().toString().slice(0, -3)}`;
    if (loggedRef.current.has(key)) return;
    loggedRef.current.add(key);

    // Keep ref size manageable
    if (loggedRef.current.size > 100) {
      loggedRef.current.clear();
    }

    const currentPath = pathname;
    const doLog = (lat?: number, lng?: number) => {
      logVisitor({
        path: currentPath,
        referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...(lat != null && lng != null ? { latitude: lat, longitude: lng } : {}),
      });
    };

    // Try to get GPS first; wait up to GPS_WAIT_MS before logging without it
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      let logged = false;
      let cancelled = false;
      const timeoutId = setTimeout(() => {
        if (!logged && !cancelled) {
          logged = true;
          doLog();
        }
      }, GPS_WAIT_MS);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!logged && !cancelled) {
            logged = true;
            clearTimeout(timeoutId);
            doLog(pos.coords.latitude, pos.coords.longitude);
          }
        },
        () => {
          if (!logged && !cancelled) {
            logged = true;
            clearTimeout(timeoutId);
            doLog();
          }
        },
        { enableHighAccuracy: true, timeout: GPS_WAIT_MS - 500, maximumAge: 60000 }
      );

      return () => {
        cancelled = true;
        clearTimeout(timeoutId);
      };
    } else {
      doLog();
    }
  }, [pathname]);

  return null;
}
