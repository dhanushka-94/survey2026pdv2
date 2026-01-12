import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { checkAdminSession } from '@/actions/auth';
import { getSurvey } from '@/actions/surveys';
import { getAggregatedResults } from '@/actions/responses';
import { getMediaViewStats } from '@/actions/tracking';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ResultsView } from '@/components/admin/ResultsView';

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ admin: string; id: string }>;
}) {
  const { admin, id } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const [surveyResult, resultsData, mediaViewsData] = await Promise.all([
    getSurvey(id),
    getAggregatedResults(id),
    getMediaViewStats(id),
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
              Aggregated Results
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {surveyResult.data.title}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${admin}/surveys/${id}/responses`}>
              <Button variant="secondary" size="sm">
                Individual Responses
              </Button>
            </Link>
            <Link href={`/${admin}/surveys`}>
              <Button variant="secondary" size="sm">
                Back to Surveys
              </Button>
            </Link>
          </div>
        </div>

        {resultsData.success && resultsData.data ? (
          <ResultsView 
            results={resultsData.data} 
            mediaViews={mediaViewsData.success ? mediaViewsData.data : []}
          />
        ) : (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                {resultsData.error || 'No results available'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
