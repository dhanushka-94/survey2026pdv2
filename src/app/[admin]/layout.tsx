import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminPath } from '@/actions/auth';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Survey System',
  description: 'Admin dashboard for managing surveys',
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ admin: string }>;
}) {
  const { admin } = await params;
  const expectedPath = await getAdminPath();

  // Verify the admin path matches
  if (admin !== expectedPath) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
