import { redirect } from 'next/navigation';
import { checkAdminSession } from '@/actions/auth';
import { getSurveys } from '@/actions/surveys';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { RealtimeDashboard } from '@/components/admin/RealtimeDashboard';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ admin: string }>;
}) {
  const { admin } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const surveysResult = await getSurveys();

  return (
    <div className="min-h-screen bg-muted">
      <AdminHeader
        adminPath={admin}
        title="Realtime Dashboard"
        description="Track live users and their progress"
      />
      <div className="max-w-7xl mx-auto p-6">

        <Card>
          <CardHeader>
            <CardTitle>Live Tracking</CardTitle>
            <CardDescription>
              See who is currently taking surveys in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {surveysResult.success && surveysResult.data ? (
              <RealtimeDashboard surveys={surveysResult.data} />
            ) : (
              <p className="text-muted-foreground">
                {surveysResult.error || 'No surveys available'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
