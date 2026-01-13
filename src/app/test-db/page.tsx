import { supabaseAdmin } from '@/lib/supabase/admin';
import { ToggleTest } from './toggle-test';

export default async function TestDBPage() {
  let surveys = [];
  let error = null;

  try {
    const { data, error: fetchError } = await supabaseAdmin
      .from('surveys')
      .select('*');
    
    if (fetchError) throw fetchError;
    surveys = data || [];
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-lg mb-2">Environment Variables:</h2>
            <div className="bg-gray-50 p-4 rounded text-sm space-y-1 font-mono">
              <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p>ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
              <p>SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <h2 className="font-semibold text-red-700 mb-2">❌ Database Error:</h2>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <h2 className="font-semibold text-green-700 mb-2">✅ Database Connected!</h2>
              <p className="text-sm text-gray-600">Found {surveys.length} survey(s)</p>
            </div>
          )}

          {surveys.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Surveys in Database:</h2>
              <div className="space-y-2">
                {surveys.map((survey: any) => (
                  <div key={survey.id} className="bg-gray-50 p-4 rounded border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{survey.title}</h3>
                        <p className="text-sm text-gray-600">ID: {survey.id}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          survey.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {survey.is_active ? '✅ ACTIVE' : '❌ INACTIVE'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Start: {survey.start_date || 'Not set'}
                        </p>
                        <p className="text-xs text-gray-500">
                          End: {survey.end_date || 'Not set'}
                        </p>
                      </div>
                    </div>
                    <ToggleTest survey={survey} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
