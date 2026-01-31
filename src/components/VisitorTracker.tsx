'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { logVisitor } from '@/actions/visitors';

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

    logVisitor({
      path: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });
  }, [pathname]);

  return null;
}
