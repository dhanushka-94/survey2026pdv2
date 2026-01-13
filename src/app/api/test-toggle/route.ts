import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { surveyId, newStatus } = await request.json();

    console.log('Attempting to toggle survey:', surveyId, 'to', newStatus);

    const { data, error } = await supabaseAdmin
      .from('surveys')
      .update({ is_active: newStatus })
      .eq('id', surveyId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
      });
    }

    console.log('Toggle successful:', data);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
