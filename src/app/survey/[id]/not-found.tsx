import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-50 to-red-50 p-6">
      <Card className="max-w-md w-full border-primary/20 shadow-xl">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mb-6">
            <div className="text-7xl mb-4">💔</div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500 mb-3">
              Survey Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              The survey you're looking for doesn't exist or is no longer active.
            </p>
            <div className="bg-primary-lighter border border-primary/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                <span>💝</span>
                Check back later for new surveys
              </p>
            </div>
          </div>
          <Link href="/">
            <Button className="gap-2">
              <span>🏠</span>
              Go Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
