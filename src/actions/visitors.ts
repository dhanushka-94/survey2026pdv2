'use server';

import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getDeviceInfoFromUA } from '@/lib/utils';

export async function logVisitor(data: {
  path: string;
  referrer?: string;
  userAgent?: string;
}) {
  try {
    const headersList = await headers();

    const userAgent = data.userAgent || headersList.get('user-agent') || '';
    const referrer = data.referrer ?? headersList.get('referer') ?? '';
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : headersList.get('x-real-ip') || null;

    const { device_type, browser, os } = getDeviceInfoFromUA(userAgent);

    const { error } = await supabaseAdmin.from('visitor_logs').insert([
      {
        path: data.path,
        referrer: referrer || null,
        user_agent: userAgent || null,
        browser,
        os,
        device_type,
        ip_address: ip,
      },
    ]);

    if (error) {
      console.error('Visitor log error:', error);
      return { success: false };
    }
    return { success: true };
  } catch (e) {
    console.error('Visitor log error:', e);
    return { success: false };
  }
}

export async function getVisitorLogs(options?: {
  limit?: number;
  offset?: number;
  path?: string;
  pathContains?: string;
  from?: string;
  to?: string;
  device_type?: string;
  browser?: string;
  os?: string;
}) {
  try {
    let query = supabaseAdmin
      .from('visitor_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (options?.path) {
      query = query.eq('path', options.path);
    }
    if (options?.pathContains) {
      query = query.ilike('path', `%${options.pathContains}%`);
    }
    if (options?.from) {
      query = query.gte('created_at', options.from);
    }
    if (options?.to) {
      query = query.lte('created_at', options.to);
    }
    if (options?.device_type) {
      query = query.eq('device_type', options.device_type);
    }
    if (options?.browser) {
      query = query.eq('browser', options.browser);
    }
    if (options?.os) {
      query = query.eq('os', options.os);
    }

    const limit = options?.limit || 100;
    const offset = options?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { success: true, data: data || [], count: count || 0 };
  } catch (error) {
    console.error('Get visitor logs error:', error);
    return { success: false, data: [], count: 0 };
  }
}

export async function getVisitorFilterOptions() {
  try {
    const { data: paths } = await supabaseAdmin
      .from('visitor_logs')
      .select('path')
      .limit(500);

    const uniquePaths = [...new Set((paths || []).map((p) => p.path).filter(Boolean))].sort();

    const { data: devices } = await supabaseAdmin
      .from('visitor_logs')
      .select('device_type')
      .not('device_type', 'is', null);

    const uniqueDevices = [...new Set((devices || []).map((d) => d.device_type).filter(Boolean))].sort();

    const { data: browsers } = await supabaseAdmin
      .from('visitor_logs')
      .select('browser')
      .not('browser', 'is', null);

    const uniqueBrowsers = [...new Set((browsers || []).map((b) => b.browser).filter(Boolean))].sort();

    const { data: osList } = await supabaseAdmin
      .from('visitor_logs')
      .select('os')
      .not('os', 'is', null);

    const uniqueOs = [...new Set((osList || []).map((o) => o.os).filter(Boolean))].sort();

    return {
      success: true,
      paths: uniquePaths,
      devices: uniqueDevices,
      browsers: uniqueBrowsers,
      os: uniqueOs,
    };
  } catch (error) {
    console.error('Get filter options error:', error);
    return { success: false, paths: [], devices: [], browsers: [], os: [] };
  }
}

export async function getVisitorStats() {
  try {
    const today = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { count: total } = await supabaseAdmin
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true });

    const { count: todayCount } = await supabaseAdmin
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    const { count: weekCount } = await supabaseAdmin
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo);

    // Unique visitors (by IP) today
    const { data: uniqueToday } = await supabaseAdmin
      .from('visitor_logs')
      .select('ip_address')
      .gte('created_at', today);

    const uniqueIPsToday = new Set((uniqueToday || []).map((r) => r.ip_address).filter(Boolean)).size;

    return {
      success: true,
      stats: {
        total: total || 0,
        today: todayCount || 0,
        last7Days: weekCount || 0,
        uniqueToday: uniqueIPsToday,
      },
    };
  } catch (error) {
    console.error('Get visitor stats error:', error);
    return { success: false, stats: null };
  }
}
