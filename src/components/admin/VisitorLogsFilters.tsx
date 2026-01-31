'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface VisitorLogsFiltersProps {
  adminPath: string;
  paths: string[];
  devices: string[];
  browsers: string[];
  osList: string[];
}

export function VisitorLogsFilters({
  adminPath,
  paths,
  devices,
  browsers,
  osList,
}: VisitorLogsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pathFromUrl = searchParams.get('path') || '';
  const [pathInput, setPathInput] = useState(pathFromUrl);

  useEffect(() => {
    setPathInput(pathFromUrl);
  }, [pathFromUrl]);

  const pathContains = pathFromUrl;
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const device = searchParams.get('device') || '';
  const browser = searchParams.get('browser') || '';
  const os = searchParams.get('os') || '';
  const hasGps = searchParams.get('gps') === '1';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/${adminPath}/visitors?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/${adminPath}/visitors`);
  };

  const deviceOptions = [{ value: '', label: 'All devices' }, ...devices.map((d) => ({ value: d, label: d }))];
  const browserOptions = [{ value: '', label: 'All browsers' }, ...browsers.map((b) => ({ value: b, label: b }))];
  const osOptions = [{ value: '', label: 'All OS' }, ...osList.map((o) => ({ value: o, label: o }))];

  const hasFilters = pathContains || from || to || device || browser || os || hasGps;

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-foreground">🔍 Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Path contains</label>
          <Input
            placeholder="e.g. /survey"
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateFilter('path', pathInput.trim())}
            onBlur={() => updateFilter('path', pathInput.trim())}
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">From Date</label>
          <Input
            type="date"
            value={from}
            onChange={(e) => updateFilter('from', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">To Date</label>
          <Input
            type="date"
            value={to}
            onChange={(e) => updateFilter('to', e.target.value)}
          />
        </div>
        {devices.length > 0 && (
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Device</label>
            <Select
              value={device}
              onChange={(e) => updateFilter('device', e.target.value)}
              options={deviceOptions}
            />
          </div>
        )}
        {browsers.length > 0 && (
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Browser</label>
            <Select
              value={browser}
              onChange={(e) => updateFilter('browser', e.target.value)}
              options={browserOptions}
            />
          </div>
        )}
        {osList.length > 0 && (
          <div>
            <label className="block text-xs text-muted-foreground mb-1">OS</label>
            <Select
              value={os}
              onChange={(e) => updateFilter('os', e.target.value)}
              options={osOptions}
            />
          </div>
        )}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">GPS</label>
          <Select
            value={hasGps ? '1' : ''}
            onChange={(e) => updateFilter('gps', e.target.value)}
            options={[
              { value: '', label: 'All visitors' },
              { value: '1', label: '📍 With GPS only' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
