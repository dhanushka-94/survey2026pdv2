'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function useRemainingMs(expiresAtIso: string) {
  const end = new Date(expiresAtIso).getTime();
  const [, bump] = useState(0);

  useEffect(() => {
    if (Number.isNaN(end)) return;
    const id = window.setInterval(() => bump((x) => x + 1), 1000);
    return () => window.clearInterval(id);
  }, [end]);

  if (Number.isNaN(end)) return { ok: false as const };
  const ms = end - Date.now();
  if (ms <= 0) return { ok: true as const, expired: true as const, ms: 0 };
  return { ok: true as const, expired: false as const, ms };
}

function split(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { days, h, m, s };
}

type Variant = 'hero' | 'banner' | 'compact';

/** Static placeholder so SSR + first client paint match (no Date.now() in text). */
function CountdownPlaceholder({ variant }: { variant: Variant }) {
  const sizeHero = 'text-3xl sm:text-4xl';
  const sizeBanner = 'text-2xl sm:text-3xl';
  const sizeCompact = 'text-base sm:text-lg';
  const size =
    variant === 'hero' ? sizeHero : variant === 'banner' ? sizeBanner : sizeCompact;
  const suffix =
    variant === 'hero' ? 'text-base sm:text-lg' : variant === 'banner' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-center gap-x-1 gap-y-0 font-black tabular-nums tracking-tight text-orange-950/35',
        size
      )}
      aria-hidden="true"
    >
      <span>--</span>
      <span className={cn('font-bold text-orange-700/50', suffix)}>h</span>
      <span className="mx-0.5 text-orange-600/40 opacity-80"> </span>
      <span>--</span>
      <span className={cn('font-bold text-orange-700/50', suffix)}>m</span>
      <span className="mx-0.5 text-orange-600/40 opacity-80"> </span>
      <span>--</span>
      <span className={cn('font-bold text-orange-700/50', suffix)}>s</span>
    </div>
  );
}

function CountdownDigits({
  variant,
  parts,
}: {
  variant: Variant;
  parts: ReturnType<typeof split>;
}) {
  const { days, h, m, s } = parts;

  const sizeHero = 'text-3xl sm:text-4xl';
  const sizeBanner = 'text-2xl sm:text-3xl';
  const sizeCompact = 'text-base sm:text-lg';
  const size =
    variant === 'hero' ? sizeHero : variant === 'banner' ? sizeBanner : sizeCompact;
  const suffix =
    variant === 'hero' ? 'text-base sm:text-lg' : variant === 'banner' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-center gap-x-1 gap-y-0 font-black tabular-nums tracking-tight text-orange-950',
        size
      )}
      aria-live="polite"
    >
      {days > 0 && (
        <>
          <span>{days}</span>
          <span className={cn('font-bold text-orange-700', suffix)}>d</span>
          <span className="mx-0.5 text-orange-600 opacity-60"> </span>
        </>
      )}
      <span>{pad2(h)}</span>
      <span className={cn('font-bold text-orange-700', suffix)}>h</span>
      <span className="mx-0.5 text-orange-600 opacity-80"> </span>
      <span>{pad2(m)}</span>
      <span className={cn('font-bold text-orange-700', suffix)}>m</span>
      <span className="mx-0.5 text-orange-600 opacity-80"> </span>
      <span>{pad2(s)}</span>
      <span className={cn('font-bold text-orange-700', suffix)}>s</span>
    </div>
  );
}

export function SurveyExpiryCountdown({
  expiresAtIso,
  variant = 'banner',
  nested = false,
  className,
  label,
  expiredText,
}: {
  expiresAtIso: string;
  variant?: Variant;
  /** When true, only label + digits (parent supplies border/card). */
  nested?: boolean;
  className?: string;
  label?: string;
  expiredText?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const state = useRemainingMs(expiresAtIso);

  const countdownLabel =
    label ??
    (variant === 'compact' ? 'Time left' : variant === 'banner' ? 'Time left' : 'Time left to complete');

  const labelClass =
    variant === 'hero'
      ? 'text-center text-xs font-bold uppercase tracking-wide text-orange-800'
      : variant === 'banner'
        ? 'text-[10px] font-bold uppercase tracking-wider text-orange-800 sm:text-xs'
        : 'text-[10px] font-bold uppercase tracking-wide text-orange-800';

  if (!state.ok) {
    return null;
  }

  const inner = !mounted ? (
    <>
      <p className={labelClass}>{countdownLabel}</p>
      <div className={variant === 'hero' ? 'mt-2' : 'mt-1'}>
        <CountdownPlaceholder variant={variant} />
      </div>
    </>
  ) : state.expired ? (
    <p
      className={cn(
        'text-center font-bold text-red-700',
        variant === 'hero' && 'text-lg sm:text-xl',
        variant === 'banner' && 'text-base sm:text-lg',
        variant === 'compact' && 'text-sm'
      )}
    >
      {expiredText ?? 'Survey closed'}
    </p>
  ) : (
    <>
      <p className={labelClass}>{countdownLabel}</p>
      <div className={variant === 'hero' ? 'mt-2' : 'mt-1'}>
        <CountdownDigits variant={variant} parts={split(state.ms)} />
      </div>
    </>
  );

  if (nested) {
    return <div className={cn('text-center', className)}>{inner}</div>;
  }

  const shell =
    variant === 'hero'
      ? 'mt-4 rounded-xl border-2 border-orange-500 bg-gradient-to-br from-orange-100 to-amber-100 px-4 py-4 shadow-md ring-2 ring-orange-400/40'
      : variant === 'banner'
        ? 'mb-5 rounded-xl border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 text-center shadow-md ring-2 ring-orange-400/30'
        : 'rounded-lg border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-2.5 shadow-sm ring-1 ring-orange-400/30';

  return (
    <div className={cn(shell, className)} role="status">
      {inner}
    </div>
  );
}
