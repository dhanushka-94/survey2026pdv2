'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { SurveyFormData } from '@/lib/types';
import {
  parseSurveyExpiresAt,
  parseSurveyStartDate,
} from '@/lib/utils';

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
    const expiresAt = parseSurveyExpiresAt(
      formData.expires_at || formData.end_date
    );
    const startAt = parseSurveyStartDate(formData.start_date);

    const { data, error } = await supabaseAdmin
      .from('surveys')
      .insert([
        {
          title: formData.title,
          description: formData.description || null,
          is_active: formData.is_active,
          block_multiple_submissions_per_device:
            formData.block_multiple_submissions_per_device ?? false,
          start_date: startAt,
          expires_at: expiresAt,
          end_date: expiresAt,
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
    const updateData: Record<string, unknown> = {};
    
    if (formData.title !== undefined) updateData.title = formData.title;
    if (formData.description !== undefined) updateData.description = formData.description || null;
    if (formData.is_active !== undefined) updateData.is_active = formData.is_active;
    if (formData.block_multiple_submissions_per_device !== undefined) {
      updateData.block_multiple_submissions_per_device =
        formData.block_multiple_submissions_per_device;
    }
    if (formData.start_date !== undefined) {
      updateData.start_date = parseSurveyStartDate(formData.start_date);
    }
    if (formData.expires_at !== undefined || formData.end_date !== undefined) {
      const expiresAt = parseSurveyExpiresAt(
        formData.expires_at ?? formData.end_date
      );
      updateData.expires_at = expiresAt;
      updateData.end_date = expiresAt;
    }

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
