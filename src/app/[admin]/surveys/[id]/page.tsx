import { redirect, notFound } from 'next/navigation';
import { checkAdminSession } from '@/actions/auth';
import { getSurvey } from '@/actions/surveys';
import { SurveyForm } from '@/components/admin/SurveyForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export default async function EditSurveyPage({
  params,
}: {
  params: Promise<{ admin: string; id: string }>;
}) {
  const { admin, id } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const result = await getSurvey(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
          Edit Survey
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Survey Details</CardTitle>
            <CardDescription>
              Update the information below to modify the survey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyForm adminPath={admin} survey={result.data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
