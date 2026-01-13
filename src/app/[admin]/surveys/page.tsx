import Link from 'next/link';
import { redirect } from 'next/navigation';
import { checkAdminSession } from '@/actions/auth';
import { getSurveys } from '@/actions/surveys';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { SurveyList } from '@/components/admin/SurveyList';
import { AdminHeader } from '@/components/admin/AdminHeader';

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
      <AdminHeader
        adminPath={admin}
        title="Surveys"
        description="Manage your surveys, categories, and questions"
        actions={
            <Link href={`/${admin}/surveys/new`}>
              <Button size="sm" className="sm:size-default">Create Survey</Button>
            </Link>
        }
      />
      <div className="max-w-7xl mx-auto p-6">

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
