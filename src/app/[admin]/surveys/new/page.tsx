import { redirect } from 'next/navigation';
import { checkAdminSession } from '@/actions/auth';
import { SurveyForm } from '@/components/admin/SurveyForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export default async function NewSurveyPage({
  params,
}: {
  params: Promise<{ admin: string }>;
}) {
  const { admin } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Create New Survey
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Survey Details</CardTitle>
            <CardDescription>
              Fill in the information below to create a new survey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyForm adminPath={admin} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
