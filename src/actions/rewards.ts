'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface RewardFormData {
  survey_id: string;
  title: string;
  coupon_code?: string;
  website_url?: string;
  description?: string;
  is_active?: boolean;
}

export async function getRewards(surveyId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('rewards')
      .select('*')
      .eq('survey_id', surveyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Get rewards error:', error);
    return { success: false, error: 'Failed to fetch rewards', data: [] };
  }
}

export async function getActiveRewardForSurvey(surveyId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('rewards')
      .select('*')
      .eq('survey_id', surveyId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return { success: true, data: data || null };
  } catch (error) {
    console.error('Get active reward error:', error);
    return { success: false, error: 'Failed to fetch active reward', data: null };
  }
}

export async function createReward(formData: RewardFormData) {
  try {
    if (formData.is_active) {
      await supabaseAdmin
        .from('rewards')
        .update({ is_active: false })
        .eq('survey_id', formData.survey_id);
    }

    const { data, error } = await supabaseAdmin
      .from('rewards')
      .insert([
        {
          survey_id: formData.survey_id,
          title: formData.title,
          coupon_code: formData.coupon_code || null,
          website_url: formData.website_url || null,
          description: formData.description || null,
          is_active: formData.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/[admin]/surveys');
    revalidatePath(`/[admin]/surveys/${formData.survey_id}/rewards`);
    revalidatePath(`/survey/${formData.survey_id}`);
    return { success: true, data };
  } catch (error) {
    console.error('Create reward error:', error);
    return { success: false, error: 'Failed to create reward' };
  }
}

export async function updateReward(id: string, formData: Partial<RewardFormData>) {
  try {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('rewards')
      .select('survey_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (formData.is_active) {
      await supabaseAdmin
        .from('rewards')
        .update({ is_active: false })
        .eq('survey_id', existing.survey_id)
        .neq('id', id);
    }

    const updateData: Record<string, unknown> = {};
    if (formData.title !== undefined) updateData.title = formData.title;
    if (formData.coupon_code !== undefined) updateData.coupon_code = formData.coupon_code || null;
    if (formData.website_url !== undefined) updateData.website_url = formData.website_url || null;
    if (formData.description !== undefined) updateData.description = formData.description || null;
    if (formData.is_active !== undefined) updateData.is_active = formData.is_active;

    const { data, error } = await supabaseAdmin
      .from('rewards')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/[admin]/surveys');
    revalidatePath(`/[admin]/surveys/${existing.survey_id}/rewards`);
    revalidatePath(`/survey/${existing.survey_id}`);
    return { success: true, data };
  } catch (error) {
    console.error('Update reward error:', error);
    return { success: false, error: 'Failed to update reward' };
  }
}

export async function deleteReward(id: string, surveyId: string) {
  try {
    const { error } = await supabaseAdmin.from('rewards').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/[admin]/surveys');
    revalidatePath(`/[admin]/surveys/${surveyId}/rewards`);
    revalidatePath(`/survey/${surveyId}`);
    return { success: true };
  } catch (error) {
    console.error('Delete reward error:', error);
    return { success: false, error: 'Failed to delete reward' };
  }
}
