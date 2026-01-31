'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { logoutAdmin } from '@/actions/auth';

interface AdminHeaderProps {
  adminPath: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ adminPath, title, description, actions }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logoutAdmin();
      router.push(`/${adminPath}`);
    }
  };

  return (
    <div className="bg-white border-b border-border shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top Bar - Navigation */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <Link href={`/${adminPath}/dashboard`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                📊 Dashboard
              </Button>
            </Link>
            <Link href={`/${adminPath}/surveys`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                📋 Surveys
              </Button>
            </Link>
            <Link href={`/${adminPath}/visitors`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                👥 Visitors
              </Button>
            </Link>
            <Link href={`/${adminPath}/locations`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                📍 Locations
              </Button>
            </Link>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex gap-2 sm:gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
