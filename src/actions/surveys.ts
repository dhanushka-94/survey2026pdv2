'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Survey, SurveyFormData } from '@/lib/types';

export async function getSurveys() {
  try {
    const { data, error } = await supabaseAdmin
      .from('surveys')
      .select(`
        *,
        categories (count),
        questions (count),
        responses (count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get surveys error:', error);
    return { success: false, error: 'Failed to fetch surveys' };
  }
}

export async function getSurvey(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('surveys')
      .select(`
        *,
        categories (
          *,
          questions (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get survey error:', error);
    return { success: false, error: 'Failed to fetch survey' };
  }
}

export async function createSurvey(formData: SurveyFormData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('surveys')
      .insert([
        {
          title: formData.title,
          description: formData.description || null,
          is_active: formData.is_active,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/[admin]/surveys');
    return { success: true, data };
  } catch (error) {
    console.error('Create survey error:', error);
    return { success: false, error: 'Failed to create survey' };
  }
}

export async function updateSurvey(id: string, formData: Partial<SurveyFormData>) {
  try {
    const updateData: any = {};
    
    if (formData.title !== undefined) updateData.title = formData.title;
    if (formData.description !== undefined) updateData.description = formData.description || null;
    if (formData.is_active !== undefined) updateData.is_active = formData.is_active;
    if (formData.start_date !== undefined) updateData.start_date = formData.start_date || null;
    if (formData.end_date !== undefined) updateData.end_date = formData.end_date || null;

    const { data, error } = await supabaseAdmin
      .from('surveys')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/[admin]/surveys');
    revalidatePath(`/[admin]/surveys/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error('Update survey error:', error);
    return { success: false, error: 'Failed to update survey' };
  }
}

export async function deleteSurvey(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('surveys')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/[admin]/surveys');
    return { success: true };
  } catch (error) {
    console.error('Delete survey error:', error);
    return { success: false, error: 'Failed to delete survey' };
  }
}

export async function toggleSurveyStatus(id: string, isActive: boolean) {
  try {
    const { data, error } = await supabaseAdmin
      .from('surveys')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/[admin]/surveys');
    return { success: true, data };
  } catch (error) {
    console.error('Toggle survey status error:', error);
    return { success: false, error: 'Failed to toggle survey status' };
  }
}
