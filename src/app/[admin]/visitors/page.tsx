import { redirect } from 'next/navigation';
import Link from 'next/link';
import { checkAdminSession } from '@/actions/auth';
import { getVisitorLogs, getVisitorStats } from '@/actions/visitors';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VisitorLogsView } from '@/components/admin/VisitorLogsView';

export default async function VisitorsPage({
  params,
}: {
  params: Promise<{ admin: string }>;
}) {
  const { admin } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const [statsResult, logsResult] = await Promise.all([
    getVisitorStats(),
    getVisitorLogs({ limit: 100 }),
  ]);

  const stats = statsResult.success ? statsResult.stats : null;
  const logs = logsResult.success ? logsResult.data || [] : [];
  const totalCount = logsResult.count || 0;

  return (
    <div className="min-h-screen bg-muted">
      <AdminHeader
        adminPath={admin}
        title="Visitor Logs"
        description="Track every visitor to your site"
        actions={
          <Link href={`/${admin}/dashboard`}>
            <Button variant="secondary" size="sm">
              Dashboard
            </Button>
          </Link>
        }
      />
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Visits</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
                <p className="text-sm text-muted-foreground mt-1">Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-green-600">{stats.last7Days}</p>
                <p className="text-sm text-muted-foreground mt-1">Last 7 Days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-purple-600">{stats.uniqueToday}</p>
                <p className="text-sm text-muted-foreground mt-1">Unique Today (by IP)</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Visitor Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Last 100 visits • {totalCount} total logged
            </p>
          </CardHeader>
          <CardContent>
            <VisitorLogsView logs={logs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
