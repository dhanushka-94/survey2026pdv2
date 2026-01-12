import { redirect } from 'next/navigation';
import Link from 'next/link';
import { checkAdminSession } from '@/actions/auth';
import { getSurveys } from '@/actions/surveys';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { RealtimeDashboard } from '@/components/admin/RealtimeDashboard';

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
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Realtime Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Track live users and their progress
            </p>
          </div>
          <Link href={`/${admin}/surveys`}>
            <Button variant="secondary" size="sm" className="sm:size-default">Surveys</Button>
          </Link>
        </div>

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
