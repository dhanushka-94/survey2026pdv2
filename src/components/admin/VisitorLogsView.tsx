'use client';

import { Fragment, useState } from 'react';
import { formatDateTime } from '@/lib/utils';

interface VisitorLog {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  browser: string | null;
  os: string | null;
  device_type: string | null;
  ip_address: string | null;
  created_at: string;
}

interface VisitorLogsViewProps {
  logs: VisitorLog[];
}

export function VisitorLogsView({ logs }: VisitorLogsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No visitor logs yet</p>
        <p className="text-sm mt-2">Visits will appear here once users browse your site</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-semibold">Time</th>
            <th className="text-left py-3 px-2 font-semibold">Path</th>
            <th className="text-left py-3 px-2 font-semibold hidden sm:table-cell">Device</th>
            <th className="text-left py-3 px-2 font-semibold hidden md:table-cell">Browser</th>
            <th className="text-left py-3 px-2 font-semibold hidden lg:table-cell">IP</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <Fragment key={log.id}>
              <tr
                key={log.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                  {formatDateTime(log.created_at)}
                </td>
                <td className="py-3 px-2 font-mono text-xs max-w-[200px] truncate" title={log.path}>
                  {log.path}
                </td>
                <td className="py-3 px-2 hidden sm:table-cell">
                  <span className="capitalize">{log.device_type || '—'}</span>
                </td>
                <td className="py-3 px-2 hidden md:table-cell">{log.browser || '—'}</td>
                <td className="py-3 px-2 hidden lg:table-cell font-mono text-xs">
                  {log.ip_address ? `${log.ip_address.slice(0, 12)}…` : '—'}
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    className="text-primary hover:underline text-xs"
                  >
                    {expandedId === log.id ? 'Hide' : 'Details'}
                  </button>
                </td>
              </tr>
              {expandedId === log.id && (
                <tr key={`${log.id}-details`} className="bg-muted/20">
                  <td colSpan={6} className="py-4 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-semibold text-foreground mb-2">Full Details</p>
                        <dl className="space-y-1">
                          <div><dt className="text-muted-foreground inline">Path: </dt><dd className="inline font-mono break-all">{log.path}</dd></div>
                          <div><dt className="text-muted-foreground inline">Referrer: </dt><dd className="inline font-mono break-all">{log.referrer || '—'}</dd></div>
                          <div><dt className="text-muted-foreground inline">IP: </dt><dd className="inline font-mono">{log.ip_address || '—'}</dd></div>
                        </dl>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-2">Device Info</p>
                        <dl className="space-y-1">
                          <div><dt className="text-muted-foreground inline">Browser: </dt><dd className="inline">{log.browser || '—'}</dd></div>
                          <div><dt className="text-muted-foreground inline">OS: </dt><dd className="inline">{log.os || '—'}</dd></div>
                          <div><dt className="text-muted-foreground inline">Device: </dt><dd className="inline capitalize">{log.device_type || '—'}</dd></div>
                        </dl>
                        {log.user_agent && (
                          <p className="mt-2 text-muted-foreground break-all" title={log.user_agent}>
                            User-Agent: {log.user_agent.slice(0, 80)}…
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
