import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { checkAdminSession } from '@/actions/auth';
import { getSurvey } from '@/actions/surveys';
import { getCategories } from '@/actions/categories';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CategoryManager } from '@/components/admin/CategoryManager';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ admin: string; id: string }>;
}) {
  const { admin, id } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const [surveyResult, categoriesResult] = await Promise.all([
    getSurvey(id),
    getCategories(id),
  ]);

  if (!surveyResult.success || !surveyResult.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Categories
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {surveyResult.data.title}
            </p>
          </div>
          <Link href={`/${admin}/surveys`}>
            <Button variant="secondary" size="sm" className="sm:size-default">Back to Surveys</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryManager
              surveyId={id}
              categories={categoriesResult.success ? categoriesResult.data || [] : []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
