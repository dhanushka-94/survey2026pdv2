import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { checkAdminSession } from '@/actions/auth';
import { getSurvey } from '@/actions/surveys';
import { getRewards } from '@/actions/rewards';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RewardManager } from '@/components/admin/RewardManager';

export default async function RewardsPage({
  params,
}: {
  params: Promise<{ admin: string; id: string }>;
}) {
  const { admin, id } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const [surveyResult, rewardsResult] = await Promise.all([
    getSurvey(id),
    getRewards(id),
  ]);

  if (!surveyResult.success || !surveyResult.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Final Rewards</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">{surveyResult.data.title}</p>
          </div>
          <Link href={`/${admin}/surveys`}>
            <Button variant="secondary" size="sm" className="sm:size-default">Back to Surveys</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Final Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <RewardManager surveyId={id} rewards={rewardsResult.success ? rewardsResult.data || [] : []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
