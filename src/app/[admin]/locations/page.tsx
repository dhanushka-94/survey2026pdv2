import { redirect } from 'next/navigation';
import Link from 'next/link';
import { checkAdminSession } from '@/actions/auth';
import { getGpsLocations } from '@/actions/tracking';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils';

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ admin: string }>;
}) {
  const { admin } = await params;
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect(`/${admin}`);
  }

  const result = await getGpsLocations();
  const locations = result.success ? result.data || [] : [];

  return (
    <div className="min-h-screen bg-muted">
      <AdminHeader
        adminPath={admin}
        title="GPS Locations"
        description="Survey filling device locations from session tracking"
        actions={
          <Link href={`/${admin}/dashboard`}>
            <Button variant="secondary" size="sm">
              Dashboard
            </Button>
          </Link>
        }
      />
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>📍 Survey Device Locations</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {locations.length} location{locations.length !== 1 ? 's' : ''} logged
              (devices that allowed GPS access while filling surveys)
            </p>
          </CardHeader>
          <CardContent>
            {locations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No GPS locations recorded yet</p>
                <p className="text-sm mt-2">
                  Locations appear when users allow location access while taking surveys
                </p>
                <p className="text-sm mt-2">
                  View <Link href={`/${admin}/surveys`} className="text-primary hover:underline">Individual Responses</Link> per survey for GPS data tied to completed responses
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-semibold">Survey</th>
                      <th className="text-left py-3 px-2 font-semibold">Time</th>
                      <th className="text-left py-3 px-2 font-semibold">Coordinates</th>
                      <th className="text-left py-3 px-2 font-semibold">Session</th>
                      <th className="w-24" />
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((loc) => (
                      <tr
                        key={loc.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <Link
                            href={`/${admin}/surveys/${loc.survey_id}/responses`}
                            className="text-primary hover:underline font-medium"
                          >
                            {loc.survey_title}
                          </Link>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                          {formatDateTime(loc.last_active_at)}
                        </td>
                        <td className="py-3 px-2 font-mono text-xs">
                          {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}
                        </td>
                        <td className="py-3 px-2 font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                          {loc.session_id.substring(0, 16)}…
                        </td>
                        <td className="py-3 px-2">
                          <a
                            href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xs font-medium"
                          >
                            View on Map
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
