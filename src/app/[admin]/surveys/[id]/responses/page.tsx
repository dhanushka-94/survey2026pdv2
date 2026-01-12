import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { checkAdminSession } from '@/actions/auth';
import { getSurvey } from '@/actions/surveys';
import { getIndividualResponses } from '@/actions/responses';
import { Button } from '@/components/ui/Button';
import { IndividualResponsesView } from '@/components/admin/IndividualResponsesView';

export default async function IndividualResponsesPage({
  params,
}: {
  params: Promise<{ admin: string; id: string }>;
}) {
  const { admin, id } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const [surveyResult, responsesResult] = await Promise.all([
    getSurvey(id),
    getIndividualResponses(id),
  ]);

  if (!surveyResult.success || !surveyResult.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Individual Responses
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {surveyResult.data.title}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${admin}/surveys/${id}/results`}>
              <Button variant="secondary" size="sm">
                Aggregated Results
              </Button>
            </Link>
            <Link href={`/${admin}/surveys`}>
              <Button variant="secondary" size="sm">
                Back to Surveys
              </Button>
            </Link>
          </div>
        </div>

        <IndividualResponsesView 
          responses={responsesResult.success ? responsesResult.data || [] : []}
          surveyTitle={surveyResult.data.title}
        />
      </div>
    </div>
  );
}
