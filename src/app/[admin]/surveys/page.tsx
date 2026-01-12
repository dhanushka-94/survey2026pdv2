import Link from 'next/link';
import { redirect } from 'next/navigation';
import { checkAdminSession, getAdminPath } from '@/actions/auth';
import { getSurveys } from '@/actions/surveys';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { SurveyList } from '@/components/admin/SurveyList';

export default async function SurveysPage({
  params,
}: {
  params: Promise<{ admin: string }>;
}) {
  const { admin } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const result = await getSurveys();

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Surveys</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage your surveys, categories, and questions
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href={`/${admin}/dashboard`}>
              <Button variant="secondary" size="sm" className="sm:size-default">Dashboard</Button>
            </Link>
            <Link href={`/${admin}/surveys/new`}>
              <Button size="sm" className="sm:size-default">Create Survey</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success && result.data ? (
              <SurveyList surveys={result.data} adminPath={admin} />
            ) : (
              <p className="text-muted-foreground">
                {result.error || 'No surveys found'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
