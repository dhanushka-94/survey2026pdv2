import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const surveyId = formData.get('surveyId') as string;
    const newStatus = formData.get('newStatus') === 'true';

    console.log('Attempting to toggle survey:', surveyId, 'to', newStatus);

    const { data, error } = await supabaseAdmin
      .from('surveys')
      .update({ is_active: newStatus })
      .eq('id', surveyId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        `<html><body><h1>Error</h1><p>${error.message}</p><a href="/test-db">Go Back</a></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    console.log('Toggle successful:', data);

    // Redirect back to test page
    return redirect('/test-db');
  } catch (error: any) {
    console.error('API error:', error);
    return new Response(
      `<html><body><h1>Error</h1><p>${error.message}</p><a href="/test-db">Go Back</a></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
